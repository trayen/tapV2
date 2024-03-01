const jwt = require('jsonwebtoken');
const Token = require('../db/schemas/Token');
const BlacklistedToken = require('../db/schemas/BlacklistedToken');

const secretKey = process.env.JWT_SECRET_KEY;

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
  }

  try {
    const foundToken = await Token.findOne({ token });

    if (!foundToken) {
      return res.status(401).json({ error: 'Unauthorized: Token not found' });
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });

    if (blacklistedToken) {
      console.log('Token has been blacklisted on the server.');
      // Add a small delay before local storage removal (for testing purposes)
      setTimeout(() => {
        console.log('Removing token from local storage.');
        localStorage.removeItem('token');
      }, 1000); // 1 second delay (adjust as needed)

      return res.status(401).json({ error: 'Unauthorized: Token has been invalidated (logged out)' });
    }

    const user = jwt.verify(token, secretKey);

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired', expiredAt: err.expiredAt });
    }

    console.error("Error verifying token:", err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = authenticateToken;


module.exports = authenticateToken;
