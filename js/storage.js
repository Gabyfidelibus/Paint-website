define([],function(){
    return{
        getDB: function() {
            let openreq = indexedDB.open('paintDB', 1);

            openreq.onerror = e => {
                console.log("Database error: " + e.target.errorCode);
            };
            
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore('autosave',{autoIncrement: true});
            };
            
            openreq.onsuccess = () => {
                localDataBase = openreq.result;
            };
        },

        addObjectDB: function(obj,key) {
            const IDBtransaction = localDataBase.transaction(['autosave'],'readwrite');
            const objectStore = IDBtransaction.objectStore('autosave');
            objectStore.put(obj,key);
        },

        removeObjectDB: function(key) {
            const IDBtransaction = localDataBase.transaction(['autosave'],'readwrite');
            const objectStore = IDBtransaction.objectStore('autosave');
            objectStore.delete(key);
        },

        getObjectDB: function(key) {
            let background = new Image();
            const IDBtransaction = localDataBase.transaction(['autosave'],'readonly');
            const objectStore = IDBtransaction.objectStore('autosave');
            let request = objectStore.get(key);
            request.onerror = function (e){
                console.log("Database error: " + e.target.errorCode);
            }
            request.onsuccess = e=> {
                background.src = request.result;
                ctx.drawImage(background,0,0); 
                background.onload = function(){
                    ctx.drawImage(background,0,0); 
                }
            }
        }
    }
});