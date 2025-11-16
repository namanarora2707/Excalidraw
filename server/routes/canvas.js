const express = require('express');
const Canvas = require('../models/Canvas');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all canvases for a user
// @route   GET /api/canvas
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const canvases = await Canvas.find({ createdBy: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(canvases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get a canvas by ID
// @route   GET /api/canvas/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const canvas = await Canvas.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    res.json(canvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new canvas
// @route   POST /api/canvas
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, elements, appState } = req.body;

  try {
    const canvas = new Canvas({
      name,
      elements: elements || [],
      appState: appState || {},
      createdBy: req.user._id,
    });

    const createdCanvas = await canvas.save();
    res.status(201).json(createdCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a canvas
// @route   PUT /api/canvas/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, elements, appState } = req.body;

  try {
    const canvas = await Canvas.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    canvas.name = name || canvas.name;
    canvas.elements = elements || canvas.elements;
    canvas.appState = appState || canvas.appState;

    const updatedCanvas = await canvas.save();
    res.json(updatedCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a canvas
// @route   DELETE /api/canvas/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const canvas = await Canvas.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }

    await canvas.remove();
    res.json({ message: 'Canvas removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;