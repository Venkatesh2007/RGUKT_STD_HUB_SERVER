const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "./uploads/";

    try {
      await fs.access(uploadDir);
    } catch (error) {
      await fs.mkdir(uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    // Handle the uploaded PDF here (e.g., save it, process it)

    // Respond with the list of uploaded files
    const uploadedFiles = await fs.readdir("./uploads/");
    res.json({ message: "PDF uploaded successfully!", uploadedFiles });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get/uploads", async (req, res) => {
  try {
    // Get the list of uploaded files
    const uploadedFiles = await fs.readdir("./uploads/");
    res.json({ uploadedFiles });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/download/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "uploads", fileName);
    console.log(filePath);
    res.download(filePath,fileName,(err)=>{
        if(err){
            console.log('Error doenloading file');
            res.status(404).send('file not found');
        }
    })
//   try {
//     await fs.access(filePath);
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } catch (error) {
//     console.error("Error accessing or streaming file:", error);
//     res.status(404).send("File not found");
//   }
});
// app.get('/download/:fileName', async (req, res) => {
//   const fileName = req.params.fileName;
//   const filePath = path.join(__dirname, 'uploads', fileName);

//   try {
//     // Stream the file for download
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } catch (error) {
//     console.error('Error accessing or streaming file:', error);
//     res.status(404).send('File not found');
//   }
// });

app.use(express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
