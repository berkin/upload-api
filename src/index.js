import morgan from "morgan";
import express from "express";
import multer from "multer";
import v4 from "uuid/v4";
import mime from "mime";

const storage = multer.diskStorage({
  destination: "./files",
  filename(req, file, cb) {
    cb(null, `${v4()}.${mime.getExtension(file.mimetype)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: 1 * 1024 * 1024 // 1mb, in bytes
  }
}).single("file");

const app = express();
app.use(morgan("dev"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res) {
  res.json({
    heartbeat: true
  });
});

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.statusCode = 400;
      return res.json({
        error: err
      });
    }

    const file = req.file;
    const meta = req.body;
    res.json({
      filename: file.filename
    });
  });
});

app.listen(3010, function() {
  console.log("App started on port 3010");
});
