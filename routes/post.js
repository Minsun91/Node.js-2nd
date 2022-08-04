const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Post } = require("../models");
const { Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/post", async (req, res) => {
    const show = {
        __v: false,
        __id: false,
        password: false,
        content: false,
        postId: false,
    };

    const posts = await Post.findAll({ order: [["createdAt", "DESC"]] }, show);
    // const posts = await Post.findAll({}, show).sort("-createdAt");
    res.json(posts);
});

router.get("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    const posts = await Post.findOne({ postId });
    res.json({
        posts,
    });
    console.log(posts);
});

router.post("/post", authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    // const posts = await Post.findOne({ userId });
    // const { cookie } = req.headers;
    const { userId } = res.locals;
    const { nickname } = res.locals;
    const like = 0;

    console.log("미들웨어 끝났음", userId);
    console.log("미들웨어 끝났음", nickname);

    if (userId) {
        const createdPosts = await Post.create({
            userId,
            nickname,
            title,
            content,
            like,
        });
        return res.json({
            posts: createdPosts,
            Message: "게시글을 생성하였습니다.",
        });
    } else {
        return res.status(400).json({ errorMessage: "로그인 후 이용하세요." });
    }
});

// if (userId) {
//     return res
//         .status(400)
//         .send({ errorMessage: "이미 있는 아이디입니다.  " });
//     // json({success: false,errorMessage: "이미 있는 아이디입니다." });
// } else {
//     return res
//         .status(200)
//         .send({ errorMessage: "게시글을 생성하였습니다." });
//json({ message: "게시글을 생성하였습니다." });
// res.json({ message: "게시글을 생성하였습니다." });

router.delete("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;

    if (userId) {
        await Post.destroy({ where: { postId } });
        res.json({ message: "게시글이 삭제되었습니다." });
    } else {
        res.status(400).json({ message: "삭제에 실패했습니다. " });
    }
});

router.put("/post/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;
    const { content } = req.body;

    // const change = await Post.findOne({
    //     postid: postId,
    // });
    if (userId) {
        await Post.update({ content }, { where: { postId } }); //userid안에 있는 title, content를 바꾼다
        res.json({ message: "게시글이 수정되었습니다." });
    } else {
        res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
    }
});

//좋아요 게시글 조회
router.get("/post/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;

    const likelist = await Post.findAll({
        postId,
        userId,
        nickname,
        title,
        like,
    });
    res.json({
        likelist,
    });
});

//좋아요 게시글 등록 및 취소
router.put("/post/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;

    const currPost = await Like.findOne({
        where: { postId, userId },
        raw: true,
    });

    if (!currPost) {
        const createdLike = await Like.create({
            userId,
            postId,
        });
        const likePost = await Like.findAll({ where: { postId }, raw: true });
        const like = likePost.length;
        await Post.update({ like: like }, { where: { postId } });
        res.json({
            posts: createdLike,
            Message: "좋아요를 눌렀습니다.",
        });
    } else {
        await Like.destroy({ where: { postId, userId } });
        const likePost = await Like.findAll({ where: { postId }, raw: true });
        const like = likePost.length;
        await Post.update({ like: like }, { where: { postId } });
        res.status(400).json({ errorMessage: "좋아요가 취소되었습니다." });
    }
});

// if (currPost) {
//     await Post.increment({ like:1 }, { where: { postId } });
// } else {
//     res.status(404).send("존재하지 않는 게시글입니다");}

//         if (!currLikePost) {
//             await Like.create({ postId, userId });
//             res.status(201).send("좋아요를 눌렀습니다.");
//         } else {
//             await currLikePost.destroy();
//             res.status(201).send("좋아요를 취소했습니다.");
//         }
//     } catch (err)
// });

module.exports = router;
