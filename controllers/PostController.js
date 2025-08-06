import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    // Наполняем данные пользователя
    const populatedPost = await PostModel.findById(post._id)
      .populate({
        path: "user",
        select: "fullName avatarUrl", // Выбираем только нужные поля
      })
      .exec();

    res.json(populatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("user");

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Ошибка при получении статьи:", error);
    res.status(500).json({
      message: "Не удалось получить статью",
      error: error.message,
    });
  }
};
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    // 1. Находим пост и пользователя
    const [post, user] = await Promise.all([
      PostModel.findById(postId),
      UserModel.findById(userId),
    ]);

    if (!post || !user) {
      return res
        .status(404)
        .json({ message: "Пост или пользователь не найден" });
    }

    // 2. Проверяем, лайкал ли пользователь пост
    const isLiked = user.likedPosts.includes(postId);

    // 3. Обновляем данные
    if (isLiked && post.likeCount > 0) {
      // Удаляем лайк
      await Promise.all([
        PostModel.updateOne({ _id: postId }, { $inc: { likeCount: -1 } }),
        UserModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } }),
      ]);
    } else {
      // Добавляем лайк
      await Promise.all([
        PostModel.updateOne({ _id: postId }, { $inc: { likeCount: 1 } }),
        UserModel.updateOne({ _id: userId }, { $push: { likedPosts: postId } }),
      ]);
    }

    // 4. Возвращаем обновлённые данные
    const updatedPost = await PostModel.findById(postId);
    res.json({
      post: updatedPost,
      isLiked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обработке лайка", error });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ошибка получения всех постов" });
  }
};
export const getAllLikedPostUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const { likedPosts } = user;
    const posts = await PostModel.find().populate("user").exec();
    const items = posts.filter(({ _id }) => likedPosts.includes(_id));
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ items });
  } catch (error) {
    console.log("error:", error);
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    // Удаляем пост и чистим лайки параллельно
    await Promise.all([
      PostModel.findOneAndDelete({ _id: postId, user: userId }), // Удаляем только посты автора
      UserModel.updateMany(
        { likedPosts: postId },
        { $pull: { likedPosts: postId } }
      ),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении статьи:", err);
    res.status(500).json({ message: "Не удалось удалить статью" });
  }
};

export const updatePost = async (req, res) => {
  try {
    await PostModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "не удалось обновить статью" });
  }
};
