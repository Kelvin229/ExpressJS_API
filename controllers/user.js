const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModal = require('../models/user.js');
const sanitizeHtml = require('sanitize-html');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const secretKey = process.env.JWT_SECRET;

    // Rate limiter to limit number of login attempts
    const loginRateLimiter = new RateLimiterMemory({
        points: 5, // number of attempts allowed
        duration: 60 * 60, // time window in seconds
    });

  const signin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
  
    try {
      // Check if login attempts have been exceeded
      await loginRateLimiter.consume(email);
  
      const sanitizedEmail = sanitizeHtml(email);
      const oldUser = await UserModal.findOne({ email: sanitizedEmail });
  
      if (!oldUser) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  
      if (!isPasswordCorrect) {
        // Increment failed login attempts
        await loginRateLimiter.consume(email);
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secretKey, { expiresIn: "1h" });
  
      res.status(200).json({ result: oldUser, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  
  
  const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const sanitizedEmail = sanitizeHtml(email);
      const oldUser = await UserModal.findOne({ email: sanitizedEmail });
  
      if (oldUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Implement password complexity requirements
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await UserModal.create({ email: sanitizedEmail, password: hashedPassword, name: `${firstName} ${lastName}` });
  
      const token = jwt.sign( { email: result.email, id: result._id }, secretKey, { expiresIn: "1h" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

const userController = {
    signin,
    signup,
  };
  
  // Export the object
  module.exports = userController;