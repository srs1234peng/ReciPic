const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// 使用 Multer 来处理文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// 创建一个目录来保存上传的文件
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 文件上传的 POST 路由
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
