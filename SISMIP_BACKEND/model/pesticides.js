const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PesticideSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price_per_volume: { type: Number, required: true },
  datecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pesticides', PesticideSchema);
