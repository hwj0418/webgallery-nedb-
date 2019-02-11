/*jshint esversion: 6 */

const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});   
let multer = require('multer');
let upload = multer({ dest:path.join(__dirname, 'uploads/') });

let Datastore = require('nedb')
  , images = new Datastore({ filename: 'db/images.db', autoload: true, timestampData : true})
  , comments = new Datastore({ filename: 'db/comments.db', autoload: true, timestampData : true});

// images.remove({ }); 
// comments.remove({ }); 
app.get('/api/comments/:imageId/:page/', function(req, res, next){
    let imageId = req.params.imageId;
    let page = parseInt(req.params.page);
    let sp = page*10
    let ep = sp + 10;
    if(imageId != "MostRecentImage"){
        comments.find({imageId:imageId}).sort({createdAt:-1}).exec(function(err, found_comments){
            if (err) return res.status(500).end(err);
            res.json(found_comments.splice(sp, ep));
        });
    }else{
        images.find({ }).sort({createdAt:-1}).exec(function(err, found_images){
            if (err) return res.status(500).end(err);
            if(found_images.length > 0){
                comments.find({imageId:found_images[0]._id}).sort({createdAt:-1}).exec(function(err, found_comments){
                    if (err) return res.status(500).end(err);
                    res.json(found_comments.splice(sp, ep));
                });
            }else{
                res.json([]);
            }
        });
    }
});

app.get('/api/images/:imageId/', function(req, res, next){
    let imageId = req.params.imageId;
    if(imageId != "null"){
        images.findOne({_id:imageId}, function(err, found_image){
            if (err) return res.status(500).end(err);
            console.log("get specific image:", imageId);
            res.json(found_image);
        });
    }else{
        images.find({ }).sort({createdAt:(-1)}).exec(function(err, found_images){
            if (err) return res.status(500).end(err);
            console.log("get first image", found_images);
            if(found_images.length > 0){
                res.json(found_images[0]);
            }else{
                res.json(null);
            }
        });
    }
});

app.get('/api/images/:imageId/profile/picture/', function (req, res, next) {
    images.findOne({_id: req.params.imageId}, function(err, target_image){
        if (err) return res.status(500).end(err);
        if (typeof target_image == 'undefined') return res.status(404).end('imageId ' + req.params.imageId + ' does not exists');
        let profile = target_image.picture;
        res.setHeader('Content-Type', profile.mimetype);
        res.sendFile(profile.path);
    });
});

app.get('/api/images/:action/:imageId/', function(req, res, next){
    let imageId = req.params.imageId;
    images.find({ }).sort({createdAt:(-1)}).exec(function(err, all_images){
        if (err) return res.status(500).end(err);
        let index = all_images.findIndex(function(target_image){
            return target_image._id == imageId;
        });
        switch(req.params.action){
        case "previous":
            if(typeof all_images[index + 1]!='undefined'){ 
                res.json(all_images[index + 1]);
            }else{
                res.json(all_images[index]);
            }
            break;
        case "next":
            if(typeof all_images[index - 1] != 'undefined') {
                res.json(all_images[index - 1]);
            }else{
                res.json(all_images[index]);
            }
            break;
        }
    });
});

app.delete('/api/images/:imageId/', function (req, res, next) {
    let imageId = req.params.imageId;
    images.find({ }).sort({createdAt:(-1)}).exec(function(err, all_images){
        let index = all_images.findIndex(function(target){
            return target._id === imageId;
        });
        if(index === -1 || err){return res.status(500).end(err);}
        if(typeof all_images[index - 1] != 'undefined'){
            res.json(all_images[index - 1]);
        }else if(typeof all_images[index + 1] != 'undefined'){
            res.json(all_images[index + 1]);
        }
        else{
            res.json(null);
        }
        images.remove({_id:imageId}, function(err, numDelete){
            if (err) return res.status(500).end(err);
            console.log("number of image deleted:", numDelete);
            comments.remove({imageId:imageId}, function(err, numDelete){
                if (err) return res.status(500).end(err);
                console.log("number of comments under this img were deleted", numDelete);
            });
        });
    });
});

app.delete('/api/comments/:commentId/', function (req, res, next) {
    let commentId = req.params.commentId;
    comments.findOne({_id: commentId}, function(err, target_comment){
        if (err) return res.status(500).end(err);
        if (!target_comment) return res.status(404).end('commentId ' + req.params.commentId + ' does not exists');
        comments.remove({_id:commentId}, function(err, num){
            if (err) return res.status(500).end(err);
        });
        res.json(target_comment);
    });
    
});

// Post image and Comments 
app.post('/api/images/', upload.single('picture'), function (req, res, next) {
    console.log("creating new img:", req.body);
    let image = {title: req.body.title, author: req.body.author, picture:req.file};
    images.insert(image, function (err, new_image) {
        if (err) return res.status(500).end(err);
        res.json(new_image);
    });
});

app.post('/api/comments/', function (req, res, next) {
    let comment = {imageId:req.body.imageId, author:req.body.author, content:req.body.content};
    comments.insert(comment, function (err, new_comment) {
        if (err) return res.status(500).end(err);
        res.json(new_comment);
    });
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});