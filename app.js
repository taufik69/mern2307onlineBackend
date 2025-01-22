const express = require("express");
const app = express();
const AllRoutes = require("./src/Routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// all middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/static/images/", express.static("./public/temp"));
app.use(AllRoutes);

module.exports = { app };
