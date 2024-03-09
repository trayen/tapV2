require('dotenv').config();

const cors = require('cors');
const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db/index');
const authRouter = require('./routes/authRoutes');
const employeeRoute = require('./routes/employeeRoutes');
const bureauRoute = require('./routes/bureauRoutes');
const affectationRoute = require('./routes/affectationRoutes');
const filter = require('./routes/filter');

const authenticateToken = require('./utils/authenticateToken');

const app = express();
const port = process.env.PORT || 5000;
connectToDatabase();

// Middleware
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRouter);
app.post('/landing', (req, res) => {
  res.sendStatus(200);
});
app.post('/verify-token', authenticateToken, (req, res) => {
  // If the middleware reaches here, it means the token is valid
  res.status(200).json({ message: 'Token is valid' });
});
// Routes
app.use('/filter', filter);
app.use('/employee', employeeRoute);
app.use('/bureau', bureauRoute);
app.use('/affectation', affectationRoute);
//production/*
/*
app.use(express.static("../frontend/build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,"frontend","build","index"))
})
*/
// Start the server
app.listen(port,'0.0.0.0' ,() => {
  console.log(`Server is running on port ${port}`);
});
