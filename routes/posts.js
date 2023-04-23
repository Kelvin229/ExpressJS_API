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
 * /creator:
 *   get:
 *     summary: Retrieve posts by creator name
 *     description: Retrieve a list of posts created by a specific user
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Name of the creator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts created by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/creator', getPostsByCreator);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of posts
 *     description: Retrieve a paginated list of posts sorted by most recent
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve
 *     responses:
 *       200:
 *         description: A paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                   description: A list of posts
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 numberOfPages:
 *                   type: integer
 *                   description: The total number of pages
 *       404:
 *         description: The requested resource was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get('/', getPosts);

/**
 * @swagger
 *
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The specified post was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *     tags:
 *       - Posts
 */
router.get('/:id', getPost);


/**
 * @swagger
 *
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               title: Sample Post
 *               message: This is a sample post.
 *               tags: ["sample", "post"]
 *     responses:
 *       201:
 *         description: Created post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Conflict - unable to create post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Unable to create post
 */
router.post('/', auth, createPost);

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - _id
 *         - title
 *         - message
 *         - tags
 *         - creator
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the post.
 *         title:
 *           type: string
 *           description: The title of the post.
 *         message:
 *           type: string
 *           description: The message body of the post.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags associated with the post.
 *         creator:
 *           type: string
 *           description: The ID of the user who created the post.
 *         createdAt:
 *           type: string
 *           description: The date and time the post was created.
 *         updatedAt:
 *           type: string
 *           description: The date and time the post was last updated.
 */

/**
 * @swagger
 *
 * /posts/{id}:
 *   patch:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *               message:
 *                 type: string
 *                 description: Message of the post
 *               creator:
 *                 type: string
 *                 description: ID of the post's creator
 *               selectedFile:
 *                 type: string
 *                 description: URL of the post's selected image file
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the post
 *     responses:
 *       "200":
 *         description: Updated post object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Title of the post
 *                 message:
 *                   type: string
 *                   description: Message of the post
 *                 creator:
 *                   type: string
 *                   description: ID of the post's creator
 *                 selectedFile:
 *                   type: string
 *                   description: URL of the post's selected image file
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Tags associated with the post
 *                 _id:
 *                   type: string
 *                   description: ID of the updated post
 *       "404":
 *         description: Post with given ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.patch('/:id', auth, updatePost);

/**
 * @swagger
 *
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: The specified post ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while deleting the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.delete('/:id', auth, deletePost);

/**
 * @swagger
 *
 * /posts/{id}/likePost:
 *   patch:
 *     summary: Like or unlike a post
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like or unlike
 *     responses:
 *       200:
 *         description: The updated post with new like(s)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: The specified post ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while updating the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.patch('/:id/likePost', auth, likePost);

/**
 * @swagger
 * /{id}/commentPost:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to add a comment to
 *       - in: body
 *         name: comment
 *         description: The comment to add to the post
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             value:
 *               type: string
 *     responses:
 *       200:
 *         description: The updated post with the new comment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The specified post could not be found
 *       409:
 *         description: An error occurred while saving the updated post
 */
router.post('/:id/commentPost', commentPost);

module.exports = router;