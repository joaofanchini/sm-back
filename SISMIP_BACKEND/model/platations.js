const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { toArray: phaseEnum } = require('./../enums/phasesEnum');

const PlatationsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
  name: { type: String, required: true },
  area: { type: Number, required: true },
  location: {
    street: { type: String },
    number: { type: Number },
    neighborhood: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    geolocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }
    }
  },
  samplings: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId(),
        required: true
      },
      current_plantation_phase: {
        type: String,
        enum: phaseEnum(),
        required: true
      },
      plagues: [
        {
          plague_id: {
            type: Schema.Types.ObjectId,
            ref: 'Plagues',
            required: true
          },
          quantity: { type: Number, required: true },
          warning: { type: Boolean, required: true }
        }
      ],
      defoliated_plants: { type: String, required: true },
      datecreated: { type: Date, default: Date.now }
    }
  ],
  pesticides_applied: [
    {
      _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
      pesticide_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pesticides',
        required: true
      },
      volume_applied: { type: Number, required: true },
      datecreated: { type: Date, default: Date.now }
    }
  ],
  datecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plantations', PlatationsSchema);
1