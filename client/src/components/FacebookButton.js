import React from 'react'
import FacebookLogin from 'react-facebook-login';


function FacebookButton(props) {

    const {onFacebookResponse} = props

    return (
        <div>
           <FacebookLogin
                appId="467079284375882"
                autoLoad={false}
                fields="name,email,picture"
                callback={onFacebookResponse} 
            />
        </div>
    )
}

export default FacebookButton