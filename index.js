require("dotenv").config();
require('module-alias/register');

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const hpp = require("hpp");
const cookieParser = require('cookie-parser');

const { corsOptionsDelegate } = require("@/@configs/corsConfig");
const startServer = require("./src/start");

// Express App
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptionsDelegate));

app.use(compression());
app.use(cookieParser());


// Rate Limiting
const limiter = rateLimit({
    max: 100,               // limit each IP to 100 requests
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: "Too many requests. Try again later.",
});

app.use(limiter);

app.use(hpp());

app.use(morgan("dev"))

// Basic Route
app.get("/test", (req, res) => {
    res.status(200).json({ message: "Welcome to School Master 🧑‍🏫" });
});

// Run Server
startServer(app);
