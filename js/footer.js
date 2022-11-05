define([],function(){
    return{
        setMousePosition: function(e,canvasOffset) {
            let posX = Math.floor(e.clientX - canvasOffset.left) + 1;
            let posY = Math.floor(e.clientY - canvasOffset.top) + 1;
            document.getElementById("mouse-position").textContent = `${posX}, ${posY} px`;
        },

        removeMousePosition: function() {
            document.getElementById("mouse-position").textContent = ``;
        },

        setCanvasSize: function() {
            let width = center.clientWidth;
            let height = center.clientHeight;
            document.getElementById("canvas-size").textContent = `${width} x ${height} px`;
        },

        setSelectionPosition: function(x,y){
            let posX = Math.floor(x) + 1;
            let posY = Math.floor(y) + 1;
            document.getElementById("selection-position").textContent = `${posX}, ${posY} px`;
        },

        removeSelectionPosition: function() {
            document.getElementById("selection-position").textContent = ``;
        },

        setSelectionSize: function(width,height) {
            document.getElementById("selection-size").textContent = `${width} x ${height} px`;
        },

        removeSelectionSize: function() {
            document.getElementById("selection-size").textContent = ``;
        }
    }
  });