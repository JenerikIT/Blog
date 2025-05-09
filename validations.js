import { body } from "express-validator";

export const loginValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "имя должно быть минимум 3 символа").isLength({ min: 3 }),
  body("avatarUrl", "аватарка должна быть ссылкой").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 3 }).isString(),
  body("tags", "неверный формат тегов").optional().isArray(),
  body("imageUrl", "неверная ссылка на изображение").optional().isString(),
];
