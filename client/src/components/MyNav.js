import React from  'react'
import {Link} from  'react-router-dom'
import LinkedInButton from './LinkedInButton'

function MyNav(props) {

  const { 
      onLinkedInSuccess, 
      onLinkedInFailure, 
      loggedInUser,
      onLogout,
    } = props  

  return (
        <nav>
            {
                loggedInUser ? (
                    <>
                        <button onClick={onLogout}>Logout</button>
                        <Link  style={{marginLeft: '10px'}}  to="/profile">Profile</Link>
                    </>
                
                ) : (
                <>
                    <LinkedInButton onSuccess={onLinkedInSuccess} onFailure={onLinkedInFailure}/>
                    <Link  style={{marginLeft: '10px'}}  to="/signin">SignIn</Link>
                    <Link  style={{marginLeft: '10px'}}  to="/signup">SignUp</Link>
                </>
                )
            }
        </nav>
    )
}
export default MyNav