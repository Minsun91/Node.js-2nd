const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Op } = require("sequelize");
const { Comment } = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

//댓글 조회 (날짜 내림차순 정렬)
router.get("/comment", async (req, res) => {
    const show = {
        __v: false,
        _id: false,
        post: false,
    };
    const comments = await Comment.findAll(
        { order: [["createdAt", "DESC"]] },
        show
    );
    res.json(comments);
});

//댓글 생성
router.post("/comment/:commentId", authMiddleware, async (req, res) => {
    // const { user, password, content } = req.body;
    const { content } = req.body;
    const { commentId } = req.params;
    const { nickname } = res.locals;
    const { userId } = res.locals;

    // const produce = await User.findOne({
    //     where: { commentId },
    // });
    const createdComments = await Comment.create({
        userId,
        commentId,
        nickname,
        content,
    });

    if (content.length == 0) {
        res.json({ message: "댓글 내용을 입력해주세요" });
    } else {
        res.json({ comments: createdComments });
    }
});

//댓글 삭제
router.delete("/comment/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals;
    // const { password } = req.body;
    // const { nickname } = req.body;

    const { change } = await Comment.findOne({
        commentId,
    });

    console.log(change);

    if (userId) {
        await Comment.destroy({ where: { commentId } });
        res.json({ message: "댓글이 삭제되었습니다." });
    } else {
        res.status(400).json({ message: "삭제 실패" });
    }
});

//댓글 수정
router.put("/comment/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId } = res.locals;

    if (userId) {
        await Comment.update({ content }, { where: { commentId } });
        res.json({ message: "댓글이 수정되었습니다." });
    } else {
        res.status(400).json({ message: "수정 실패" });
    }
});

module.exports = router;
