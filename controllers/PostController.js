import PostModel from "../models/Post.js";

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
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "не удалось создать статью" });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

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
export const addfavouritePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({ message: "не найдено" });
    }
    res.json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "произошла ошибка лайкнуого поста" });
  }
};

export const updatedPostLike = async (req, res) => {
  const postId = req.params.id;

  const love = await PostModel.findOneAndUpdate({ _id: postId });
  if (love) {
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

export const deletePost = async (req, res) => {
  try {
    const doc = await PostModel.findOneAndDelete({ _id: req.params.id });

    if (!doc) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

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
