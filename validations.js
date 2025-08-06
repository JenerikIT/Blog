import { body } from "express-validator";
import validator from "validator";

export const loginValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Имя должно быть минимум 3 символа").isLength({ min: 4 }),
  body("avatarUrl", "Некорректный URL аватарки").optional().isString(),
  body("phone", "Некорректный номер").isLength({ min: 8 }),
];

export const postCreateValidation = [
  body("title", "введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
  body("tags", "неверный формат тегов").optional().isArray(),
  body("imageUrl", "неверная ссылка на изображение").optional().isString(),
];
