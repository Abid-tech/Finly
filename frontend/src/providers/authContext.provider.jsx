import {createContext, React, useState, useEffect} from 'react'
import API_BASE from "../../lib/api_base"


export const AuthContext = createContext()

function AuthContextProvider({children}) {
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)
    
    useEffect(()=>{

        const fetchUser = (async()=>{
            try{
                const response = await  fetch(`${API_BASE}/user/me`,{
                    credentials: 'include',
                    method : "GET",
                })
                const userData = await response.json()
                if(response.ok){
                    setUser(userData.user)
                }
                else{
                    setUser(null)
                }
            }catch(err){
                console.log(err)
                setUser(null)
            }finally{
                setLoading(false)
            }
          })

        
        fetchUser()

    },[])


    const login = async(userData)=>{
        setUser(userData)
        return userData
    }

    const logout = async()=>{
        setUser(null)
        return null
    }




  return (

    < AuthContext.Provider value={{user,login,loading,logout}}>
            {children}
    </AuthContext.Provider>


  )
}

export default AuthContextProvider