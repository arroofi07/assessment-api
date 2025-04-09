// Import packages
const express = require("express");
const home = require("./routes/home");
const mahasiswa = require("./routes/Mahasiswa");
const story = require("./routes/Story");
const comments = require("./routes/Comments");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);
app.use("/mahasiswa", mahasiswa);
app.use("/story", story);
app.use("/comments", comments);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
