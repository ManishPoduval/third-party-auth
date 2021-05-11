import React from  'react'
import {Link} from  'react-router-dom'
import FacebookButton from './FacebookButton'
import GoogleButton from './GoogleButton'
import LinkedInButton from './LinkedInButton'

function MyNav(props) {

  const { 
      onLinkedInSuccess, 
      onLinkedInFailure, 
      loggedInUser,
      onLogout,
      onFacebookResponse,
      onGoogleSuccess,
      onGoogleFailure
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
                    <FacebookButton onFacebookResponse={onFacebookResponse}/>
                    <GoogleButton  onSuccess={onGoogleSuccess} onFailure={onGoogleFailure} />
                </>
                )
            }
        </nav>
    )
}
export default MyNav