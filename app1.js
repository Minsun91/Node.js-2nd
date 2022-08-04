const express = require("express");
const connect = require("./schemas");
// const { Op } = require("sequelize");
// const jwt = require("jsonwebtoken");
const app = express(); //express 서버 객체가 받아오고. app이라는 변수에 객체가 들어있다
const port = 8000;

connect();

const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}; //arrowfunction은 값, (함수는 1급 객체라 값으로 다룰 수 있음)

app.use(express.json());
app.use(requestMiddleware); //위 화살표 함수를 requestMiddleware 변수에 넣었고, 그걸 변수 여기에 넣어줌

app.use("/", [commentRouter, postRouter]); //[commentRouter, userRouter] 등 여러 개 붙일 수 있다

app.get("/", (req, res) => {
    res.send("4주차 과제!");
}); //router

app.listen(port, () => {
    //listen은 서버를 키겠다.
    console.log(port, "포트로 서버가 켜졌어요");
});
