const router = require("express").Router();
// Lazy me, I don't have time to convert superagent to axios
const request = require('superagent');
const UserModel = require('../models/User.model')

function requestAccessToken(code) {
  return request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=authorization_code')
    .send(`redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}`)
    .send(`client_id=${process.env.LINKEDIN_CLIENT_ID}`)
    .send(`client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`)
    .send(`code=${code}`)
}

function requestProfile(token) {
  return request.get('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))')
  .set('Authorization', `Bearer ${token}`)
}

function requestEmail(token){
  return request.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))')
  .set('Authorization', `Bearer ${token}`)
}

// The client makes a API request to this url sending the code in the body
router.post("/linkedin/info", async (req, res, next) => {
  try {
    // Exchanging the code for the access token 
    let tokenResponse = await requestAccessToken(req.body.code)
    // Gets the profile details
    let profileResponse = await requestProfile(tokenResponse.body.access_token)
    //Gets the email details
    let emailResponse = await requestEmail(tokenResponse.body.access_token)
    
    //The code below is just to structure the obj as per the fields that we need 
    let {localizedFirstName, localizedLastName, id, profilePicture} = profileResponse.body
    let { elements: [,,,fourth] } = profilePicture['displayImage~']
    let {elements: [emailInfo]} = emailResponse.body
    let newLoginInfo = {
      firstName: localizedFirstName,
      lastName: localizedLastName,
      linkedInId: id,
      image: fourth.identifiers[0].identifier,
      email: emailInfo['handle~'].emailAddress, 
    }
    // Create the user in the DB
    UserModel.create(newLoginInfo)
      .then((response) => {
        // Save the loggedInInfo in the session
        // We'll stick to using sessions just to not over complicate the students with tokens and cookies
        req.session.loggedInUser = response
        res.status(200).json({data: response})
      })
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

module.exports = router;
