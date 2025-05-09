import express from "express";
import mongoose from "mongoose";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import {
  addfavouritePost,
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
} from "./controllers/PostController.js";
import multer from "multer";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";
import cors from "cors";
import { toggleFavorite } from "./controllers/FavouritesController.js";
mongoose
  .connect(
    "mongodb+srv://ahmarediculs:nara198019801980@cluster0.tefwgbd.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((res) => {
    console.log("DB okey");
  })
  .catch((err) => {
    console.log("DB err", err);
  });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
app.use(cors()); // чтобы избежать ошибку cors
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// route авторизации и регистрации
app.get("/auth/me", checkAuth, getMe);

app.post("/auth/login", loginValidation, handleValidationsErrors, login);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationsErrors,
  register
);

// route поста

app.get("/posts", getAllPosts);
app.get("/posts/:id", getOnePost);

app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  updatePost
);
// app.patch("/posts/liked/:id", checkAuth, toggleFavorite);
app.delete("/posts/:id", checkAuth, deletePost);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  createPost
);

// route для загрузки файла

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uplods/${req.file.originalname}`,
  });
});
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log("server ok");
  }
});
