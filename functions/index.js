const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// // imports area
const json = require('express');
const urlencoded = require('express');
const express = require('express')
// const cors = require('cors')
// const bodyParser = require('body-parser');
// const {config} = require('dotenv')
// const connectDB = require('./functions/config/db.js')



// configs area
// config()
const app = express()
const port = 5000 
// // app.use(cors())
// app.use(bodyParser.json())
// app.use(json())
// app.use(urlencoded({ extended: false }))
// connectDB()



// routes area

app.get('/',(req,res)=>{
    res.send("<h1>welcome to server:)</h1>")
})



app.use('/api/auth', require('./functions/routes/auth.js'));

exports.api = functions.https.onRequest(app);