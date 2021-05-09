import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class Profile extends Component {
    render() {
        if (!this.props.loggedInUser) {
            return <Redirect to={'/'} />
        }
        const { firstName, lastName, image, email } = this.props.loggedInUser
        return (
            <div>
                <h1>Hello {firstName} {lastName}</h1>
                <img style={{width: '250px'}} src={image} />
                <h4>Email: {email}</h4>
            </div>
        )
    }
}
