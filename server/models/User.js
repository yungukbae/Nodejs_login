const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//salt 생성
const saltRounds = 10



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        minLength: 5
    },
    lastname: {
        type:String,
        maxLength: 50,
    },
    role:{
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{
        type:Number
    }
})


//정보 암호화
userSchema.pre('save', function(next) { //화살표 펑션 사용시 에러남
    let user = this;

    //패스워드가 변경될때만 암호를 암호화 한다.
    if(user.isModified('password')) {
        //비밀번호 암호화 시킨다.
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        //비밀번호를 바꾸는게 아니면 그냥 빠져나가라
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {

    var user = this;

    //토큰을 decode한다.
    jwt.verify(token,'secretToken',function (err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token":token}, function (err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })



}


// userSchema.methods.comparePassword = function(plainPassword, cb) {
//
//     //plainPassword Ex) 1234567 암호화된 비밀번호 $2b$10$5WKstWVOARTnrD2g0.pT.uHVdRSV2Ye6JiCIAOPAHr5iDSRCrXV/a
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
//         if(err) return cb(err)
//
//             cb(null, isMatch)
//     })
// }
// userSchema.methods.generateToken = function(cb) {
//     var user = this;
//
//     //jsonwebtoken을 이용한 토큰 생성 user_id와 secretToken을 이용해 토큰을 생성한다 보면 된다.
//     var token = jwt.sign(user._id.toHexString(),'secretToken')
//
//     user.token = token
//     user.save(function(err, user){
//         if(err) return cb(err)
//         cb(null,user)
//     })
//
// }



const User = mongoose.model('User',userSchema)

module.exports = { User }