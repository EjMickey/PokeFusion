const mongoose = require('mongoose');

const fusionSchema = new mongoose.Schema({
  pokemon1: Number,
  pokemon2: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Fusion', fusionSchema);
