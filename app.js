const express = require("express");
const app = express();
const AllRoutes = require("./src/Routes/index");
const cookieParser = require("cookie-parser");

// all middleware
app.use(express.json());
app.use(cookieParser());

app.use("/static/images/", express.static("./public/temp"));
app.use(AllRoutes);

module.exports = { app };
