var ExifImage = require('exif').ExifImage;
const fetch = require('node-fetch');
async function main() {
  while (1) {
    try {
      fetch('http://localhost:3100/getjob')
    .then(response => response.json())
        .then(data => {
          if (data.name) {
            console.log('asigning to',data.name)
            fetch('http://localhost:3000/' + data.name)
              .then(response => response.buffer())
              .then(buffer => {
                console.log('processing', data.name)
                getmetadata(buffer).then(exifData => {
                  console.log('send response', data.name)
                  const payload = "http://localhost:3100/updatejob?name=" + data.name + "&result=" + JSON.stringify(exifData)
                  fetch(payload).then(response => console.log('done', data.name))
                  
                })
              })
            
          }
        }).catch(err => {
          console.log(err)
        })
        ;
    }
    catch (err) {
      console.log('something wrong')
      console.log(err)
    } finally {
      await sleep(5000);
    }
  }
}

function getmetadata(img) {
  await sleep(3000)
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: img }, function (error, exifData) {
        if (error) {
          console.log('Error: ' + error.message);
          reject(error.message);
        }
          
        else {
          resolve(exifData);
        }
          
      });
    } catch (error) {
      reject(error.message);
    }
  });
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main()


// const http = require("http");
// const path = require("path");
// const fs = require("fs");
// const crypto = require('crypto')

// const express = require("express");

// const app = express();

// app.set("view engine", 'ejs');
// app.use(express.static("uploads"));

// const httpServer = http.createServer(app);

// const PORT = process.env.PORT || 3000;

// httpServer.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// app.get('/', (req,res) =>{
//   res.render('index');
// });