const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../db/schemas/User');
const Token = require('../db/schemas/Token');
const BlacklistedToken = require('../db/schemas/BlacklistedToken');

const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error while signing up");
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the user already has a valid token
    if (user.token) {
      // Move the existing token to the blacklist
      const existingToken = await Token.findOne({ token: user.token });
      if (existingToken) {
        const blacklistedToken = new BlacklistedToken({ token: user.token });
        await blacklistedToken.save();
        // Remove the existing token from the Token collection
        await Token.findOneAndDelete({ token: user.token });
      }
    }

    // Generate a new token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      secretKey,
      {
        expiresIn: '24h',
      }
    );

    // Update the user's token in the database
    user.token = token;
    await user.save();

    // Create a new document in the Token collection
    const newToken = new Token({ token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    await newToken.save();

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required for logout' });
    }

    const newBlacklistedToken = new BlacklistedToken({ token });
    await newBlacklistedToken.save();

    // Remove the user's token from the database
    await Token.findOneAndDelete({ token });

    // Clear the user's token in the database
    req.user.token = null;
    await req.user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports =  router ;
