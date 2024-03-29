const express = require('express')
const mongoose = require('mongoose')

const PostMessage = require('../models/postMessage.js')


const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        // const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex).select('title message createdAt likes');

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        // const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        const posts = await PostMessage.aggregate([
            { $match: { $or: [ { title }, { tags: { $in: tags.split(',') } } ] } },
            { $project: { title: 1, message: 1, createdAt: 1, likes: 1 } },
          ]);

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
         const posts = await PostMessage.find({ name });
       // const posts = await PostMessage.find({ name }).select('title message createdAt likes');

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createPost = async (req, res) => {
    // const post = req.body;
    const { title, message, tags, selectedFile } = req.body;

    // const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    const newPostMessage = new PostMessage({ title, message, tags, selectedFile, creator: req.userId, createdAt: new Date().toISOString() })
    
    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    // const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    // await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    // res.json(updatedPost);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }

    try {
        const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
        const post = await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

        res.json(post);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    // await PostMessage.findByIdAndRemove(id);

    // res.json({ message: "Post deleted successfully." });
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }

    try {
        await PostMessage.findByIdAndRemove(id);

        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    // const post = await PostMessage.findById(id);

    // const index = post.likes.findIndex((id) => id ===String(req.userId));

    // if (index === -1) {
    //   post.likes.push(req.userId);
    // } else {
    //   post.likes = post.likes.filter((id) => id !== String(req.userId));
    // }

    // const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    // res.status(200).json(updatedPost);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }

    try {
        const post = await PostMessage.findById(id);
        const index = post.likes.findIndex((id) => id === String(req.userId));

        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    // const post = await PostMessage.findById(id);

    // post.comments.push(value);

    // const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    // res.json(updatedPost);
    try {
        const post = await PostMessage.findById(id);
        post.comments.push(value);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const postController = {
    getPosts,
    getPostsBySearch,
    getPostsByCreator,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentPost,
  };
  
  // Export the object
  module.exports = postController;