const mongoose = require('mongoose');//引入Mongoose
const Schema = mongoose.Schema;//声明Schema

//创建我们的用户Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    identity: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
//发布模型 mongoose.model('User',userSchema) 并导出
module.exports = User = mongoose.model('users', UserSchema);
