const express = require('express');
const postsRouter = express.Router();


const { getAllPosts } = require('../db');


postsRouter.get('/', async (req, res) => {
    console.log("hello")
    const posts = await getAllPosts();
    console.log(posts)
    res.send({
        posts
    });
});


module.exports = postsRouter;