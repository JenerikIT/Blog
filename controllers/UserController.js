import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      phone: req.body.phone,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "не удалось зарегестрировать пользователя" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+passwordHash"
    );

    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "пользователь не найден" });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({ userData, state: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "нет доступа", state: false });
  }
};
