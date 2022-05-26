var path = require('path');
const http = require("http");
const fetch = require("node-fetch");
const express = require("express");
const app = express();


app.set("view engine", 'ejs');

const CLIENT_SERVICE_URL = "http://localhost:3000";


const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3100;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req,res) =>{
  try {
    fetch(CLIENT_SERVICE_URL+"/api/getimages")
      .then(response => response.json())
      .then(result => {
        console.log(result)
        return res.render('index', {images: result, baseURL: CLIENT_SERVICE_URL});
      })
  } catch (err) {
    console.log(err)
  }
});

var imgq = []

app.get('/detail', (req, res) => {
  console.log(imgq)
  const img = req.query.img
  const payload = {
    name: img,
    status: "inqueue"
  }
  for (var i = 0; i < imgq.length; i++) {
    var item = imgq[i]
    if (item.name === img) {
      if (item.status === "inqueue") {
        res.send('Image is waiting to be processed')
        return
      }else if (item.status === "inprocess"){
        res.send("Image is in process")
        return
      }
        
      else if (item.status === "done"){
        res.send(item.result)
        return
      }
        
    }
  }
    
  imgq.push(payload)
  res.send('Image is added to queue')
})

app.get("/getjob", (req, res) => {
  imgq.forEach(item => {
    if (item.status === "inqueue") {
      item.status = "inprocess"
      res.json(item)
      return
    }
  })
  res.json("{No job available}")
})

app.get("/updatejob", (req, res) => { 

  const img = req.query.name
  const result = req.query.result
  imgq.forEach(item => {
    if (item.name === img) {
      item.status = "done"
      item.result = result
      res.json("Job updated")
      return
    }
  })
  res.json("No job found")
})

app.get("/reset", (req, res) => {
  imgq = []
  res.json("Queue reset")
})


app.get("/qlist", (req, res) => { 
  res.json(imgq)
})