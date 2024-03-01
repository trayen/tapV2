const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Token = require('../db/schemas/Token');
const BlacklistedToken = require('../db/schemas/BlacklistedToken');

dotenv.config();

async function main() {
  // Always generate a new secret key
  const newSecretKey = crypto.randomBytes(16).toString('hex');

  // Update the .env file with the new secret key
  console.log('Updating .env file with the new JWT_SECRET_KEY...');

  // Remove the old JWT_SECRET_KEY from the .env file
  const envFileContent = fs.readFileSync('.env', 'utf-8');
  const updatedEnvFileContent = envFileContent.replace(/JWT_SECRET_KEY=.+\n/, '');
  fs.writeFileSync('.env', `${updatedEnvFileContent}JWT_SECRET_KEY=${newSecretKey}\n`);

  console.log('Successfully updated .env file with the new JWT_SECRET_KEY.');

  // Connect to the MongoDB database
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the database');

    // Blacklist all tokens after connecting to the database
    await blacklistAllTokens();

    // Server startup logic can go here
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from the database');
  }
}

// Blacklist all existing tokens in the database
// Blacklist all existing tokens in the database
async function blacklistAllTokens() {
  try {
    const allTokens = await Token.find();

    //console.log('Processing tokens for blacklisting:', allTokens);

    for (const token of allTokens) {
      // Check if the token is already blacklisted
      const existingBlacklistedToken = await BlacklistedToken.findOne({ token: token.token });

      if (!existingBlacklistedToken) {
        // Blacklist the token
        await BlacklistedToken.create({ token: token.token });
        //console.log(`Token blacklisted: ${token.token}`);

        // Remove the user's token from the database
        const deleteResult = await Token.findOneAndDelete({ token: token.token });
        //console.log('Delete result:', deleteResult);
      }
    }

   // console.log(`${allTokens.length} tokens processed for blacklisting.`);
  } catch (error) {
    console.error('Error blacklisting tokens:', error.message);
  }
}



main();
