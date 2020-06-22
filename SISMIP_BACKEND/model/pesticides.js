const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PesticideSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  volum: { type: Number, required: true },
  price: { type: Number },
  datecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pesticides', PesticideSchema);
