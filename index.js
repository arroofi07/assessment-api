// Import packages
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Middlewares - pastikan middleware diletakkan SEBELUM routes
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Tambahkan ini untuk form data

// Konfigurasi CORS - gunakan satu metode saja
app.use(
  cors({
    origin: "http://localhost:3000", // Ubah sesuai dengan URL aplikasi React Anda
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
    credentials: true,
  })
);

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

app.use(express.json());

// Import routes
const home = require("./routes/home");
const mahasiswa = require("./routes/Mahasiswa");
const story = require("./routes/Story");
const comments = require("./routes/Comments");
const admin = require("./routes/Admin");
const likes = require("./routes/Likes");
const profil = require("./routes/Profil");

// Routes
app.use("/home", home);
app.use("/mahasiswa", mahasiswa);
app.use("/story", story);
app.use("/comments", comments);
app.use("/admin", admin);
app.use("/likes", likes);
app.use("/profil", profil);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
