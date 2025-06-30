// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   content: String,
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   comments: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       text: String,
//     },
//   ],
// }, { timestamps: true });

// module.exports = mongoose.model("Post", postSchema);
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: {type:String},
    image: {type:String},
    video: {type:String},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);