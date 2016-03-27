/*
 * SpidochePath
 *
 * Version : 0.3
 * Author  : Spidoche
 *
 */
function SpidochePath(settings){

    "use strict";

    // Do nothing if canvas not support
    if(!this.isCanvasSupported) return;

    // Get settings
    this.settings = settings || {};
    this.canvas = this.settings.id || {};
    this.paths = this.settings.paths || [];
    this.canvas_bg = "#b9b9b9";
    this.stroke_color = "#ffffff";
    this.cercle_color = "#ffffff";
    this.fill_color = this.settings.fill_color || "#ffffff";
    this.fill_color_rgb = "";
    this.cercle_radius = 3;
    this.min_dist_fill = 80;
    this.min_dist_anim = 35;
    this.show_line = true;
    this.show_point = true;
    this.fill = true;
    this.initRatio = 1;
    this.paths_orginal = [];
    this.is_morph = false;
    this.morph_path = null;
    this.speed = 2;

    this.ctx = this.canvas.getContext('2d');
    this.initWidth = this.canvas.width;
    this.mouse = {};
    this.click = {};

    // RequestAnimationFrame polyfill only if not support
    if ( !window.requestAnimationFrame ) {
        this.raf();
    }

    // Run
    this.init();

    // Debug
    // this.x_y_getter();

}

