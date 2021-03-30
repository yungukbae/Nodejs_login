import React,{useState} from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action'

function LoginPage() {

    const dispatch = useDispatch();

const [Email, setEmail] = useState("")
const [Password, setPassword] = useState("")


const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
}

const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
}

const onsubmitHandler = (event) => {
    event.preventDefault();
    console.log('Email',Email)
    console.log('Password',Password)

    let body = {
        email: Email,
        password: Password
    }

    dispatch(loginUser(body))

    Axios.post('/api/users/login',body).then(response => {

    })

}

    return (
        <div style={{display:'flex', justifyContent:'center',alignItems:'center',width:'100%',height:'100vh'}}>
            <form style={{display:'flex',flexDirection:'column'}} onSubmit={onsubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
