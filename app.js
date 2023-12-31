require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes");
const { PORT = 3000 } = process.env;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: null,
  });
});

app.listen(PORT, () => console.log("listening on port", PORT));
