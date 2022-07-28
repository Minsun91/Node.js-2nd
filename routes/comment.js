const express = require("express");
const Comments = require("../schemas/comments");
const router = express.Router();

//댓글 조회 (날짜 내림차순 정렬)
router.get("/comment", async (req, res) => {
    const show = {
        __v: false,
        _id: false,
        post: false,
    };
    const comments = await Comments.find({}, show).sort({ createdAt: -1 });
    res.json(comments);
});

//댓글 생성
router.post("/comment/:postid", async (req, res) => {
    const { user, password, content } = req.body;
    const { postid } = req.params;

    const createdComments = await Comments.create({
        postid,
        user,
        password,
        content,
    });

    if (content.length == 0) {
        res.json({ message: "댓글 내용을 입력해주세요" });
    } else {
        res.json({ comments: createdComments });
    }
});

//댓글 삭제
router.delete("/comment/:postid", async (req, res) => {
    const { postid } = req.params;
    const { password } = req.body;

    console.log(password);

    const change = await Comments.findOne({
        postid,
    });

    console.log(change);

    if (password === change.password) {
        await Comments.deleteOne({ postid });
        res.json({ message: "댓글이 삭제되었습니다." });
    } else {
        res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
    }
});

//댓글 수정
router.put("/comment/:postid", async (req, res) => {
    const { postid } = req.params;
    const { password } = req.body;
    const { content } = req.body;

    const change = await Comments.findOne({
        postid: postid,
    });
    if (password === change.password) {
        await Comments.updateOne({ postid }, { $set: { content } }); //commentid 있는 title, content를 바꾼다
        res.json({ message: "댓글이 수정되었습니다." });
    } else {
        res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
    }
});

module.exports = router;
