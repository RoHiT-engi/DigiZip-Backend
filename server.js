const json = require('express');
const urlencoded = require('express');
const express = require('express')
const cors = require('cors')
const {config} = require('dotenv')
const connectDB = require('./config/db.js')



config()
const app = express()
const port = 5000 
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

connectDB()


app.get('/',(req,res)=>{
    res.send("<h1>welcome to server:)</h1>")
})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port} ...clt+c to stop`)
})