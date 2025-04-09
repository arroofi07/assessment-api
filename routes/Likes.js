// Server - likes.js
const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddlewares");


// ini baris untuk mengirim dan menghapus like
router.post("/", validateToken, async (req, res) => {
  const { StoryId } = req.body;
  const MahasiswaId = req.mahasiswa.id;

  try {
    const existingLike = await Likes.findOne({
      where: { StoryId: StoryId, MahasiswaId: MahasiswaId },
    });

    if (!existingLike) {
      await Likes.create({
        StoryId: StoryId,
        MahasiswaId: MahasiswaId,
        Warna: true,
      });
      res.json("Liked");
    } else {
      await Likes.destroy({
        where: { StoryId: StoryId, MahasiswaId: MahasiswaId },
      });
      res.json("UnLiked");
    }
  } catch (error) {
    console.error("Failed to like/unlike:", error);
    res.status(500).json("Failed to like/unlike");
  }
});

// ini  untuk mengambil status like untuk membuat fitur warna pada like
router.get("/", validateToken, async (req, res) => {
  const MahasiswaId = req.mahasiswa.id;

  try {
    const likedStatusData = await Likes.findAll({
      where: { MahasiswaId: MahasiswaId },
      attributes: ["StoryId", "Warna"], // Ambil kolom "StoryId" dan "Warna" dari tabel Likes
    });

    const likedStatus = {};
    likedStatusData.forEach((item) => {
      likedStatus[item.StoryId] = item.Warna;
    });

    res.json(likedStatus);
  } catch (error) {
    console.error("Failed to fetch liked status:", error);
    res.status(500).json("Failed to fetch liked status");
  }
});

module.exports = router;
