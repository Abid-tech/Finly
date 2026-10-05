import React, { useState, useEffect, useContext } from 'react'
import './login.css'
import API_BASE from '../../../lib/api_base'
import {useNavigate,Link} from "react-router-dom"
import {AuthContext} from "../../providers/authContext.provider"

function Login({ setIsLogin }) {

  const[msg,setMsg] = useState('')
  const[msgType,setMsgType] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] =useState('')

  const navigate = useNavigate()
  const {user,login} = useContext(AuthContext)


   useEffect(() => {
  
              if (!msg) return
  
              const timer = setTimeout(() => {
                  setMsg('')
                  setMsgType('')
              }, 2000)
  
              return () => clearTimeout(timer)
  
      }, [msg])


  const loginHandle = async(e)=>{
        e.preventDefault()

        try{
            const response = await fetch(`${API_BASE}/user/login`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials:'include',
                    body : JSON.stringify({
                        email,
                        password
                    })
                }
            )

            const result = await response.json()
            
            if(result.success){
                setMsg(result.message || "Account created successfully")
                setMsgType("success")
                
                login(result.user)
                navigate('/dashboard')
                setEmail("")
                setPassword("")
            }
            else{
                setMsg(result.message || "Something went wrong")
                setMsgType("error")
            }
        

        }catch(err){
            console.log(err)
            setMsg(err.message || "Registration failed")
            setMsgType("error")
        }
  }


  return (
    <div className="login-card">

        <h2>Welcome back!</h2>

        <p className="login-subtitle">
        Log in to your account
        </p>

         {msg && (
            <div className={`form-message ${msgType}`}>
                <span>{msg}</span>
            </div>
        )}


        {/* Email */}
        <form onSubmit={loginHandle}>
            <div className="form-group">

            <label>Email</label>

            <div className="input-wrapper">
                <span className="input-icon">
                    <i className="bi bi-envelope"></i>
                </span>

                <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />
            </div>

            </div>


            {/* Password */}
            <div className="form-group">

            <label>Password</label>

            <div className="input-wrapper">

                <span className="input-icon">
                    <i className="bi bi-lock-fill"></i>
                </span>

                <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />

            </div>

            </div>


            <button className="login-btn" type='submit'>
                Log in
            </button>
        </form>


        <div className="or-divider">
            <span></span>
            <p>or</p>
            <span></span>
        </div>


        <button className="create-account-btn" onClick={() => setIsLogin(false)}>
                Create an account
                <span>→</span>
        </button>
    </div>
  )
}

export default Login