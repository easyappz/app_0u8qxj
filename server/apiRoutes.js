const express = require('express');
const mongoose = require('mongoose');
const { mongoDb } = require('./db');

const router = express.Router();

// Define a schema for saving input values
const InputSchema = new mongoose.Schema({
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InputModel = mongoDb.model('Input', InputSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/save
router.post('/save', async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const newInput = new InputModel({ value });
    await newInput.save();

    res.status(201).json({ message: 'Value saved successfully', id: newInput._id });
  } catch (error) {
    console.error('Error saving value:', error);
    res.status(500).json({ error: 'Failed to save value' });
  }
});

// GET /api/getLatest
router.get('/getLatest', async (req, res) => {
  try {
    const latestInput = await InputModel.findOne().sort({ createdAt: -1 });
    if (latestInput) {
      res.status(200).json({ value: latestInput.value });
    } else {
      res.status(404).json({ error: 'No saved value found' });
    }
  } catch (error) {
    console.error('Error fetching latest value:', error);
    res.status(500).json({ error: 'Failed to fetch latest value' });
  }
});

module.exports = router;
