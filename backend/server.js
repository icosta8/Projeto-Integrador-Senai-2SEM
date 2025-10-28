const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const router = express.Router();

const userRoutes = require("./routes/userRoutes");
