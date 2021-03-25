const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const {User} = require("./models/User");
const mongoose = require('mongoose');

//application/x-www-form-urlencodded <=이걸 분석해서 가져오는 코드
app.use(bodyParser.urlencoded({extended: true}));

//json형태로 가져올 수 있도록 한 것
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://yungukbae:qwe123@nodejsreactbasic.yyhbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false
}).then(() => console.log("MONGODB CONNECT SUCCESS!"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register',(req,res) => {

    //회원가입 필요정보들을 client에서 가져오면 그것들을 데이터베이스에 저장하는것
    const user = new User(req.body)

    //save는 몽고디비 method, 괄호 안에는 콜백 펑션
    user.save((err,userInfo) => {
        //에러 발생시 성공하지 못했다고 에러메세지를 json형태로 전달.
        if(err) return res.json({success: false,err});

        //status 200(성공)시 json 파일로 success:true를 반환해줘라
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})