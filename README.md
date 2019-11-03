
# node-vue-ele-admin
nodejs+vuecli3+element-ui构建后台管理系统，项目包含前后端。

### 技术栈
 - vue
 - element-ui
 - vue-router
 - vuex
 - nodejs
 - ES6
 - express

### 整体设计

1. 构建接口文档：Node+express+jwt；
1. 构建前端页面：VueCli3.0+Element-ui；
1. 数据请求及拦截：Axios+MongoDB；
1. 分页和筛选；
5. 利用postman工具

### 项目截图

<img src="https://github.com/scalerone/image-store/blob/master/node-vue-ele-admin/1.png?raw=true"/>  

<img src="https://github.com/scalerone/image-store/blob/master/node-vue-ele-admin/2.png?raw=true"/>  

<br/>

### 功能结构


<img src="https://github.com/scalerone/image-store/blob/master/node-vue-ele-admin/3.png?raw=true"/>  

<br/>



### 交互协议
#### JWT(jsonwebtoken)
> 前后数据请求要进行token验证，token 的前缀规定就是 'Bearer '，如果替换为其他的会不能被解析识别，相关格式
> jwt.sign(规格 , 私钥, 过期时间, 回调)


```
 //登录后返回token
// jwt.sign("规则参数","加密名字","过期时间","箭头函数")
jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600*24 }, (err, token) => {
    if (err) throw err;
    res.json({
        success: true,
        token: 'Bearer ' + token
    });
});
```
#### passport-jwt
> passport-jwt是一个针对jsonwebtoken的插件,用于对jsonwebtoken进行身份验证

1.使用passport-jwt之前需要先注册 passport

```
// app.js
const passport = require('passport')
app.use(passport.initialize());//初始化

// 引入passport.js文件，并把当前passport当作参数传过去
retuire('./config/passport.js')(passport)
```
2.新建 passport.js,用来配置验证规格

```
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/key')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);    
  }));
}
```
3.router-> user.js文件中 验证请求

```
// user.js
const passport = require('passport')
app.post('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    }
);

```
4.使用jwt.verify直接进行token验证，可以不用passport-jwt，如果token信息存在cookie中

```
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
```




### 前后端连载启动
> 使用npm包concurrently模块，通过package.json配置实现

1.在项目根路径server下安装concurrently模块

```
npm install  concurrently -S
```
2.配置client下的package.json

```
 "scripts": {
   "serve": "vue-cli-service serve",
   "build": "vue-cli-service build",
  + "start": "npm run serve"
 },
```
3.配置项目根目录server下的package.json

```
"scripts": {
 + "client-install": "npm install --prefix client",
 + "client": "npm start --prefix client",
  "start": "node server.js",
  "server": "nodemon server.js",
 + "dev": "concurrently \"npm run server\" \"npm run client\""
},
```



### 其他

1.优化：如果打包太大了，使用cdn的压缩文件进行连接

2.koa+jwt实现token验证与刷新
https://segmentfault.com/a/1190000019338195

3.vue中Axios的封装和API接口的管理
https://juejin.im/post/5b55c118f265da0f6f1aa354#heading-9