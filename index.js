// Import packages
const express = require("express");
const home = require("./routes/home");
const mahasiswa = require("./routes/Mahasiswa");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);
app.use("/mahasiswa", mahasiswa);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
