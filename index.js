const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Allow all origins for CORS
app.use(cors());

app.get("/", (req, res) => res.send("Server started!"));

// Function to generate a random file name
const generateRandomFileName = () => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters
  return `${timestamp}_${randomString}`;
};

app.post("/upload_audio", upload.single("audio"), (req, res) => {
  const tempPath = req.file.path;
  const fileExt = path.extname(req.file.originalname);
  const randomFileName = generateRandomFileName() + fileExt;
  const targetPath = path.join(__dirname, "uploads", randomFileName);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).send("Error uploading file");
    const filePath = path.join(__dirname, "uploads", randomFileName);
    res.sendFile(filePath);
  });
});

// Define a route to serve files based on the filename parameter
app.get("/files/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "uploads", fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      // Handle any errors that occur while sending the file
      res.status(500).send("File not found");
    }
  });
});

// api to listing file in uploads folder
app.get("/list_files", (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, "uploads"));
  res.send(files);
});
