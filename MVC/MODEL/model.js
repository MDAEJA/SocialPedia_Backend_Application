const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        min : 2,
        max : 50
    },
    lastName : {
        type : String,
        required : true,
        min : 2,
        max : 50
    },
    email : {
        type : String,
        required : true,
        max : 50,
        unique : true
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    confirmPassword : {
        type : String,
        required : true,
        min : 8
    },
    picturePath : {
        type : String,
        default : ''
    },
    friends : {
        type:[
            {
                userId: { type: String, required: true },
                userName: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
              },
          ],
          default: [],
    },
    location : {
        type : String
    },
    occupation : {
        type : String
    },
    viewedProfile : {
        type :Number
    },
    impressions : {
        type : Number
    }
},{timestamps : true});

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;