const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BugSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { data: Buffer, required: false },
  na_fase_v: { type: Number, required: true },
  na_fase_r: { type: Number, required: true },
  initial_fase: {
    type: String,
    enum: [
      'VE',
      'V0',
      'V1',
      'V2',
      'V3',
      'V4',
      'V5',
      'V6',
      'V7',
      'V8',
      'V9',
      'V10',
      'R0',
      'R1',
      'R2',
      'R3',
      'R4',
      'R5',
      'R6',
      'R7',
      'R8',
      'R9',
      'R10',
      'C'
    ],
    required: true
  },
  end_fase: {
    type: String,
    enum: [
      'VE',
      'V0',
      'V1',
      'V2',
      'V3',
      'V4',
      'V5',
      'V6',
      'V7',
      'V8',
      'V9',
      'V10',
      'R0',
      'R1',
      'R2',
      'R3',
      'R4',
      'R5',
      'R6',
      'R7',
      'R8',
      'R9',
      'R10',
      'C'
    ],
    required: true
  },
  datecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bugs', BugSchema);
