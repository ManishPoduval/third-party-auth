import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import {  Route, Switch, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import config from './config'
import axios from 'axios'
import MyNav from './components/MyNav'
import Profile from './components/Profile';

class App extends Component {

  state = {
    loggedInUser: null,
    error: null,
    showLoading: true,
  }

  // Check if the user is loggedInAlready
  componentDidMount(){
    const { loggedInUser } = this.state
    if (!loggedInUser) {
      axios.get(`${config.API_URL}/api/user`, {withCredentials: true})
        .then((response) => {
            this.setState({
              loggedInUser: response.data,
              showLoading: false,
            })
        })
        .catch(() => {
          this.setState({
            showLoading: false,
          })
        })
    }  
  }

  handleLinkedInSuccess = (data) => {
    this.setState({
      showLoading: true
    })
    axios.post(`${config.API_URL}/api/linkedin/info`, {code: data.code}, {withCredentials: true})
      .then((response) => {
        this.setState({
          loggedInUser: response.data.data,
          error: null,
          showLoading: false
        }, () => {
          this.props.history.push('/profile')
        });   
      })
  }

  handleLinkedInFailure = (error) => {
    //TODO: Handle these errors yourself the way you want. Currently the state is not in use
    this.setState({
      error,
    }); 
  }

  handleFacebookReponse = (data) => {
    this.setState({
      showLoading: true
    })
    const {name, email, picture: {data: {url}}, userID} = data
    let newUser = {name, email, image: url, facebookId: userID}
    axios.post(`${config.API_URL}/api/facebook/info`, newUser , {withCredentials: true})
      .then((response) => {
        this.setState({
          loggedInUser: response.data.data,
          error: null,
          showLoading: false
        }, () => {
          this.props.history.push('/profile')
        });   
      })
  }

  handleGoogleSuccess = (data) => {
    this.setState({
      showLoading: true
    })
    const {givenName, familyName, email, imageUrl, googleId} = data.profileObj
    let newUser = {
      firstName: givenName,
      lastName: familyName,
      email, 
      image: imageUrl, 
      googleId
    }
    axios.post(`${config.API_URL}/api/google/info`, newUser , {withCredentials: true})
      .then((response) => {
        this.setState({
          loggedInUser: response.data.data,
          error: null,
          showLoading: false
        }, () => {
          this.props.history.push('/profile')
        });   
      })
  } 

  handleGoogleFailure = (error) => {
    //TODO: Handle these errors yourself the way you want. Currently the state is not in use
    console.log(error) 
    this.setState({
      error,
    }); 
  }


  handleLogout = () => {
    axios.get(`${config.API_URL}/api/logout`, {withCredentials: true})
    .then(() => {
      this.setState({
        loggedInUser: null,
        error: null,
      });   
    })
  }

  render() {
    const { loggedInUser, showLoading } = this.state
    if (showLoading) {
      return <p>Loading data. . . </p>
    }
    return (
      <>
        <MyNav 
          onLogout={this.handleLogout} 
          loggedInUser={loggedInUser}
          onLinkedInSuccess={this.handleLinkedInSuccess}
          onLinkedInFailure={this.handleLinkedInFailure}
          onFacebookResponse={this.handleFacebookReponse}
          onGoogleSuccess={this.handleGoogleSuccess}
          onGoogleFailure={this.handleGoogleFailure}
        />
        <Switch >
          <Route exact path="/linkedin" component={LinkedInPopUp} />
          <Route path="/profile" render={() => {
            return <Profile loggedInUser={loggedInUser} />
          }} />
        </Switch>
      </>  
    );
  }
}

export default withRouter(App)