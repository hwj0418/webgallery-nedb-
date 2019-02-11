/*jshint esversion: 6 */
//let currentImageId = null;
let api = (function(){
    "use strict";
    let module = {};
    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("(" + xhr.status + ")" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    function sendFiles(method, url, data, callback){
        let formdata = new FormData();
        Object.keys(data).forEach(function(key){
            let value = data[key];
            formdata.append(key, value);
        });
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        xhr.send(formdata);
    }

    function getComments(imageId, page, callback){
        send("GET", "/api/comments/"+imageId+"/"+page+"/", null, callback);
    }

    function getImage(imageId, callback){
        send("GET", "/api/images/"+imageId+"/", null, callback);
    }

    module.addImage = function(title, author, picture){
        sendFiles("POST", "/api/images/", {title:title, author:author, picture:picture}, function(err, imageObject){
            if (err) return notifyErrorListeners(err);
            notifyImageListener(imageObject);
            notifyCommentLisenter(imageObject._id, [] , 0);
        });
    };

    module.deleteImage = function(imageId){
        send("DELETE", "/api/images/"+imageId+"/", null, function(err, imageObject){
            if (err) return notifyErrorListeners(err);
            console.log("img was deleted, next img is:", imageObject);
            if(imageObject){
                getComments(imageObject._id, 0, function(err, commentObject){
                    console.log("after deleted image, show new img's comment:",commentObject );
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(imageObject._id, commentObject, 0);
                });
            }else{
                notifyCommentLisenter(currentImageId, [], 0);
            }
            notifyImageListener(imageObject);
        });
    };

    module.addComment = function(imageId, author, content, page){
        send("POST", "/api/comments/", {imageId:imageId, author:author, content:content},function(err, commentObject){
            if (err) return notifyErrorListeners(err);
            getComments(commentObject.imageId, 0, function(err, returncomments){
                if (err) return notifyErrorListeners(err);
                console.log("added comment, return comments are:", returncomments);
                notifyCommentLisenter(commentObject.imageId, returncomments, 0);
            });
        });
    };

    module.deleteComment = function(commentId, page, imageId){
        send("DELETE", "/api/comments/"+commentId+"/", null, function(err, deleted_comment){
            if (err) return notifyErrorListeners(err);
            console.log("this comment was deleted:", deleted_comment);
            getComments(imageId, page, function(err, commentObject){
                if (err) return notifyErrorListeners(err);
                notifyCommentLisenter(imageId, commentObject, page);
            });
        });
    };

    module.olderComment = function(imageId, page){
        getComments(imageId, page+1,function(err, commentObject){
            if (err) return notifyErrorListeners(err);
            if(commentObject.length === 0){//older comment not exists
                getComments(imageId, page, function(err, returnComments){
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(imageId, returnComments, page);
                });
            }else{
                notifyCommentLisenter(imageId, commentObject, page+1);
            }
        });
    };

    module.laterComment = function(imageId, page){
        getComments(imageId, page-1,function(err, commentObject){
            if (err) return notifyErrorListeners(err);
            if(commentObject.length === 0){//older comment not exists
                getComments(imageId, page, function(err, returnComments){
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(imageId, returnComments, page);
                });
            }else{
                notifyCommentLisenter(imageId, commentObject, page-1);
            }
        });
    };

    module.previousImage = function(imageId){
        send("GET", "/api/images/previous/"+imageId+"/", null, function(err, imageObject){
            if (err) return notifyErrorListeners(err);
            if(imageObject){
                getComments(imageObject._id, 0, function(err, commentObject){
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(imageObject._id, commentObject, 0);
                });
            }
            notifyImageListener(imageObject);
        });
    };

    module.nextImage = function(imageId){
        send("GET", "/api/images/next/"+imageId+"/", null, function(err, imageObject){
            if (err) return notifyErrorListeners(err);
            if(imageObject){
                getComments(imageObject._id, 0, function(err, commentObject){
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(imageObject._id, commentObject, 0);
                });
            }
            notifyImageListener(imageObject);
        });
    };

    let currentImageId = null;
    function updateCurrentImageId(imageId){ 
        console.log("after this point, image id should be:", imageId);
        currentImageId = imageId; };

    let imageListeners = [];
    module.onImageUpdate = function(listener){
        //imageListener = listener;
        imageListeners.push(listener);
        //by default, return the last added image
        getImage(currentImageId, function(err, imageObject){
            if (err) return notifyErrorListeners(err);
            if (imageObject){
                updateCurrentImageId(imageObject._id);
                getComments(currentImageId, 0, function(err, commentObject){
                    if (err) return notifyErrorListeners(err);
                    notifyCommentLisenter(currentImageId, commentObject, 0);
                });
            }
            notifyImageListener(imageObject);
        });
    };

    function notifyImageListener(imageObject){
        if(imageObject){
            updateCurrentImageId(imageObject._id);
        }else{
            updateCurrentImageId(null);
        }
        imageListeners.forEach(function(listener){
            listener(imageObject);
        });
    }

    let commentlistener = null;
    module.onCommentUpdate = function(listener){
        commentlistener = listener;
    };

    function notifyCommentLisenter(imageId, commentObject, page){
        // commentlisteners.forEach(function(listener){
        //     listener(imageId, commentObject, page);
        // });
        commentlistener(imageId, commentObject, page);
    }
    let errorListeners = [];
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }
    module.onError = function(listener){
        errorListeners.push(listener);
    };
    
    (function refresh(){
        setTimeout(function(e){
            refresh();
        }, 2000);
    }());

    return module;
})();