const express = require('express')
const mongoose = require('mongoose')
const Subscriber = require('../models/subscriber')

// Getting all
const getAllSubscribers = async (req, res) => {
    try {
      const subscribers = await Subscriber.find()
      res.json(subscribers)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  
  // Getting One
  const getOneSubscriber =  (req, res) => {
    res.json(req.subscriber)
  }
  
  // Creating one
  const createSubscriber = async (req, res) => {
    const subscriber = new Subscriber({
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel
    })
    try {
      const newSubscriber = await subscriber.save()
      res.status(201).json(newSubscriber)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
  
  // Updating One
  const updateSubscriber = async (req, res) => {
    try {
      if (req.body.name != null) {
        req.subscriber.name = req.body.name
      }
      if (req.body.subscribedToChannel != null) {
        req.subscriber.subscribedToChannel = req.body.subscribedToChannel
      }
      const updatedSubscriber = await req.subscriber.save()
      res.json(updatedSubscriber)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }  
  
  // Deleting One
  const deleteSubscriber = async (req, res) => {
    try {
      if (req.subscriber) {
        await req.subscriber.remove();
        res.json({ message: 'Subscriber deleted' });
      } else {
        res.status(404).json({ message: 'Subscriber not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };  

  
  const subscriberController = {
    getAllSubscribers,
    getOneSubscriber,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
  };

  module.exports = subscriberController;