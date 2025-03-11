"use strict";

const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const container = document.querySelector(".container");
const center = document.getElementById("center");
const svgOverlay = document.getElementById("svg-overlay");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let localDataBase;

require.config({
    paths: {
        'range':'range',
        'resize':'resize',
        'setCanvas':'setCanvas',
        'saveCanvas':'saveCanvas',
        'storage':'storage',
        'drawCanvas':'drawCanvas',
        'footer':'footer'
    }
});

require(['range'],function(Range){
    document.getElementById("range").addEventListener('input', e =>Range.handleInputChange(e));
    document.getElementById("rangenumber").addEventListener('input', e =>Range.handleInputChange(e));
});

require(['resize','footer'],function(Resize,Footer){
    let mouseX = -1, mouseY = -1;

    center.style.width = `${center.clientWidth}px`;
    center.style.height = `${center.clientHeight}px`;
    container.oncontextmenu=()=>false;
    Resize.zoom();

    window.addEventListener("resize",()=> Resize.zoom());
    document.getElementById("e-resize").addEventListener("mousedown", e=> mouseX = Resize.eResize(e));
    document.getElementById("s-resize").addEventListener("mousedown", e=> mouseY = Resize.sResize(e));
    document.getElementById("se-resize").addEventListener("mousedown", e=> [mouseX,mouseY] = Resize.seResize(e));
    container.addEventListener("mousemove",e=>{
        let width = center.clientWidth;
        let height = center.clientHeight;
        if (mouseX != -1 && mouseY != -1 && width >= 50 && height >= 50){
            Resize.resizeOverlay(e.clientX-mouseX, e.clientY-mouseY);
            mouseX = e.clientX;
            mouseY = e.clientY;
            Footer.setCanvasSize();
        } else if (mouseX != -1 && width >= 50){
            Resize.resizeOverlay(e.clientX-mouseX,0);
            mouseX = e.clientX;
            Footer.setCanvasSize();
        } else if (mouseY != -1 && height >= 50){
            Resize.resizeOverlay(0, e.clientY-mouseY);
            mouseY = e.clientY;
            Footer.setCanvasSize();
        }
    });

    container.addEventListener("mouseup",()=> [mouseX,mouseY] = Resize.resizeCanvas(mouseX,mouseY));
    document.querySelector(".panel").addEventListener("mouseenter",()=> [mouseX,mouseY] = Resize.resizeCanvas(mouseX,mouseY));
    document.querySelector(".footer").addEventListener("mouseenter",()=> [mouseX,mouseY] = Resize.resizeCanvas(mouseX,mouseY));
    document.body.addEventListener("mouseleave",()=> [mouseX,mouseY] = Resize.resizeCanvas(mouseX,mouseY));
});

require(['setCanvas','drawCanvas','footer'],function(SetCanvas,DrawCanvas,Footer){
    let canvasOffset, mode = 1, startX=0, startY=0, painting = false, lineColor=color1.value, lineWidth=20;

    const drawMode = [document.getElementById("brush"),
                        document.getElementById("rectangle"),
                        document.getElementById("ellipse"),
                        document.getElementById("line"),
                        document.getElementById("eraser")];

    for (let i = 0; i < drawMode.length; i++) {
        drawMode[i].addEventListener("click",()=> mode = SetCanvas.changeMode(i+1, mode, drawMode));
    }

    SetCanvas.setColor();
    canvasOffset = canvas.getBoundingClientRect();

    window.addEventListener("resize",()=> canvasOffset = canvas.getBoundingClientRect());
    window.addEventListener("scroll",()=> canvasOffset = canvas.getBoundingClientRect());

    canvas.addEventListener("mousedown",e=> [startX, startY, painting, lineColor, lineWidth] = SetCanvas.startPosition(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth));
    canvas.addEventListener("mouseup",e=> painting = SetCanvas.finishedPosition(e,false, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth));
    window.addEventListener("mousemove",e=> DrawCanvas.draw(e, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth));
    window.addEventListener("mouseup",e=> painting = SetCanvas.finishedPosition(e,true, mode, canvasOffset, startX, startY, painting, lineColor, lineWidth));


    canvas.addEventListener("mousemove",e=> Footer.setMousePosition(e,canvasOffset));
    canvas.addEventListener("mouseleave",()=> Footer.removeMousePosition());
});

require(['saveCanvas'], function(Save){
    
    Save.startLocalStorage();
    
    document.getElementById("undo").addEventListener("click",()=>Save.undo());
    document.getElementById("redo").addEventListener("click",()=>Save.redo());

    document.getElementById("download").addEventListener("click",()=>Save.downloadCanvas());
    document.getElementById("file").addEventListener("change",e=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.src = e.target.result;
            ctx.drawImage(img, 0, 0);
            img.onload = function(){
                center.style.width = this.width;
                center.style.height = this.height;
                canvas.setAttribute("width",this.width);
                canvas.setAttribute("height",this.height);
                svgOverlay.setAttribute("width",this.width);
                svgOverlay.setAttribute("height",this.height);
                ctx.drawImage(img, 0, 0);
                Save.autosave();
            }
        }
        reader.readAsDataURL(file);
    });
});
