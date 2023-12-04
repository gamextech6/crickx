const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const port = process.env.PORT || 3000;
// Models
const UserModel = require('./models/userModel');
var http = require('http');

//create a server object:
// http.createServer(function (req, res) {
//   res.write('A Monk in Cloud'); //write a response to the client
//   res.end(); //end the response
// }).listen(80);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Phone OTP Authentication API');
});


// Routes
const routes = require('./routes/route');
const adminRoutes = require('./routes/adminRoute');
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/', routes);
app.use('/admin/', adminRoutes);
app.use('/transactions', transactionRoutes);
const PORT = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// exports.deep = app;