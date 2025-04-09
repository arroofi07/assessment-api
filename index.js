// Import packages
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const home = require("./routes/home");
const mahasiswa = require("./routes/Mahasiswa");
const story = require("./routes/Story");
const comments = require("./routes/Comments");
const admin = require("./routes/Admin");
const likes = require("./routes/Likes");
const app = express();



app.use(cookieParser());
app.use(cors());

// Middlewares
app.use(express.json());

// Routes
app.use("/home", home);
app.use("/mahasiswa", mahasiswa);
app.use("/story", story);
app.use("/comments", comments);
app.use("/admin", admin);
app.use("/likes", likes);


// Middleware untuk mengizinkan permintaan dari domain yang berbeda
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Ubah sesuai dengan URL aplikasi React Anda
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Endpoint untuk mengatur cookie
app.get("/set-cookie", (req, res) => {
  res.cookie("nama_cookie", "nilai_cookie", {
    maxAge: 900000, // Waktu kedaluwarsa cookie dalam milidetik
    httpOnly: true, // Hanya diakses melalui HTTP, tidak bisa diakses melalui JavaScript pada klien
  });
  res.send("Cookie berhasil diatur");
});
app.get("/get-cookie", (req, res) => {
  const cookieValue = req.cookies.nama_cookie;
  res.send(`Nilai cookie: ${cookieValue}`);
});


// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
