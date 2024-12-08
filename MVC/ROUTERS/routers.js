const express = require('express');
const controller = require('../CONTROLLER/controller');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();




// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *1E9 )
  cb(null,file.fieldname + "-" +file.originalname);
  },
});

const upload = multer({ storage });

const Routers = express.Router();

Routers.post('/register',controller.createUser);
Routers.post('/login',controller.userAuth);
Routers.post('/:userid/create/post',upload.single('file'),controller.createPost);
Routers.get('/post',controller.getAllPost);
Routers.post('/:postId/comment',controller.commentOnPost);
Routers.post('/:postId/like',controller.userLike);
Routers.get('/:userId/getuser',controller.getUser);
Routers.put('/:userId/update',upload.single('file'),controller.updateUser);
Routers.get('/details',controller.getAllUser);
Routers.put('/:userId/:friendId/addFriend',controller.addFriend);
Routers.delete('/:userId/:friendId/deleteFriend',controller.deleteFriend);


module.exports = Routers;