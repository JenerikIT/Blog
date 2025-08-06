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
  createPost,
  deletePost,
  getAllLikedPostUser,
  getAllPosts,
  getOnePost,
  toggleLike,
  updatePost,
} from "./controllers/PostController.js";
import multer from "multer";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";
import cors from "cors";
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

// route validate
app.get("/validate", checkAuth, (req, res) => {
  res.json({ valid: true, user: req.user });
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
app.get("/posts/all/liked", checkAuth, getAllLikedPostUser);

app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  updatePost
);
app.patch("/posts/liked/:id", checkAuth, toggleLike);

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
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post("/upload/user", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log("server ok");
  }
});
