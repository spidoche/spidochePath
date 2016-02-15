(function() {

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

    hdpi_canvas(c,ctx);

    var mouse = {};
    mouse.x = 0;
    mouse.y = 0;

    // Debugger get x / y on click
    // x_y_getter();

    // Particules settings
    /*
    var paths = [
        [{x:231, y:281},{x:168, y:281},{x:198, y:203}],
        [{x:155, y:152},{x:198, y:203},{x:183, y:242}],
        [{x:146, y:242},{x:175, y:219},{x:183, y:242},{x:168, y:281}],
        [{x:112, y:242},{x:147, y:242},{x:175, y:219},{x:168, y:193}],
        [{x:155, y:152},{x:140, y:217},{x:168, y:193}],
        [{x:226, y:178},{x:189, y:193},{x:198, y:203}],
        [{x:279, y:247},{x:231, y:281},{x:198, y:203}],
        [{x:226, y:178},{x:279, y:247},{x:198, y:203}],
        [{x:294, y:185},{x:279, y:247},{x:257, y:219}],
        [{x:226, y:178},{x:257, y:219},{x:245, y:126}],
        [{x:294, y:185},{x:245, y:126},{x:257, y:219}],
        [{x:344, y:247},{x:280, y:247},{x:294, y:185}],
        [{x:343, y:173},{x:343, y:248},{x:294, y:185}],
        [{x:294, y:297},{x:343, y:248},{x:280, y:247}],
        [{x:257, y:313},{x:294, y:297},{x:280, y:247}],
        [{x:231, y:281},{x:257, y:313},{x:280, y:247}],
        [{x:348, y:55},{x:245, y:126},{x:294, y:185}],
        [{x:343, y:173},{x:321, y:120},{x:294, y:185}],
        [{x:226, y:178},{x:155, y:152},{x:189, y:193}],
        [{x:245, y:126},{x:161, y:71},{x:348, y:55}],
        [{x:226, y:178},{x:245, y:126},{x:161, y:71}],
        [{x:155, y:152},{x:226, y:178},{x:161, y:71}],
    ];
    */
     var paths = [
        [{x:329,y:371},{x:306,y:358},{x:312,y:396}],
        [{x:300,y:338},{x:239,y:411},{x:306,y:358}],
        [{x:329,y:371},{x:342,y:329},{x:434,y:358}],
        [{x:312,y:396},{x:335,y:435},{x:329,y:371}],
        [{x:266,y:429},{x:335,y:435},{x:312,y:396}],
        [{x:434,y:358},{x:401,y:416},{x:329,y:371}],
        [{x:335,y:435},{x:401,y:416},{x:329,y:371}],
        [{x:342,y:329},{x:300,y:281},{x:401,y:245}],
        [{x:342,y:142},{x:434,y:154},{x:440,y:218}],
        [{x:434,y:358},{x:428,y:282},{x:342,y:329}],
        [{x:342,y:329},{x:401,y:245},{x:428,y:282}],
        [{x:202,y:167},{x:311,y:175},{x:202,y:129}],
        [{x:301,y:142},{x:202,y:129},{x:217,y:77 }],
        [{x:282,y:216},{x:312,y:175},{x:323,y:189}],
        [{x:225,y:320},{x:202,y:347},{x:186,y:320}],
        [{x:341,y:126},{x:390,y:53 },{x:365,y:40 }],
        [{x:341,y:126},{x:319,y:97 },{x:365,y:40 }],
        [{x:433,y:154},{x:422,y:91 },{x:341,y:142}],
        [{x:319,y:97 },{x:365,y:40 },{x:300,y:33 },{x:308,y:101}],
        [{x:300,y:120},{x:308,y:101},{x:300,y:33 },{x:257,y:42 }],
        [{x:300,y:331},{x:225,y:320},{x:186,y:320},{x:202,y:347}],
        [{x:266,y:429},{x:312,y:396},{x:306,y:358},{x:239,y:411}],
        [{x:301,y:142},{x:217,y:77 },{x:257,y:42 },{x:300,y:120}],
        [{x:323,y:189},{x:283,y:273},{x:239,y:245},{x:282,y:216}],
        [{x:300,y:281},{x:283,y:273},{x:323,y:189},{x:401,y:245}],
        [{x:312,y:175},{x:301,y:142},{x:217,y:77 },{x:202,y:129}],
        [{x:341,y:142},{x:341,y:126},{x:390,y:53 },{x:422,y:91 }],
        [{x:239,y:245},{x:282,y:216},{x:323,y:189},{x:312,y:175},{x:202,y:167}],
        [{x:300,y:331},{x:156,y:269},{x:186,y:320},{x:202,y:347},{x:238,y:411},{x:300,y:338}]
    ];

    // Store_orginal_pos(paths)
    for(var i = 0; i < paths.length; i++){

            var path = paths[i];
            for(var j = 0; j < paths[i].length; j++){
                path[j].x_orginal = path[j].x;
                path[j].y_orginal = path[j].y;
            }

    }

    // Initialize
    function init() {

        var stroke_color = "#ffffff";
        var cercle_color = "#ffffff";
        var cercle_radius = 3;
        var min_dist_fill = 80;
        var min_dist_anim = 35;

        // Draw lines
        for(var i = 0; i < paths.length; i++){

            var path = paths[i];
            var opacity = 0 ;

            ctx.beginPath();
            ctx.moveTo(path[0].x,path[0].y);

            for(var j = 0; j < paths[i].length; j++){

                ctx.lineTo(path[j].x,path[j].y);

                // fill the path
                if(is_near( path[j], min_dist_fill, mouse )){
                    opacity += 0.1;
                    //paths[i].active = 1;
                }

                // animate path
                if(is_near( path[j], min_dist_anim, mouse )){
                    animateTo(path[j],mouse.x,mouse.y);
                    path[j].move = 1;
                }else if(path[j].move === 1){
                    animateTo(path[j],path[j].x_orginal, path[j].y_orginal);
                    path[j].move = 0;
                }

            }
            ctx.lineTo(path[0].x,path[0].y); //close the path

            ctx.strokeStyle = stroke_color;
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,'+opacity+')';
            ctx.fill();

            ctx.closePath();

        }

        // Draw Point
        for(var k = 0; k < paths.length; k++){

            var point = paths[k];

            for(var l = 0; l < paths[k].length; l++){
                ctx.beginPath();
                ctx.arc(point[l].x,point[l].y,cercle_radius,0,2*Math.PI);
                ctx.fillStyle = cercle_color;
                ctx.fill();
                ctx.closePath();
            }
        }

    }

    // Animate
    function draw(){

        ctx.clearRect(0, 0, c.width, c.height);
        init();
        requestAnimationFrame(draw);

    }

    // Run
    init();
    draw();



    /* **************************************** */
    /* EVENT HANDLER */
    /* **************************************** */

    // track mouse coordonate
    c.addEventListener('mousemove',function(e){

        mouse.x = e.x; // /0.5;
        mouse.y = e.y; // /0.5;

    });



    /* **************************************** */
    /* UTILITY */
    /* **************************************** */

    // Move animation
    function animateTo(el,x,y){
        TweenLite.to(el, 2, {x:x, y:y, ease: Elastic.easeOut.config(1, 0.3)});
    }

    // Fade animation
    function fadeTo(opacity){
        //http://jsfiddle.net/zda3wdbk/
        var counter = { var: opacity };

        TweenMax.to(counter, 3, {
            var: 1,
            onUpdate: function () {
               counter.var;

            },
            ease:Circ.easeOut
        });
    }

    // Check if mouse if near a point
    function is_near( point, distance) {
        var left = point.x_orginal - distance,
            top = point.y_orginal - distance,
            right = point.x_orginal + distance,
            bottom = point.y_orginal + distance ,
            x = mouse.x,
            y = mouse.y;

        return ( x > left && x < right && y > top && y < bottom );
    }

    // Get mouse coordonate on click
    function x_y_getter(){
        var arr = '';
        c.addEventListener('click',function(e){
            arr += '{x: '+ e.x + ', y: '+ e.y + '},';
            console.log(arr);
        },false);
    }

    // HDPI (retina) canvas
    function hdpi_canvas (canvas,context){

        // http://www.html5rocks.com/en/tutorials/canvas/hidpi/
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;

        // upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {

            var oldWidth = canvas.width;
            var oldHeight = canvas.height;

            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            context.scale(ratio, ratio);

        }

        //context.scale(0.5, 0.5);

    }

})();





