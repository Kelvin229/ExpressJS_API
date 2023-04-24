const express = require('express')
const router = express.Router();

const { signin, signup, googlelogin } = require('../controllers/user.js');

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/googlelogin", googlelogin);

module.exports = router;