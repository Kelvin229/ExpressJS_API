const express = require('express')

const { 
    getPosts,
    getPostsBySearch, 
    getPostsByCreator, 
    getPost, 
    createPost, 
    updatePost, 
    likePost, 
    commentPost, 
    deletePost
 } = require('../controllers/posts.js');

const router = express.Router();
const auth = require('../middleware/auth.js');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts.
 */

/**
 * @swagger
 * /posts/creator:
 *   get:
 *     summary: Retrieve a list of blog posts by creator
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of blog posts by creator
 */
router.get('/creator', getPostsByCreator);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Returns a list of posts that match the specified search query.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: The search query.
 *     responses:
 *       200:
 *         description: A list of posts that match the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/search', getPostsBySearch);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of blog posts
 */
router.get('/', getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a specific blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A blog post object
 */
router.get('/:id', getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Blog post object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The created blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post('/', auth,  createPost);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a specific blog post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Blog post object to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.patch('/:id', auth, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a specific blog post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', auth, deletePost);

/**
 * @swagger
 * /posts/{id}/likePost:
 *   patch:
 *     summary: Like a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to like
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post successfully liked
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/likePost', auth, likePost);

/**
 * @swagger
 * /posts/{id}/commentPost:
 *   post:
 *     summary: Comment on a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to comment on
 *         schema:
 *           type: string
 *       - in: body
 *         name: comment
 *         required: true
 *         description: Comment to be added to the post
 *         schema:
 *           type: object
 *           required:
 *             - comment
 *           properties:
 *             comment:
 *               type: string
 *               example: This is a comment.
 *     responses:
 *       201:
 *         description: Comment successfully added to post
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/commentPost', commentPost);

module.exports = router;