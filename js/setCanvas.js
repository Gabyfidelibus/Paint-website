require.config({
    paths: {
        'drawCanvas':'drawCanvas',
        'saveCanvas':'saveCanvas'
    }
});

define([],function(){
    return{
        setColor: function(){
            color1.style.background = color1.value;
            color2.style.background = color2.value;
        
            color1.addEventListener("change",()=>{
                color1.style.background = color1.value;
            });
            
            color2.addEventListener("change",()=>{
                color2.style.background = color2.value;
            });
        },

        startPosition: function(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth){
            if (!painting || mode == 1){
                if (e.button == 0) { // click izquierdo
                    lineColor = color1.value;
                    painting = true;
                } else if(e.button == 2){  // click derecho
                    lineColor = color2.value;
                    painting = true;
                }
                if (painting){
                    lineWidth = document.getElementById("range").value;
                    startX = e.clientX;  // posicion del mouse en X
                    startY = e.clientY;  // posicion del mouse en Y
                    if (mode == 1){
                        ctx.beginPath();
                    }
                    if (mode == 2){
                        svgOverlay.classList.replace("hidden","visible");
                        let newRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
                        newRect.setAttribute("x",`${startX - canvasOffset.left}`);
                        newRect.setAttribute("y",`${startY - canvasOffset.top}`);
                        newRect.setAttribute("height",`0`);
                        newRect.setAttribute("width",`0`);
                        newRect.setAttribute("fill",`transparent`);
                        newRect.setAttribute("style",`stroke:${lineColor};stroke-width:${lineWidth}`);
                        svgOverlay.append(newRect);
                    } else if (mode == 3){
                        svgOverlay.classList.replace("hidden","visible");
                        let newEllipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
                        newEllipse.setAttribute("cx",`${startX - canvasOffset.left}`);
                        newEllipse.setAttribute("cy",`${startY - canvasOffset.top}`);
                        newEllipse.setAttribute("rx",`0`);
                        newEllipse.setAttribute("ry",`0`);
                        newEllipse.setAttribute("fill",`transparent`);
                        newEllipse.setAttribute("style",`stroke:${lineColor};stroke-width:${lineWidth}`);
                        svgOverlay.append(newEllipse);
                    } else if (mode == 4) {
                        svgOverlay.classList.replace("hidden","visible");
                        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
                        newLine.setAttribute("x1",`${startX - canvasOffset.left}`);
                        newLine.setAttribute("y1",`${startY - canvasOffset.top}`);
                        newLine.setAttribute("x2",`${e.clientX - canvasOffset.left}`);
                        newLine.setAttribute("y2",`${e.clientY - canvasOffset.top}`);
                        newLine.setAttribute("stroke-linecap",`round`);
                        newLine.setAttribute("style",`stroke:${lineColor};stroke-width:${lineWidth}`);
                        svgOverlay.append(newLine);
                    }

                    require(['drawCanvas'],function(DrawCanvas){
                        DrawCanvas.draw(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth);
                    });

                    require(['footer'],function(Footer){
                        if (mode != 1 && mode != 5){
                            Footer.setSelectionPosition(startX - canvasOffset.left, startY - canvasOffset.top);
                        }
                    });
                    //setCursor();  implementar
                }
            }
            return [startX, startY, painting, lineColor, lineWidth];
        },

        finishedPosition: function(e,leave, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth){
            if (painting && e.button != 1  && (leave || ((e.button == 0 && lineColor==color1.value) || (e.button == 2 && lineColor==color2.value)))){
                if (mode==1){
                    require(['drawCanvas'],function(DrawCanvas){
                        DrawCanvas.draw(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth);
                    });

                } else if (mode==2){
                    let x,y,width,height,rect;
                    rect = svgOverlay.children[0];
                    x = rect.getAttribute("x");
                    y = rect.getAttribute("y");
                    width = rect.getAttribute("width");
                    height = rect.getAttribute("height");

                    require(['drawCanvas'],function(DrawCanvas){
                        DrawCanvas.drawRectangle(x,y,width,height,lineColor,lineWidth);
                    });
                    
                    svgOverlay.classList.replace("visible","hidden");
                    svgOverlay.removeChild(rect);
        
                } else if (mode==3){
                    let cx, cy, rx, ry, ellipse;
                    ellipse = svgOverlay.children[0];
                    cx = ellipse.getAttribute("cx");
                    cy = ellipse.getAttribute("cy");
                    rx = ellipse.getAttribute("rx");
                    ry = ellipse.getAttribute("ry");
        
                    require(['drawCanvas'],function(DrawCanvas){
                        DrawCanvas.drawEllipse(cx,cy,rx,ry,lineColor,lineWidth);
                    });

                    svgOverlay.classList.replace("visible","hidden");
                    svgOverlay.removeChild(ellipse);
                    
                } else if (mode == 4){
                    require(['drawCanvas'],function(DrawCanvas){
                        DrawCanvas.drawLine(e.clientX - canvasOffset.left, e.clientY - canvasOffset.top,lineColor,lineWidth,canvasOffset,startX,startY);
                    });

                    svgOverlay.classList.replace("visible","hidden");
                    svgOverlay.removeChild(svgOverlay.firstChild);
                }
                painting = false;
                ctx.beginPath();

                require(['saveCanvas'],function(Save){
                    Save.autosave();
                });

                require(['footer'],function(Footer){
                    Footer.removeSelectionPosition();
                    Footer.removeSelectionSize();
                });
                // setCursor(painting);
            }
            return painting;
        },

        changeMode: function(m, mode, drawMode){
            if (mode!=m){
                drawMode[mode-1].classList.replace("enabled","disabled");
                drawMode[m-1].classList.replace("disabled","enabled");
                mode = m;
            }
            return mode;
        }
    }
});
