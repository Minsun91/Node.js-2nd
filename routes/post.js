const express = require("express");
const Posts = require("../schemas/posts");
const router = express.Router();

router.get("/post", async (req, res) => {
    const show = {
        __v: false,
        __id: false,
        password: false,
        content: false,
        postid: false,
    };
    const posts = await Posts.find({}, show).sort({ createdAt: -1 });
    res.json(posts);
});

router.get("/post/:postid", async (req, res) => {
    const { postid } = req.params;
    const posts = await Posts.findOne({ postid });
    res.json({
        posts,
    });
    console.log(posts);
});

router.post("/post", async (req, res) => {
    const { postid, user, password, title, content } = req.body;
    const posts = await Posts.find({ postid });

    if (posts.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 있는 아이디입니다.",
        });
        // } else {
        //     res.json({ message: "게시글을 생성하였습니다." });
        // }
    }

    const createdPosts = await Posts.create({
        postid,
        user,
        password,
        title,
        content,
    });
    res.json({ posts: createdPosts });
});

router.delete("/post/:postid", async (req, res) => {
    const { postid } = req.params;
    const { password } = req.body;

    let post = await Posts.findOne({
        postid: postid,
        password: password,
    });

    if (password === post.password) {
        await Posts.deleteOne({ postid });
        res.json({ message: "게시글이 삭제되었습니다." });
    } else {
        res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
    }
});

router.put("/post/:postid", async (req, res) => {
    const { postid } = req.params;
    const { password } = req.body;
    const { title, content } = req.body;

    console.log(content);

    const change = await Posts.findOne({
        postid: postid,
    });
    if (password === change.password) {
        await Posts.updateOne({ postid }, { $set: { title, content } }); //userid안에 있는 title, content를 바꾼다
        res.json({ message: "게시글이 수정되었습니다." });
    } else {
        res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
    }
});

module.exports = router;
