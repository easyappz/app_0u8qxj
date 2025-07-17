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

    res.status(201).json({ message: 'Value saved successfully' });
  } catch (error) {
    console.error('Error saving value:', error);
    res.status(500).json({ error: 'Failed to save value' });
  }
});

module.exports = router;
