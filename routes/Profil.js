const multer = require("multer");
const express = require("express");
const router = express.Router();
const { Profil, Mahasiswa } = require("../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// ini adalah middleware untuk membuat fitur upload file start
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalFileName = file.originalname;
    cb(null, originalFileName); // Hanya gunakan nama file asli tanpa tambahan angka unik
  },
});
// Create multer instance
const upload = multer({ storage }).single("potoProfil"); // Set up multer and provide the callback function
// ini adalah middleware untuk membuat fitur upload file end

//
// ini baris untuk mengirim  file poto ke database start
// Route untuk menyimpan data profil pengguna
router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    // Use the upload middleware with the callback function
    if (err) {
      // Handle any errors that occurred during file upload
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }

    try {
      // const { potoProfil } = req.file;
      const originalFileName = req.file.originalname;
      const token = req.headers.authorization.split(" ")[1];
      const { nama, id } = jwt.verify(token, "importantsecret");

      const mahasiswa = await Mahasiswa.findOne({
        where: { nama, id },
      });

      const newProfil = await Profil.create(
        {
          MahasiswaId: mahasiswa.id,
          nama: mahasiswa.nama,
          potoProfil: originalFileName,
        },
        {
          include: {
            model: Mahasiswa,
            as: "Mahasiswa",
          },
        }
      );
      res.status(202).json(newProfil);
    } catch (error) {
      res.status(404).json({ error: "Terjadi kesalahan pada server" });
    }
  });
});

// // Route untuk mengambil data profil pengguna berdasarkan user yang sedang login
router.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { nama, id } = jwt.verify(token, "importantsecret");

  try {
    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });
    if (!mahasiswa) {
      return res.status(404).json({ message: "Data pengguna tidak ditemukan" });
    }

    const newProfil = await Profil.findOne({
      where: {
        nama: mahasiswa.nama,
        MahasiswaId: mahasiswa.id,
      },
    });

    if (newProfil) {
      res.json(newProfil);
    } else {
      res.status(404).json({ message: "data tidak diemukan" });
    }
  } catch (error) {
    console.log({ message: `terjadi kesalahan pada server: ${error}` });
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// // Route untuk mengupdate data profil pengguna berdasarkan user yang login
// Route untuk mengupdate data profil pengguna berdasarkan user yang login
router.put("/update", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id, nama } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { id, nama },
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    const newProfil = await Profil.findOne({
      where: { MahasiswaId: mahasiswa.id },
    });

    // hapus file poto dari folder uploads menggunakan fs.unlinkSync()
    const fotoPath = path.join(__dirname, "../uploads/", newProfil.potoProfil);
    fs.unlinkSync(fotoPath);

    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Terjadi kesalahan saat mengganti foto profil" });
      }

      const originalFileName = req.file.originalname;

      const updatedProfil = await Profil.update(
        {
          potoProfil: originalFileName,
        },
        {
          where: {
            MahasiswaId: mahasiswa.id,
          },
        }
      );

      if (updatedProfil[0] === 1) {
        return res
          .status(200)
          .json({ message: "Foto profil berhasil diupdate" });
      } else {
        return res
          .status(500)
          .json({ error: "Terjadi kesalahan saat mengupdate foto profil" });
      }
    });
  } catch (error) {
    return res.status(404).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Route untuk menghapus data profil pengguna berdasarkan user yang login
// memeriksa jika di dalam folder uploads terdapat file dengan nama yang sama maka yang di hapus hanya satu
const hapusFileDuplikat = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.delete("/delete", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id, nama } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { id, nama },
    });

    if (!mahasiswa) {
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    }

    // Dapatkan data Profil yang terkait dengan mahasiswa
    const newProfil = await Profil.findOne({
      where: { MahasiswaId: mahasiswa.id },
    });

    if (!newProfil) {
      return res.status(404).json({ error: "Profil tidak ditemukan" });
    }

    // Pastikan ada foto profil sebelum menghapus
    if (!newProfil.potoProfil) {
      return res.status(404).json({ error: "Foto profil tidak ditemukan" });
    }

    // hapus file poto dari folder uploads menggunakan fs.unlinkSync()
    const fotoPath = path.join(__dirname, "../uploads/", newProfil.potoProfil);
    hapusFileDuplikat(fotoPath);

    // Hapus semua kolom "Profil" untuk mahasiswa berdasarkan "MahasiswaId"
    await Profil.destroy({
      where: { MahasiswaId: mahasiswa.id },
    });

    return res.status(200).json({ message: "Data Profil berhasil dihapus" });
  } catch (error) {
    console.log(error);
    console.log({ error: "Terjadi kesalahan saat menghapus data" });
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat menghapus data" });
  }
});

module.exports = router;
