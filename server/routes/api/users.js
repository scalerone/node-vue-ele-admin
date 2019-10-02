// @login & register
const express = require('express');
const router = express.Router();
const  bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');

const passport = require('passport');
const User = require('../../models/User');


// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: 'login api test...' });
});


// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
    // console.log(req.body)
    // console.log(res)
    User.findOne({email:req.body.email})
        .then((user)=>{
            if(user){
                return res.status(400).json('邮箱已被注册!');
            }else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if (err) throw err;
                        newUser.password = hash;

                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));

                    });
                });

            }
        })

});


// @route  POST api/users/login
// @desc   返回token jwt passport
// @access public
router.post('/login', (req, res) => {
    const {email,password} = req.body;
    // 查询数据库
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json('用户不存在!');
        }
        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                };
                //登录后返回token
                // jwt.sign("规则","加密名字","过期时间","箭头函数")
                jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
                // res.json({msg:"success"});
            } else {
                return res.status(400).json('密码错误!');
            }
        });
    });
});

// @route  GET api/users/current
// @desc   return current user
// @access Private
// router.get("/current","验证token",(req,res)=>{
//     res.json({msg:"success"});
// })

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //拿到/config/passport.js中处理后的用户信息，返回部分属性
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity:req.user.identity
        });
    }
);
//使用jwt.verify进行token验证
router.get(
    '/userinfo',
    (req, res) => {
        //从cookie中获取token
        // console.log(req.cookies); //拿取cookies
        let token = req.cookies.sid;
        token =token.replace("Bearer ","");//因为从cookie取，所以要去掉Bearer
        const decoded  = jwt.verify(token, keys.secretOrKey);
        User.findById(decoded.id)
            .then(user => {
                if(user){
                    res.json({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                    });
                }
                res.json({msg:"fail"});

            })
            .catch(err => console.log(err));

    }
);
module.exports = router;