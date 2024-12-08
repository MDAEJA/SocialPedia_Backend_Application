const bcrypt = require('bcryptjs');
const userModel = require('../MODEL/model');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const postModel = require('../MODEL/post');
const path = require('path');
// const upload = ''


  

dotenv.config({path :'../config.env'})

const createUser = async (req,res)=>{
    try{
        const {
            firstName,
            lastName,email,
            password,
            confirmPassword,
            picturePath,
            friends ,
            location ,
            occupation ,
            viewedProfile ,
            impressions 
        }  = req.body;

        if(!firstName,!lastName,!email,!password,!confirmPassword){
            return res.status(404).json({
                status : false,
                message : "Fill All Credentails !!!" + err.message
            })
        }
        const checkUser = await userModel.findOne({email});
        if(checkUser){
          return res.status(err.status).json({
            status : false,
            message : "Already Register !!!"
        })
        }
        if(password !== confirmPassword){
            return res.status(err.status).json({
                status : false,
                message : "password and confirm password must be match !!!" + err.message
            })
        }

// bcrypt password 
   const salt = bcrypt.genSaltSync(10);
   const hashPassword = bcrypt.hashSync(password,salt);
    

    const userData = new userModel({
        firstName ,
        lastName,email,
        password : hashPassword,
        confirmPassword : hashPassword, 
        picturePath,
        friends ,
        location ,
        occupation ,
        viewedProfile ,
        impressions 
    })
    await userData.save();

    

   return res.json({
    status : true,
    message : "Register Successfully !!!",
    userData
   })
    }
    catch(err){
        console.log(err);
         res.status(500).json({
            status : false,
            err : err.message
        })
    }
}
const userAuth = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email,!password){
            return res.status(500).json({
                status : false,
                message : err.message
            })
        }

        const userRegister = await userModel.findOne({email});
        if(!userRegister){
            return res.status(400).json({
                status : false,
                message : "User does not exit !!!"
            })
        };

     // checking password 
        const getPassword = bcrypt.compareSync(password,userRegister.password);
        if(!getPassword){
            return res.status(400).json({
                status : false,
                message : "Invalid Crdentails!!!"
            })
        }
const token = jwt.sign({id : userRegister._id},process.env.JWT_TOKEN);
    userRegister.password = "";
    userRegister.confirmPassword ="";

