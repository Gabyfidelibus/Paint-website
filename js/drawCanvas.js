require.config({
    paths: {
        'footer':'footer'
    }
});

define([],function(){
    return{
        draw: function(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth){
            if (painting){
                if (mode==1){
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = "round";
                    ctx.lineTo(e.clientX - canvasOffset.left, e.clientY - canvasOffset.top);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(e.clientX - canvasOffset.left, e.clientY - canvasOffset.top);
                } else if (mode == 5){
                    ctx.clearRect(e.clientX - canvasOffset.left - lineWidth/2, e.clientY - canvasOffset.top - lineWidth/2,lineWidth,lineWidth);
                } else {
                    require(['footer'],function(Footer){
                        if (mode == 2){
                            let x,y,height, width;
                            if (startY<=e.clientY) {
                                y = startY - canvasOffset.top;
                                height = e.clientY - startY;
                            }else {
                                y = e.clientY - canvasOffset.top;
                                height = startY - e.clientY;
                            }
                
                            if (startX<=e.clientX) {
                                x = startX - canvasOffset.left;
                                width = e.clientX - startX;
                            }else {
                                x = e.clientX - canvasOffset.left;
                                width = startX - e.clientX;
                            }
                            height = (height==0) ? 1 : height;
                            width = (width==0) ? 1 : width;
                            svgOverlay.children[0].setAttribute("x",`${x}`);
                            svgOverlay.children[0].setAttribute("y",`${y}`);
                            svgOverlay.children[0].setAttribute("width",`${width}`);
                            svgOverlay.children[0].setAttribute("height",`${height}`);

                            Footer.setSelectionSize(width,height);
                
                        }else if (mode == 3){
                            let cx,cy,rx,ry;
                            if (startY<=e.clientY) {
                                ry = e.clientY - startY;
                                ry = (ry==0) ? 1 : ry;
                                cy = startY - canvasOffset.top + ry/2;
                            }else {
                                ry = startY - e.clientY;
                                ry = (ry==0) ? 1 : ry;
                                cy = e.clientY - canvasOffset.top + ry/2;
                            }
                            if (startX<=e.clientX) {
                                rx = e.clientX - startX;
                                rx = (rx==0) ? 1 : rx;
                                cx = startX - canvasOffset.left + rx/2;
                            }else {
                                rx = startX - e.clientX;
                                rx = (rx==0) ? 1 : rx;
                                cx = e.clientX - canvasOffset.left + rx/2;
                            }
                
                            svgOverlay.children[0].setAttribute("cx",`${cx}`);
                            svgOverlay.children[0].setAttribute("cy",`${cy}`);
                            svgOverlay.children[0].setAttribute("rx",`${rx/2}`);
                            svgOverlay.children[0].setAttribute("ry",`${ry/2}`);

                            Footer.setSelectionSize(rx,ry);
                
                        }else if (mode == 4) {
                            let width, height;

                            svgOverlay.children[0].setAttribute("x2",`${e.clientX - canvasOffset.left}`);
                            svgOverlay.children[0].setAttribute("y2",`${e.clientY - canvasOffset.top}`);

                            width = Math.abs(startX - e.clientX);
                            height = Math.abs(startY - e.clientY);

                            Footer.setSelectionSize(width,height);
                        }
                    });
                }
            }
        },

        drawLine: function(x,y,lineColor,lineWidth,dif,startX,startY){
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(startX-dif.left,startY-dif.top);
            ctx.lineTo(x,y);
            ctx.stroke();
        },
        
        drawRectangle: function(x,y,width,height,lineColor,lineWidth){
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(x,y,width,height);
        },

        drawEllipse: function(cx,cy,rx,ry,lineColor,lineWidth){
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.ellipse(cx,cy,rx,ry,0,0,2* Math.PI);
            ctx.stroke();
        }
    }
});