const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost } = require('../db');
const { updatePost } = require('../db')
const { getPostById } = require('../db')

const { requireUser } = require('./utils')


postsRouter.get('/', async (req, res) => {

    const posts = await getAllPosts();
    console.log(posts)
    res.send({
        posts
    });
});

postsRouter.get('/', async (req, res, next) => {
    try {
      const allPosts = await getAllPosts();
      const posts = allPosts.filter(post => {
        if (post.active) {
          return true;
        }
      
        if (req.user && post.author.id === req.user.id) {
          return true;
        }

        return false;
      });

      res.send({
        posts
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


postsRouter.post('/', requireUser, async (req , res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    //const postData = {};
    
    const postData = {
        authorId: req.user.id,
        title: title,
        content: content
    }
    
    if (tagArr.length) {
        postData.tags = tagArr;
    }
    
    try {
        //const { authorId, title, content } = postData;
        
        const post = await createPost(postData);
        if (post){
            res.send({
                post
            })
        } else {
            next({
                message: error.message
            })
        }
    } catch ({ name, message }) {
        next ({ name, message });
    }
});



postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req. params;
    const { title, content, tags } = req.body;

    const updateFields = {};

    if (tags && tags.length > 0 ){
        updateFields.tags = tags.trim().split(/\s+/);
    }

    if (title) {
        updateFields.title = title;
    }

    if (content) {
        updateFields.content = content; 
    }

    try {
        const originalPost = await getPostById(postId);

        if (originalPost.author.id === req.user.id) {
            const updatedPost = await updatePost(postId, updateFields);
            res.send ({
                post: updatedPost
            })
        } else {
            next({
                name: 'unauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }
});


postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try{
        const post = await getPostById(req.params.postId);
        if (post && post.author.id === req.user.id) {
            const updatedPost = await updatePost(post.id, { active: false });
            res.send({ post: updatedPost });
        } else {
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            }: {
                name: "PostNotFoundError",
                message: "That post does not exist"
            });
        }
    } catch ({ name, message }){
        next({ name, message })
    }
});

module.exports = postsRouter;