import React, { Component } from 'react';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png'

class LinkedInButton extends Component {

  render() {
    const { onSuccess, onFailure } = this.props
    return (
      <div>
        <LinkedIn
          clientId="78vnwlzh5ohmwt"
          onFailure={onFailure}
          onSuccess={onSuccess}
          scope={'r_liteprofile r_emailaddress'}
          redirectUri={`http://localhost:3000/linkedin`}
        >
          <img src={linkedin} alt="Log in with Linked In" style={{ maxWidth: '180px' }} />
        </LinkedIn>
      </div>
    );
  }
}

export default LinkedInButton;