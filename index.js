
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
const cors = require('cors')
const bodyParser = require('body-parser');
const {config} = require('dotenv')
const connectDB = require('./config/db.js')



// configs area

config()
const app = express()
const port = 5000 
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())
connectDB()



// routes area

app.get('/',(req,res)=>{
    res.send("<h1>welcome to server:)</h1>")
})



app.use('/auth', require('./routes/auth.js'));

app.use('/file', require('./routes/File.js'));

app.use('/preset', require('./routes/Preset.js'));

app.use('/request', require('./routes/Request.js'));

app.get('/test',(req,res)=>{
    res.send("<h1>test route</h1>")
})
app.listen(port, ()=>{
    console.log(`server is listening on port ${port} ...clt+c to stop`)
})

// exports.api = functions.https.onRequest(app);