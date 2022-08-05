const jwt = require("jsonwebtoken");
const { User, Post, Comment, Like } = require("../models");

module.exports = (req, res, next) => {
    const { cookie } = req.headers;
    console.log("쿠키는", cookie);
    // console.log("닉네임은", nickname);
    const [tokenType, tokenValue] = (cookie || "").split("=");

    console.log("미들웨어 진입", tokenValue);

    if (tokenType !== "token") {
        res.status(400).send({
            errorMessage: "token이 아닙니다",
        });
        return;
    }
    try {
        const tokenvoll = jwt.verify(tokenValue, "MS-secret-key");
        console.log(tokenvoll);

        res.locals.userId = tokenvoll.userId;
        res.locals.nickname = tokenvoll.nickname;

        next();
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
};
