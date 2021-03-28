const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('./config/key');



//application/x-www-form-urlencodded <=이걸 분석해서 가져오는 코드
app.use(bodyParser.urlencoded({extended: true}));

//json형태로 가져올 수 있도록 한 것
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false
}).then(() => console.log("MONGODB CONNECT SUCCESS!"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World! nodemon test')
})


app.post('/register',(req,res) => {

    //회원가입 필요정보들을 client에서 가져오면 그것들을 데이터베이스에 저장하는것
    const user = new User(req.body)

    //save는 몽고디비 method, 괄호 안에는 콜백 펑션
    user.save((err,user) => {
        //에러 발생시 성공하지 못했다고 에러메세지를 json형태로 전달.
        if(err) return res.json({success: false,err});

        //status 200(성공)시 json 파일로 success:true를 반환해줘라
        return res.status(200).json({
            success: true
        })
    })
})


app.post('/login',function(req,res) {

    User.findOne({email:req.body.email},function(err,user) {

        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일이 존재하지 않습니다"
            })
        }



            user.comparePassword(req.body.password, function(err, isMatch){


                if (!isMatch) return res.json({loginSuccess: false, message: "비밀번호가 틀립니다."})

                user.generateToken(function(err, user) {
                    if (err) return res.status(400).send(err);

                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({loginSuccess: true, userId: user._id})

                })
            })
    })
})


app.get('/api/users/auth',auth, (req,res) => {

    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 뜻
    res.status(200).json({
        _id:req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout',auth, (req,res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err,user) => {
        if(err) return res.json({success:false, err});
        return res.status(200).send({
            success:true
        })
        })
})



// app.post('/login',(req,res) => {
//
//     //요청된 이메일을 데이터베이스에서 있는지 찾는다.
//     User.findOne({email:req.body.email}, function(err,user) {
//         if(!user){
//             return res.json({
//                     loginSuccess:false,
//                     message:"이메일을 찾을 수 없습니다."
//                 }
//             )
//         }
//
//         //요청된 이메일이 데이터베이스에 있다면 비밀번호를 확인한다.
//
//
//         user.comparePassword(req.body.password, (err,isMatch)=>{
//
//         if(!isMatch)
//             return res.json({loginSuccess: false, message: "비밀번호가 틀립니다."})
//
//         //비밀번호 까지 맞다면 토큰을 생성하기.
//         user.generateToken(function(err,user){
//                 if(err) return res.status(400).send(err);
//
//             //토큰을 저장한다. Ex) 쿠키, 로컬스토리지 우선은 쿠키에 한다.
//             res.cookie("x_auth",user.token)
//                 .status(200)
//                 .json({loginSuccess: true, userId: user._id});
//             })
//         })
//     })
// })




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

