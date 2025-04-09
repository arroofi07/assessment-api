const express = require("express");
const router = express.Router();
const { Comments, Mahasiswa } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const jwt = require("jsonwebtoken");

router.get("/:storyId", async (req, res) => {
  const storyId = req.params.storyId;
  const comments = await Comments.findAll({ where: { StoryId: storyId } });
  res.json(comments);
});

// router.post("/", async (req, res) => {
//   const comment = req.body;
//   await Comments.create(comment);
//   res.json(comment);
// });

// ini baris untuk mengirim komentar sesuai dengan id cerita
router.post("/", async (req, res) => {
  try {
    const { Comment, storyId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { nama, id } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });

    const newComment = await Comments.create(
      {
        Comments: Comment,
        StoryId: storyId,
        Nama: mahasiswa.nama, // Simpan nama mahasiswa ke dalam kolom "Nama"
        MahasiswaId: mahasiswa.id,
      },
      {
        include: {
          model: Mahasiswa,
          as: "Mahasiswa",
        },
      }
    );

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
  }
});

// baris untuk menghapus komentar  berdasarkan user yang sedang login
router.delete("/:storyId", async (req, res) => {
  try {
    const { storyId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const { nama, id } = jwt.verify(token, "importantsecret");

    const mahasiswa = await Mahasiswa.findOne({
      where: { nama, id },
    });

    // memastikan comment yang akan dihapus milik user yang sedang login
    const commentToDelete = await Comments.findOne({
      where: { id: storyId, MahasiswaId: mahasiswa.id },
    });

    if (!commentToDelete) {
      return res
        .status(404)
        .json({ message: "comment tidak ditemukan/ tidak boleh di hapus" });
    }

    // hapus comment
    await commentToDelete.destroy();

    res.status(200).json({ message: "comment berhasil di hapus" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus comment" });
  }
});

module.exports = router;
