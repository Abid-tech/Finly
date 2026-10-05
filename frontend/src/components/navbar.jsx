import {React,useContext} from 'react'
import API_BASE from "../../lib/api_base"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../providers/authContext.provider"

function Navbar() {
  const {user,logout} = useContext(AuthContext)
  const navigate = useNavigate()


  const logoutFunction = async()=>{
    try{
      const response = await fetch(`${API_BASE}/user/logout`,{
        method : "POST",
        credentials : "include"
      })

      const result = await response.json()

      if(result.success){

        logout()
        navigate('/')
      }

    }
    catch(err){
      console.log(err)
    }
  }
  

  return (
    <>

    <div className="container">

          <div className="row">
            <div className="col-lg-12 logo_part">


              <div className="brand">
                <a href="/">
                  <span className="brand-name">Finly</span>
                </a>
              </div>

              {user ? (
                <>

                  <nav className="navbar_links">
                      <a href="/dashboard">Dashboard</a>
                      <a href="#transactions-section">Expense List</a>

                     
                  </nav>

                   <div className="user-dropdown">
                        <button className="user-dropdown-btn" type="button">
                          <span className="user-icon">
                            <i className="bi bi-person-circle"></i>
                          </span>

                          <span>{user.fullName}</span>

                          <i className="bi bi-chevron-down dropdown-arrow"></i>
                        </button>

                        <div className="dropdown-menu-custom">
                          <button type="button" className="dropdown-logout" onClick ={logoutFunction}>
                            <i className="bi bi-box-arrow-right"></i>
                            Logout
                          </button>
                        </div>
                      </div>

                
                </>

              ) :
              (

                <nav className="navbar_links">
                    <a href="#home" className="active">Home</a>
                    <a href="#howWorks">How it works</a>
                    <a href="#features">Features</a>
                </nav>

              )
            }

              

            </div>
          </div>
    </div>
    
    </>
  )
}

export default Navbar