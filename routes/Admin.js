const express = require("express");
const router = express.Router();
const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { nama, password } = req.body;

  const admin = await Admin.findOne({ where: { nama: nama } });
  if (!admin) {
    return res.json({ error: "Username anda salah" });
  }

  bcrypt.compare(password, admin.password).then((match) => {
    if (match) {
      const accessToken = sign(
        { nama: admin.nama, id: admin.id },
        "importantsecret" /*ini adalah kunci rahasia yg akan terus di gunakan */
      );
      return res.json({ accessToken, id: admin.id });
      // return res.json("YOU LOGGED IN");
    } else {
      return res.json({ error: "Password anda salah" });
    }
  });
});

module.exports = router;
