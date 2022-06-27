const express = require("express");
const cors = require("cors");
const router = require("./routes/videos");
const app = express();

require("dotenv").config();
const { PORT, BACKEND_URL } = process.env

// Middleware 

// need to allow cross origin resource sharing 
app.use(cors());

// need to serve static files/images from public
app.use(express.static('public'));

// express router 
app.use("/videos", router);

app.get("/", (req, res) => {
    res.status(200)
    res.send("Welcome to Brainflix")
});

app.listen(PORT, () => {
    console.log(`Listening on ${BACKEND_URL}:${PORT}`)
});

