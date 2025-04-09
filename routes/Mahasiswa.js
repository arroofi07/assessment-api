const express = require("express");
const router = express.Router();
const { Mahasiswa } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const jwt = require("jsonwebtoken");

// Gunakan body-parser middleware untuk menguraikan body permintaan
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// ini untuk mengambil data dari  database
router.get("/", async (req, res) => {
  const listMahasiswa = await Mahasiswa.findAll();
  res.json(listMahasiswa);
});

// mengambil data sesuai dengan user yang sedang login
router.get("/user", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { nama, id } = jwt.verify(token, "importantsecret");
  try {
    // melakukan pencarian data mahasiswa berdasarkan mahasiswaId
    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });

    if (mahasiswa) {
      // jika data ditemukan
      res.status(200).json({ isi: mahasiswa });
    } else {
      // jika data tidak ditemukan
      res.status(404).json({ message: "data tidak ditemukan" });
    }
  } catch (error) {
    console.log(error);
  }
});

// router.get("/byId/:id", async (req, res) => {
//   const id = req.params.id;
//   const mahasiswa = await Mahasiswa.findByPk(id);
//   res.json(mahasiswa);
// });

// ini untuk mengirim data ke database
// router.post("/", async (req, res) => {
//   const mahasiswa = req.body;
//   await Mahasiswa.create(mahasiswa);
//   res.json(mahasiswa);
// });

// ini logic register
router.post("/", async (req, res) => {
  try {
    const { nama, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newMahasiswa = await Mahasiswa.create({
      nama: nama,
      password: hash,
    });
    res.json(newMahasiswa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal membuat Mahasiswa baru" });
  }
});

// ini logic login
router.post("/login", async (req, res) => {
  const { nama, password } = req.body;

  const mahasiswa = await Mahasiswa.findOne({ where: { nama: nama } });
  if (!mahasiswa) {
    return res.json({ error: "Username anda salah" });
  }

  bcrypt.compare(password, mahasiswa.password).then((match) => {
    if (match) {
      const accessToken = sign(
        { nama: mahasiswa.nama, id: mahasiswa.id },
        "importantsecret" /*ini adalah kunci rahasia yg akan terus di gunakan */
      );
      return res.json({ accessToken, id: mahasiswa.id });
      // return res.json("YOU LOGGED IN");
    } else {
      return res.json({ error: "Password anda salah" });
    }
  });
});

// Route untuk menambahkan nilai mahasiswa
router.post("/:nama/tambah-nilai", async (req, res) => {
  const { nama } = req.params;
  const { kategori, nilai } = req.body;

  try {
    // Mencari mahasiswa berdasarkan nama
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nama,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Memperbarui nilai sesuai kategori
    if (kategori === "kehadiran") {
      mahasiswa.kehadiran += nilai;
    } else if (kategori === "tugas") {
      mahasiswa.tugas += nilai;
    } else if (kategori === "partisipasi") {
      mahasiswa.partisipasi += nilai;
    } else if (kategori === "penugasan_online") {
      mahasiswa.penugasan_online += nilai;
    } else if (kategori === "quiz") {
      mahasiswa.quiz += nilai;
    } else {
      return res.status(400).json({ message: "Kategori nilai tidak valid" });
    }

    // Menyimpan perubahan nilai ke basis data
    await mahasiswa.save();

    return res.status(200).json({ message: "Nilai berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// baris kurang nilai mahasiswa
router.post("/:nama/kurang-nilai", async (req, res) => {
  const { nama } = req.params;
  const { kategori, nilai } = req.body;

  try {
    // Mencari mahasiswa berdasarkan nama
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nama,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Memperbarui nilai sesuai kategori
    if (kategori === "kehadiran") {
      mahasiswa.kehadiran -= nilai;
    } else if (kategori === "tugas") {
      mahasiswa.tugas -= nilai;
    } else if (kategori === "partisipasi") {
      mahasiswa.partisipasi -= nilai;
    } else if (kategori === "penugasan_online") {
      mahasiswa.penugasan_online -= nilai;
    } else if (kategori === "quiz") {
      mahasiswa.quiz -= nilai;
    } else {
      return res.status(400).json({ message: "Kategori nilai tidak valid" });
    }

    // Menyimpan perubahan nilai ke basis data
    await mahasiswa.save();

    return res.status(200).json({ message: "Nilai berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
