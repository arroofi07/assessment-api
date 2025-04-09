const express = require("express");
const router = express.Router();
const { Story, Mahasiswa, Likes, Comments } = require("../models");
const jwt = require("jsonwebtoken");

// menampilakan semua data pada tabel story
router.get("/", async (req, res) => {
  const listStory = await Story.findAll({
    include: [
      {
        model: Likes,
      },
      {
        model: Comments,
      },
    ],
  });
  res.json(listStory);
});

// menampilkan data dari tabel story berdasarkan id
router.get("/:storyId", async (req, res) => {
  const { storyId } = req.params;
  const story = await Story.findOne({
    where: { id: storyId },
    include: [Likes],
  });

  if (story) {
    res.json(story);
  } else {
    res.status(404).json({ message: "Cerita tidak ditemukan" });
  }
});

// ini baris untuk mengirim cerita ke tabel story
router.post("/talk", async (req, res) => {
  try {
    const { story, tagar } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { nama, id } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });

    const newStory = await Story.create(
      {
        story,
        tagar,
        nama: mahasiswa.nama, // Simpan nama mahasiswa ke dalam kolom "nama"
        MahasiswaId: mahasiswa.id,
      },
      {
        include: {
          model: Mahasiswa,
          as: "Mahasiswa",
        },
      }
    );

    res.status(201).json(newStory);
  } catch (error) {
    console.log(error);
  }
});

//

// ini baris untuk menghapus cerita berdasarkan user yang sedang login
router.delete("/:storyId", async (req, res) => {
  try {
    const { storyId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const { nama, id } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });

    // Pastikan cerita yang akan dihapus milik user yang sedang login
    const storyToDelete = await Story.findOne({
      where: { id: storyId, MahasiswaId: mahasiswa.id },
    });

    if (!storyToDelete) {
      return res
        .status(404)
        .json({ message: "Cerita tidak ditemukan atau tidak boleh dihapus." });
    }

    // Hapus cerita
    await storyToDelete.destroy();

    res.status(200).json({ message: "Cerita berhasil dihapus." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus cerita." });
  }
});

module.exports = router;
