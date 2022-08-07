const express = require('express');
const tagsRouter = express.Router();

const { getAllTags } = require('../db');
const { getPostsByTagName } = require('../db')

tagsRouter.get('/', async (req, res, next) => {
    const tags = await getAllTags(); 
    res.send({
        tags
    })
})

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    try {
        const posts = await getPostsByTagName(tagName);
        res.send ({
            posts
        })
    } catch ({ name, message }) {
        res.send({
            name: error.name,
            message: error.message
        })
    }
})


module.exports = tagsRouter;