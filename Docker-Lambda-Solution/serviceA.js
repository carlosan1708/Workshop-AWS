"use strict";
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000

app.post('/callAPI', async(req, res) =>{
  try{
    const targetUrl = req.body.targetURL;
    const message = req.body.targetBody;
    console.log(message)
    const response = await axios.post(targetUrl, message, {
      headers:{
        'Content-Type': 'text/plain'
      }
    })
    res.json(response.data);
  }catch(error){
    console.error(error)
    res.status(500).json({error: "Internal Server Error"})
  }
})

app.listen(PORT, () => {
  console.log("API available at: http://localhost:3000/callAPI")
})
