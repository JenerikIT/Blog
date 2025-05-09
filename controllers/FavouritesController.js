import User from "../models/User.js";
import Post from "../models/Post.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.userId;

    // Проверяем существование поста
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    // Находим пользователя
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем, есть ли пост в избранном
    const isFavorite = user.favorites.includes(postId);

    if (isFavorite) {
      // Удаляем из избранного
      user.favorites.pull(postId);
      post.likeCount -= 1; // Уменьшаем счетчик лайков
    } else {
      // Добавляем в избранное
      user.favorites.push(postId);
      post.likeCount += 1; // Увеличиваем счетчик лайков
    }

    // Сохраняем изменения
    await Promise.all([user.save(), post.save()]);

    res.json({
      success: true,
      isFavorite: !isFavorite,
      likeCount: post.likeCount,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Ошибка при обновлении избранного:", error);
    res.status(500).json({ message: "Не удалось обновить избранное" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    // Получаем пользователя с заполненными данными постов
    const user = await User.findById(userId).populate({
      path: "favorites",
      populate: {
        path: "user",
        select: "fullName avatarUrl",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error("Ошибка при получении избранного:", error);
    res.status(500).json({ message: "Не удалось получить избранное" });
  }
};