return res.status(200).json({
    status : true,
    token,
    userRegister,
})



    }
    catch(err){
        console.log(err);
         res.status(400).json({
            status : false,
            err : err.message
        })
    }
}
const createPost = async (req, res) => {
  try {
    const id = req.params.userid;
    const file = req.file;
    const description = req.body.description;

    if (!id) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    if(!file){
      return res.status(400).json({ message: "User file is missing" });
    }

    if(!description){
      return res.status(400).json({ message: "User Description is missing" });
    }

    const userInfo = await userModel.findById(id);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    };


    const imagePath = path.join(__dirname,"upload",file.filename);
    console.log(imagePath);

    const newPost = new postModel({
      userId: id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      description,
      picturePath : `${process.env.BASEURL}/uploads/${file.filename}`// Store the image URL in the database
    });
    const savedPost = await newPost.save();
    console.log(file);
    res.json({
      status: true,
      message: "Post Created Successfully",
      
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: false, error: err.message });
  }
};
const userLike = async (req, res) => {
  try {
    const postId = req.params.postId; // Get the postId from the request parameters
    const { userId } = req.body; // Destructure userId from the request body

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "User ID is required",
      });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    if (post.likes.has(userId)) {
      // User already liked, so remove the like
      post.likes.delete(userId);
      await post.save();

      return res.json({
        status: true,
        message: "Post unliked successfully",
        isLiked: false,
        likes: [...post.likes.keys()], // Updated likes
      });
    } else {
      // User has not liked, so add the like
      post.likes.set(userId, true);
      await post.save();

      return res.json({
        status: true,
        message: "Post liked successfully",
        isLiked: true,
        likes: [...post.likes.keys()], // Updated likes
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

  const commentOnPost = async (req, res) => {
    try {
      const  postId  = req.params.postId; // Get the postId from the request parameters
      const { userId, comment } = req.body; // Get the userId and comment from the request body
  
      if (!userId || !comment) {
        return res.status(400).json({
          status: false,
          message: 'User ID and comment are required',
        });
      }
  
      const post = await postModel.findById(postId); // Find the post by postId
  
      if (!post) {
        return res.status(404).json({
          status: false,
          message: 'Post not found',
        });
      }
  
      // Add the new comment to the post's comments array
      const newComment = {
        userId,
        comment,
      };
  
      post.comments.push(newComment); // Add the comment to the array
      await post.save(); // Save the post with the new comment
  
      return res.json({
        status: true,
        message: 'Comment added successfully',
        post: post,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        error: err.message,
      });
    }
  };

  const getAllPost = async(req,res) => {
    try{
     const postAll = await postModel.find();
     if(!postAll){
        res.status(404).json({
            status : false,
            message : "no post"
        })
     }
     res.json({
        status : true,
        message : "Fetch All Post",
        post : postAll
     })
    }
    catch(err){
        console.log(err);
        res.status(400).json({
          status: false,
          error: err.message,
        });
    }
  }
const getUser = async(req,res)=>{
    try{
        const id = req.params.userId;
        const userInfo = await userModel.findById(id);
        res.status(200).json({
            status : true,
            userInfo
        })

    }
    catch(err){
        console.log(err);
         res.status(404).json({
            status : false,
            err : err.message
        })

    }
}
const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Corrected the typo to 'req'
    const { firstName, lastName, email } = req.body; // Extract user data from body
    const file = req.file; // File should be in req.file if using multer

    // Check if userId is provided
    if (!userId) {
      return res.json({
        status: false,
        message: "Invalid User Id",
      });
    }

    // Find the user by ID
    const userInfo = await userModel.findById(userId);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handling file upload (if a file is provided)
    let imagePath = userInfo.picturePath; // Default to existing picture if no new file
    if (file) {
      // Create the path for the uploaded file
      imagePath = path.join(__dirname, "upload", file.filename);
      console.log(imagePath);
    }

    const updateUser = {
      firstName,
      lastName,
      email,
      picturePath: `${process.env.BASEURL}/uploads/${file.filename}`, // Add the picture path to the update object
    };

    // Update the user info
    await userModel.findByIdAndUpdate(userId, updateUser, { new: true });

    // Retrieve the updated user data
    const newData = await userModel.findById(userId);

    // Respond with success
    res.json({
      status: true,
      message: "User updated successfully",
      data: newData,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUser = async(req,res)=>{
  try{
    const allUser = await userModel.find();
    res.json({
      status : true,
      allUser,
    })
  }
  catch(err){
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
const getUserFriends = async(req,res)=>{
    try{
   const id = req.params.userId;
   const userInfo = await userModel.findById(id);

   // checking the code 
   const friends = await Promise.all(
    userInfo.friends.map((id) => userModel.findById(id))
   );
   const formattedFriends = friends.map({
    _id,firstName,lastName,occupation,location,picturePath
   });
   res.status(200).json({
    status : true,
    formattedFriends
   })
    }
    catch(err){
        console.log(err);
         res.status(404).json({
            status : false,
            err : err.message
        })
    }
}
const addFriend = async (req, res) => {
  try {
    const id = req.params.userId; // Current User ID
    const friendId = req.params.friendId; // Friend ID to be added

    // Find the user and the friend in the database
    const userInfo = await userModel.findById(id);
    const friendInfo = await userModel.findById(friendId);

    if (!userInfo || !friendInfo) {
      return res.status(404).json({
        status: false,
        message: "User or Friend not found",
      });
    }

    // Check if the friend is already in the user's friends list
    const isAlreadyFriend = userInfo.friends.some(
      (friend) => friend.userId === friendId
    );

    if (isAlreadyFriend) {
      return res.status(400).json({
        status: false,
        message: "Friend already added",
      });
    }

    // Add friend to user's friends list
    const addFriend = {
      userId: friendInfo._id,
      userName: friendInfo.firstName,
    };
    userInfo.friends.push(addFriend);
    await userInfo.save();

    // Add user to friend's friends list (optional)
    const addUserToFriend = {
      userId: userInfo._id,
      userName: userInfo.firstName,
    };
    friendInfo.friends.push(addUserToFriend);
    await friendInfo.save();

    res.status(200).json({
      status: true,
      message: "Friend added successfully",
      userInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      err: err.message,
    });
  }
};
const deleteFriend = async(req,res)=>{
  try{
   const userId = req.params.userId;
   const friendId = req.params.friendId;
   // Remove friendId from the user's friends list
   const user = await userModel.findById(userId);
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   // Filter out the friend object with matching friendId
   user.friends = user.friends.filter((friend) => friend.userId !== friendId);

   // Save the updated user document
   await user.save();

   res.status(200).json({ message: "Friend removed successfully", remainingFriends: user.friends });
   
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Failed to remove friend" });
  }
}

const controller = {
    createUser,userAuth,createPost,userLike,getAllPost,commentOnPost,userLike,getUser,updateUser,getAllUser,addFriend,deleteFriend
}


module.exports = controller;