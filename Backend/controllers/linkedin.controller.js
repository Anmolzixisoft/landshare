const qs = require('querystring');
const axios = require('axios');

const CLIENT_ID = '86lii75mdkg1xg'
const CLIENT_SECRET = 'beii6iVECN6CsFE8'
const REDIRECT_URI = 'http://localhost:5000/api/auth/linkedin/callback'
const SCOPE = 'email profile openid w_member_social'

const Authorization = () => {
    return encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${CLIENT_ID}&response_type=code&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`);
}

const Redirect = async (code) => {
    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
    };
    const { data } = await axios({
        url: `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`,
        method: 'POST',
        headers: {
            'Content-Type': 'x-www-form-urlencoded'
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error
    })
    return data;
}

module.exports = { Authorization, Redirect };