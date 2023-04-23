const express = require('express')

const {
  getAllSubscribers,
  getOneSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubcriber
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
router.delete('/:id', getSubscriber, deleteSubcriber);

async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.subscriber = subscriber
  next()
}

module.exports = router