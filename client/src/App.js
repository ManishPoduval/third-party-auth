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