const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    postid: {
        type: Number,
        required: true,
        unique: true,
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comments", commentSchema);
