require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const session = require("express-session");

// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });
mongoose.set("strictQuery", false);
//database
const connectDB = require("./db/connect");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");

//product router
// const productRouter = require("./routes/ProductRoute");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.set("trust proxy", 1);

// app.use(cors());
app.use(
  cors({
    origin: [
      "https://api-test-app-xkpf-skhalil772.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(
  session({
    secret: "keyboard",
    cookie: { sameSite: "strict" },
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(cookieParser());

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("<h1>I See something nice</h1>");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("Testing cookies");
});
app.get("/setcookie", (req, res) => {
  res.cookie("me", "hello");

  res.send("Cookie have been saved successfully");
});

app.use("/api/v1/auth", authRouter);

// app.use(express.static("./public"));
// app.use(fileUpload({ useTempFiles: true }));
// app.use("/api/v1/products", productRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server is listening on port ${port}...`));

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
