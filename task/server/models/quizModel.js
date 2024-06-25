// quizSchema.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
  correctAnswer: { type: String, required: true }
});

const quizSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  questions: [questionSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);
