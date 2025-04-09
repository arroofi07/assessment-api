const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "user not logged in" });
  try {
    const validToken = verify(accessToken, "importantsecret");
    if (validToken) {
      req.mahasiswa = validToken; // Set objek mahasiswa ke dalam req
      return next();
    }
  } catch (err) {
    return res.json({ error: "invalid token" });
  }
};

module.exports = { validateToken };
