const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();

// 引入users.js
const users = require('./routes/api/users');

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cookieParser 初始化
app.use(cookieParser());
// passport 初始化
app.use(passport.initialize());
//passport 配置
require('./config/passport')(passport);

// DB config
const db = require('./config/key').mongoURI;

// connect to mongodb
mongoose.connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// app.get("/",(req,res)=>{
//     res.send("hello world");
// })

// 使用routes
// http://127.0.0.1:5001/api/users/test
app.use('/api/users', users);

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});