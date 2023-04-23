const express = require('express')
const Subscriber = require('../models/subscriber');

const {
  getAllSubscribers,
  getOneSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
} = require('../controllers/subscribers.js');

const router = express.Router()

// Getting all
router.get('/', getAllSubscribers);

// Getting One
router.get('/:id', getSubscriber, getOneSubscriber)

// Creating one
router.post('/', createSubscriber);

// Updating One
router.patch('/:id', getSubscriber, updateSubscriber);

// Deleting One
router.delete('/:id', getSubscriber, deleteSubscriber);

async function getSubscriber(req, res, next) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' });
    }
    req.subscriber = subscriber;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router