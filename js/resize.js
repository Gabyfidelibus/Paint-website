define([],function(){
    return{
        resizeOverlay: function(x,y){
            let width = center.clientWidth + x;
            let height = center.clientHeight + y;
            if(width < 50)
                center.style.width = `50px`;
            else
                center.style.width = `${width}px`;
            if(height < 50)
                center.style.height = `50px`;
            else
                center.style.height = `${height}px`;
        },

        eResize: function(e){
            const mouseX = e.clientX;
            center.classList.replace("hidden","active");
            canvas.style.cursor='e-resize';
            container.style.cursor='e-resize';
            document.getElementById("s-resize").style.cursor='e-resize';
            document.getElementById("se-resize").style.cursor='e-resize';
            return mouseX;
        },
        
        sResize: function(e){
            const mouseY = e.clientY;
            center.classList.replace("hidden","active");
            canvas.style.cursor='s-resize';
            container.style.cursor='s-resize';
            document.getElementById("e-resize").style.cursor='s-resize';
            document.getElementById("se-resize").style.cursor='s-resize';
            return mouseY;
        },
        
        seResize: function(e){
            const mouseXY = [e.clientX,e.clientY];
            center.classList.replace("hidden","active");
            canvas.style.cursor='se-resize';
            container.style.cursor='se-resize';
            document.getElementById("e-resize").style.cursor='se-resize';
            document.getElementById("s-resize").style.cursor='se-resize';
            return mouseXY;
        },

        resizeCanvas: function(difX,difY){
            if (difX!=-1 || difY!=-1){
                let img = new Image();
                img.src = canvas.toDataURL();
                canvas.style.cursor='crosshair';
                container.style.cursor='default';
                document.getElementById("e-resize").style.cursor='e-resize';
                document.getElementById("s-resize").style.cursor='s-resize';
                document.getElementById("se-resize").style.cursor='se-resize';
                canvas.setAttribute("width",center.style.width);
                canvas.setAttribute("height",center.style.height);
                svgOverlay.setAttribute("width",center.style.width);
                svgOverlay.setAttribute("height",center.style.height);
                ctx.drawImage(img, 0, 0);
                img.onload = function(){
                    ctx.drawImage(img, 0, 0);
                }
                center.classList.replace("active","hidden");
                difX = -1;
                difY = -1;
            }
            return [difX,difY];
        },
        
        zoom: function(){
        
           

            if (window.outerWidth < 1280){
                const description = document.querySelectorAll(".info-description");
                for (let i = 0; i < description.length; i++) {
                    description[i].style.display = 'none';
                }
                document.getElementById("mouse-position").style.textAlign = 'center';
                document.getElementById("selection-position").style.textAlign = 'center';
                document.getElementById("selection-size").style.textAlign = 'center';
                document.getElementById("canvas-size").style.textAlign = 'center';
                document.getElementById("mouse-position").style.paddingRight = '0';
                document.getElementById("selection-position").style.paddingRight = '0';
                document.getElementById("selection-size").style.paddingRight = '0';
                document.getElementById("canvas-size").style.paddingRight = '0';
            } else{
                const description = document.querySelectorAll(".info-description");
                for (let i = 0; i < description.length; i++) {
                    description[i].style.display = 'flex';
                }
                document.getElementById("mouse-position").style.textAlign = 'right';
                document.getElementById("selection-position").style.textAlign = 'right';
                document.getElementById("selection-size").style.textAlign = 'right';
                document.getElementById("canvas-size").style.textAlign = 'right';
                document.getElementById("mouse-position").style.paddingRight = '2vw';
                document.getElementById("selection-position").style.paddingRight = '2vw';
                document.getElementById("selection-size").style.paddingRight = '2vw';
                document.getElementById("canvas-size").style.paddingRight = '2vw';
            }
        },
    }
});
