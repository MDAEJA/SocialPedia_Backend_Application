const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    picturePath: {
      type: String, // For storing the uploaded image path
      default: "",
    },
    likes: {
      type: Map, // Object with userId as key and true/false for like status
      of: Boolean,
      default: {},
    },
    comments: {
      type:[
        {
            userId: { type: String, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
