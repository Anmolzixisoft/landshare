const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Get the token from the request headers or query string

    
    const authHeader = req.headers.authorization || req.query.token;
    const token = authHeader.substring(7);
    const secretKey = 'secret_key';
    if (!token) {
      return res.send({ error: 'Token is missing.' });
    }
  
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          console.log(err);
        return res.send({ error: 'Token is invalid.' });
      }
  
      // Token is valid, attach the decoded user information to the request
      req.user = decoded;
      next();
    });
  }

module.exports={verifyToken}
