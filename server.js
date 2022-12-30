// imports area
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
app.use(bodyParser.json())
app.use(json())
app.use(urlencoded({ extended: false }))
connectDB()



// routes area

app.get('/',(req,res)=>{
    res.send("<h1>welcome to server:)</h1>")
})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port} ...clt+c to stop`)
})

app.use('/api/auth', require('./routes/auth.js'));