SpidochePath.prototype = {

    init : function(){

        // set canvascolor if option defined
        this.canvas.style.backgroundColor = this.canvas_bg;

        // make canvas hdpi ready
        this.hdpi_canvas(this.canvas,this.ctx);

        this.mouse.x = 0;
        this.mouse.y = 0;

        // copy the paths
        this.paths = JSON.parse(JSON.stringify(this.paths));
        this.paths_orginal = JSON.parse(JSON.stringify(this.paths));

        // Run
        this.event_handler();
        this.draw();
        this.animate();

    },

    // Draw
    draw : function() {

        var ctx = this.ctx;
        var paths = this.paths;
        var paths_orginal = this.paths_orginal;
        var mouse = this.mouse;
        var morph_paths = this.morph_path;

        // Draw lines
        for(var i = 0; i < this.paths.length; i++){

            var path = paths[i];
            var path_orginal = paths_orginal[i];


            this.opacity = 0 ;

            if(this.is_morph){
                var morph_path = morph_paths[i];
            }

            ctx.beginPath();
            ctx.moveTo(path[0].x,path[0].y);

            for(var j = 0; j < paths[i].length; j++){

                ctx.lineTo(path[j].x,path[j].y);

                // fill the path
                if(this.is_near( path_orginal[j], this.min_dist_fill, mouse )){
                    this.opacity += 0.1;
                    //paths[i].active = 1;
                }

                if(this.is_morph){
                    this.animateTo(path[j], morph_path[j].x , morph_path[j].y);

                    path_orginal[j].x = morph_path[j].x;
                    path_orginal[j].y = morph_path[j].y;
                }

                // animate path
                if(this.is_near( path_orginal[j], this.min_dist_anim, mouse )){
                    this.animateTo(path[j],mouse.x,mouse.y);
                    path[j].move = 1;
                }else if(path[j].move === 1){
                    this.animateTo(path[j],path_orginal[j].x, path_orginal[j].y);
                    path[j].move = 0;
                }

            }

            if(this.show_line){
                ctx.lineTo(path[0].x,path[0].y); //close the path
                ctx.strokeStyle = this.stroke_color;
                ctx.stroke();
            }


            if(this.fill){
                this.fill_color_rgb = this.hex2rgb(this.fill_color);
                ctx.fillStyle = 'rgba('+this.fill_color_rgb+','+this.opacity+')';
                ctx.fill();
            }

            ctx.closePath();

        }

        // Draw Point
        if(this.show_point){
            for(var k = 0; k < paths.length; k++){
                var point = paths[k];

                for(var l = 0; l < paths[k].length; l++){
                    ctx.beginPath();
                    ctx.arc(point[l].x,point[l].y,this.cercle_radius,0,2*Math.PI);
                    ctx.fillStyle = this.cercle_color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }

        if(this.is_morph) this.is_morph = false;

    },

    // Animate
    animate : function(){

        stats.begin();
        var c = this.canvas;
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        this.draw();
        stats.end();

        requestAnimationFrame(this.animate.bind(this));

    },

    // EVENT HANDLER
    event_handler : function(){

        // track mouse coordonate
        var _this = this;
        var c = this.canvas;
        var mouse_ratio = 1;
        if(this.initWidth > window.innerWidth){
            mouse_ratio = (c.width/this.initRatio)/this.initWidth;
        }

        c.addEventListener('mousemove',function(e){

            _this.mouse.x = (e.clientX - c.getBoundingClientRect().left)/mouse_ratio;
            _this.mouse.y = (e.clientY - c.getBoundingClientRect().top)/mouse_ratio;

        });

        // Window onresize
        window.addEventListener('resize',function(){
            //_this.init();
        });

    },

    // UTILITY
    // canvas  support
    isCanvasSupported : function(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },

    // Move animation
    animateTo : function(el,x,y){
        TweenLite.to(el, this.speed, {x:x, y:y, ease: Elastic.easeOut.config(1, 0.3)});
    },

    // Set morph
    morph : function(paths){
        this.is_morph = true;
        this.morph_path = paths;
    },

    // Get random
    get_random : function(min,max){
        return Math.random() * (max-min) + min;
    },

    // Check if mouse if near a point
    is_near : function( point, distance) {
        var left = point.x - distance,
            top = point.y - distance,
            right = point.x + distance,
            bottom = point.y + distance ,
            x = this.mouse.x,
            y = this.mouse.y;

        return ( x > left && x < right && y > top && y < bottom );
    },

    // Get mouse coordonate on click
    x_y_getter : function(){

        var c = this.canvas;
        var ctx = this.ctx;
        var arr = '';
        c.addEventListener('click',function(e){
            arr += '{x: '+ e.clientX + ', y: '+ e.clientY + '},';
            console.log(arr);
            console.log(ctx.currentTransform);
        },false);

    },

    // Get the ratio
    get_ratio : function(canvas,context){

        // http://www.html5rocks.com/en/tutorials/canvas/hidpi/
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                                context.mozBackingStorePixelRatio ||
                                context.msBackingStorePixelRatio ||
                                context.oBackingStorePixelRatio ||
                                context.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;
        var c = canvas;
        var canvas_ratio = c.width/c.height;
        var initWidth = this.initWidth; //canvas.width;

        this.initRatio = ratio;

        if(initWidth > window.innerWidth){
            c.width = window.innerWidth;
            c.height = c.width/canvas_ratio;
        }

        // upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = c.width;
            var oldHeight = c.height;

            c.width = oldWidth * ratio;
            c.height = oldHeight * ratio;

            c.style.width = oldWidth + 'px';
            c.style.height = oldHeight + 'px';

            if(initWidth > window.innerWidth){
                ratio = (c.width/initWidth);
            }

            return ratio;
        }

    },

    // HDPI (retina) canvas
    hdpi_canvas : function(){

        var c = this.canvas;
        var ctx = this.ctx;
        var ratio = this.get_ratio(c,ctx);
        ctx.scale(ratio, ratio);

    },

    // Convert hex to rgba
    hex2rgb : function(hex, opacity) {
        var h=hex.replace('#', '');
        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

        for(var i=0; i<h.length; i++)
            h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

        //if (typeof opacity != 'undefined')  h.push(opacity);

        //return 'rgba('+h.join(',')+')';
        return h.join(',');
    },

    // RequestAnimationFrame polyfill (@paulirish http://paulirish.com)
    raf : function(){
        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
            };

        } )();
    }


}; // End Prototype







