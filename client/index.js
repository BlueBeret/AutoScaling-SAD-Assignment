const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto')

const express = require("express");

const app = express();

app.set("view engine", 'ejs');
app.use(express.static("uploads"));

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req,res) =>{
  res.render('index');
});
const multer = require("multer");

const handleError = (err, res) => {
  console.log(err)
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "images"
});


app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const id = crypto.randomBytes(16).toString("hex");
    const targetPath = path.join(__dirname, "./uploads/"+id+".png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/api/getimages", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return handleError(err, res);

    res.json(files.map(file => "/" + file));
  });
});