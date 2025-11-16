const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  strokeColor: String,
  fillColor: String,
  strokeWidth: Number,
  opacity: Number,
  roughness: Number,
  points: [{
    x: Number,
    y: Number
  }],
  text: String,
  fontSize: Number,
  fontFamily: String,
  textAlign: String,
  verticalAlign: String
}, { _id: false });

const canvasSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a canvas name'],
    trim: true,
    maxlength: [100, 'Canvas name cannot exceed 100 characters']
  },
  elements: [elementSchema],
  appState: {
    currentTool: String,
    strokeColor: String,
    fillColor: String,
    strokeWidth: Number,
    opacity: Number,
    zoom: Number,
    scrollX: Number,
    scrollY: Number,
    selectedElementIds: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
canvasSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Canvas', canvasSchema);