const express = require("express");
const app = express();
const cors = require("cors");
// const mysql = require("mysql");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//start
//
//
//
//
// validasi cookies start
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
// validasi cookies end
//
//
//
//
//
//end

app.use(express.json());
app.use(cors());

const db = require("./models");

const home = require("./routes/home");
app.use("/home", home);
// ini table mahasiswa
const mahasiswaRouter = require("./routes/Mahasiswa");
app.use("/mahasiswa", mahasiswaRouter);

const adminRouter = require("./routes/Admin");
app.use("/admin", adminRouter);

// const newsRouter = require("./routes/News");
// app.use("/news", newsRouter);

const storyRouter = require("./routes/Story");
app.use("/story", storyRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const Profil = require("./routes/Profil");
app.use("/profil", Profil);
//
// baris ini agar agar gambar dari database profil bisa di tampilkan
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // validasi tambah nilai mahasiswas start
// const { Sequelize, DataTypes } = require("sequelize");
// // Konfigurasi koneksi ke basis data
// const sequelize = new Sequelize("community", "root", "Dynamite07", {
//   host: "localhost",
//   dialect: "mysql",
// });
// // Mengimport model Mahasiswa
// const MahasiswaModel = require("./models/Mahasiswa")(sequelize, DataTypes);

// // Membuat tabel Mahasiswa di basis data jika belum ada
// sequelize.sync();

// // Route untuk menambahkan nilai mahasiswa
// app.post("/mahasiswa/:nama/tambah-nilai", async (req, res) => {
//   const { nama } = req.params;
//   const { kategori, nilai } = req.body;

//   try {
//     // Mencari mahasiswa berdasarkan nama
//     const mahasiswa = await MahasiswaModel.findOne({
//       where: {
//         nama,
//       },
//     });

//     if (!mahasiswa) {
//       return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
//     }

//     // Memperbarui nilai sesuai kategori
//     if (kategori === "kehadiran") {
//       mahasiswa.kehadiran += nilai;
//     } else if (kategori === "tugas") {
//       mahasiswa.tugas += nilai;
//     } else if (kategori === "partisipasi") {
//       mahasiswa.partisipasi += nilai;
//     } else if (kategori === "penugasan_online") {
//       mahasiswa.penugasan_online += nilai;
//     } else if (kategori === "quiz") {
//       mahasiswa.quiz += nilai;
//     } else {
//       return res.status(400).json({ message: "Kategori nilai tidak valid" });
//     }

//     // Menyimpan perubahan nilai ke basis data
//     await mahasiswa.save();

//     return res.status(200).json({ message: "Nilai berhasil diperbarui" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Terjadi kesalahan server" });
//   }
// });

// validasi tambah nilai mahasiswas end
const port = process.env.PORT || 9001;
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
  });
});
