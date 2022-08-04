const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;

    //토큰 여부 확인
    const { cookie } = req.headers;
    console.log(cookie);

    if (cookie) {
        res.status(400).send({ errorMessage: "이미 로그인 되어 있습니다. " });
        return;
    }

    if (!/^[A-Za-z0-9]{4,}$/.test(password)) {
        res.status(400).send({
            errorMessage:
                "비밀번호는 4자리 이상의 영문, 숫자 콤비네이션만 가능.",
        });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return;
    }
    if (nickname.indexOf(password) > -1) {
        res.status(400).send({
            errorMessage: "닉네임은 패스워드에 사용할 수 없습니다.",
        });
        return;
    }

    const existUsers = await User.findAll({
        where: { nickname },
    });

    console.log(existUsers);

    if (!existUsers) {
        res.status(400).send({
            errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
    }

    const user = new User({ nickname, password });
    console.log("회원가입", user);
    await user.save();
    res.send({
        Message: "회원 가입에 성공하였습니다.",
    });
});

//login
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    // const user = await Users.findOne({ where: { email, password } });
    const user = await User.findOne({ where: { nickname } });
    console.log("로그인 닉네임 확인", user);

    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
        });
        return;
    }
    const token = jwt.sign(
        { userId: user.userId, nickname: user.nickname },
        "MS-secret-key"
    );
    res.cookie("token", token, {
        maxAge: 300000, // expires: 300000, 300000밀리초 → 300초
    });
    res.send({ token });
});

//사용자인증 users/me로 들어오느 경우 미들웨어 실행
router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    console.log("사용자인증", user);
    res.send({
        user: {
            // email: user.email,
            nickname: user.nickname,
        },
    });
});

module.exports = router;
