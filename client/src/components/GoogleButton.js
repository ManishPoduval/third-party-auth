import React from 'react'
import GoogleLogin from 'react-google-login';

function GoogleButton(props) {
    const {onSuccess, onFailure} = props
    
    return (
        <div>
            <GoogleLogin
                clientId="611182173270-qbp56vs4lb9813bm9k68l3ci5vfot6hg.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default GoogleButton
