const express = require('express');
const axios = require('axios');

const facebookRouter = express.Router();

facebookRouter.get('/', (req, res) => {
    res.send(`
      <html>
        <body>
          <a href="https://www.facebook.com/v6.0/dialog/oauth?client_id=${357895676712791}&r
  edirect_uri=${encodeURIComponent('http://127.0.0.1:5500/Frontend/facebooklogin.html')}">
            Log In With Facebook
          </a>
        </body>
      </html>
    `);
  });

  const accessTokens = new Set();
  
  // Route 2: Exchange auth code for access token
  facebookRouter.get('/oauth-redirect', async (req, res) => {
    try {
      const authCode = req.query.code;
  
      // Build up the URL for the API request. `client_id`, `client_secret`,
      // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
      // must match the `redirect_uri` in the dialog URL from Route 1.
      const accessTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
        `client_id=${appId}&` +
        `client_secret=${appSecret}&` +
        `redirect_uri=${encodeURIComponent('http://localhost:3000/oauth-redirect')}&` +
        `code=${encodeURIComponent(authCode)}`;
  
      // Make an API request to exchange `authCode` for an access token
      const accessToken = await axios.get(accessTokenUrl).then(res => res.data['access_token']);
      // Store the token in memory for now. Later we'll store it in the database.
      console.log('Access token is', accessToken);
      accessTokens.add(accessToken);
  
      res.redirect(`/me?accessToken=${encodeURIComponent(accessToken)}`);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.response.data || err.message });
    }
  });
  
module.exports = facebookRouter;
