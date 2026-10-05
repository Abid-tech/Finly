import React from 'react'
import { useState, useEffect } from 'react'
import './register.css'
import API_BASE from '../../../lib/api_base'

function Register({ setIsLogin }) {

  const [form,setform] = useState({
        fullName : "",
        email : "",
        password : ""
   })
   const [msg,setMsg] = useState('')
   const [msgType, setMsgType] = useState('')

   const handleChange = (e)=>{
     const {name,value} = e.target
     setform(prevData=>({
        ...prevData,
        [name] : value
     }))

   }


   useEffect(() => {

            if (!msg) return

            const timer = setTimeout(() => {
                setMsg('')
                setMsgType('')
            }, 5000)

            return () => clearTimeout(timer)

    }, [msg])

   const handleForm = async (e)=>{

    e.preventDefault()
    try{
        const response = await fetch(`${API_BASE}/user/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                })
            })

        const result = await response.json()

        if (result.success) {
                setMsg(result.message || "Account created successfully")
                setMsgType("success")

                setform({
                    fullName: "",
                    email: "",
                    password: "",
                })
            }
        else{
            setMsg(result.message || "Registration failed")
            setMsgType("error")
        }
    }catch(err){
        console.error("Registration error:", err)
        setMsg("Something went wrong")
        setMsgType("error")

    }

   }


  return (
    <div className="register-card">

        <h2>Create your account</h2>

        <p className="register-subtitle">
            Start managing your finances today
        </p>


        {msg && (
            <div className={`form-message ${msgType}`}>
                {/* <i
                    className={
                        msgType === "success"
                            ? "bi bi-check-circle"
                            : "bi bi-exclamation-circle"
                    }
                ></i> */}

                <span>{msg}</span>
            </div>
        )}


        <form onSubmit={handleForm}>
        {/* Full Name */}
            <div className="form-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                <span className="input-icon">
                    <i className="bi bi-person"></i>
                </span>

                <input
                    type="text"
                    name='fullName'
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>


            {/* Email */}
            <div className="form-group">
                <label>Email</label>

                <div className="input-wrapper">
                <span className="input-icon">
                    <i className="bi bi-envelope"></i>
                </span>

                <input
                    type="email"
                    name='email'
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                </div>
            </div>


            {/* Password */}
            <div className="form-group">
                <label>Password</label>

                <div className="input-wrapper">
                <span className="input-icon">
                    <i className="bi bi-lock"></i>
                </span>

                <input
                    type="password"
                    name='password'
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                </div>
            </div>



            {/* Register Button */}
            <button type='submit' className="register-btn">
                Create account
            </button>

        </form>


        {/* Login Link */}
        <p className="login-text">
            Already have an account?
            <button
                type="button"
                className="link-btn"
                onClick={() => setIsLogin(true)}
            >
                Log in
            </button>
        </p>

    </div>
  )
}

export default Register