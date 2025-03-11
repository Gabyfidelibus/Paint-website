require.config({
    paths: {
        'storage':'storage'
    }
});

define([],function(){
    return{
        downloadCanvas: function(){
            const a = document.createElement('a');
            let background = new Image();
            background.src = canvas.toDataURL();
            if (confirm("Do you want to save your drawing with a white background?")){
                ctx.fillStyle = "#fff";
                ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
                background.onload = function(){
                    ctx.drawImage(background,0,0); 
                }
            }
            setTimeout(()=> {
                document.body.appendChild(a);
                a.href = canvas.toDataURL();
                a.download = "your-drawing.png";
                a.click();
                document.body.removeChild(a);
                ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
                ctx.drawImage(background,0,0);
            },5);
        },

        autosave: function() {
            let min = parseInt(localStorage.getItem('minPosition'));
            let max = parseInt(localStorage.getItem('maxPosition'));;
            let currentPos = parseInt(localStorage.getItem('currentPosition'));
            
            require(['storage'],function(Storage){
                
                if(currentPos !== max){
                    for(let i = currentPos+1 ; i<=max ; i++){
                        Storage.removeObjectDB(i);
                    }
                }
                currentPos += 1;
                localStorage.setItem('currentPosition',currentPos);
                localStorage.setItem('maxPosition',currentPos);

                if (currentPos >= 50){
                    Storage.removeObjectDB(min);
                    localStorage.setItem('minPosition',min+1);
                }
                Storage.addObjectDB(canvas.toDataURL(),currentPos);
            
            });
            
            document.getElementById("undo").classList.replace("unavailable","available");
            document.getElementById("redo").classList.replace("available","unavailable");
        },

        startLocalStorage: function(){
            localStorage.clear();
            indexedDB.deleteDatabase('paintDB');
            localStorage.setItem('minPosition',1);
            localStorage.setItem('currentPosition',1);
            localStorage.setItem('maxPosition',1);
            require(['storage'],function(Storage){
                Storage.getDB();
                setTimeout(()=>{
                    Storage.addObjectDB(canvas.toDataURL(),1);
                },100);
            });
        },

        undo: function(){
            let min = parseInt(localStorage.getItem('minPosition'));
            let currentPos = parseInt(localStorage.getItem('currentPosition'));
            if(currentPos>min){
                canvas.width=canvas.width;
                currentPos -= 1;
                localStorage.setItem('currentPosition',currentPos);

                require(['storage'],function(Storage){
                    Storage.getObjectDB(currentPos);
                });
                
                if (currentPos === min){
                    document.getElementById("undo").classList.replace("available","unavailable");
                }
                document.getElementById("redo").classList.replace("unavailable","available");
            }
        },

        redo: function(){
            let max = parseInt(localStorage.getItem('maxPosition'));
            let currentPos = parseInt(localStorage.getItem('currentPosition'));
            if(max>currentPos){
                canvas.width=canvas.width;
                currentPos += 1;
                localStorage.setItem('currentPosition',currentPos);

                require(['storage'],function(Storage){
                    Storage.getObjectDB(currentPos);
                });
                
                if (max==currentPos){
                    document.getElementById("redo").classList.replace("available","unavailable");
                }
                document.getElementById("undo").classList.replace("unavailable","available");
            }
        }
    }
});