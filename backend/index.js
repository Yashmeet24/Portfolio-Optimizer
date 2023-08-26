const express = require("express");
const bodyparser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const portfolioRoutes = require("./routes/portfolio");

const app = express();
const port = process.env.port;

//middleware
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("server running at port :", port);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/portfolio", portfolioRoutes);
