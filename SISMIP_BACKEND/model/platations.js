const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatationsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
  name: { type: String, required: true },
  area: { type: Number, required: true },
  localtion: {
    street: { type: String },
    number: { type: Number },
    neighborhood: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    geolocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }
    }
  },
  sampling_control: [
    {
      sampling: [
        {
          plagues: [
            {
              bug_id: {
                type: Schema.Types.ObjectId,
                ref: 'Plagues',
                required: true
              },
              quantity: { type: Number, required: true },
              datecreated: { type: Date, default: Date.now }
            }
          ],
          pesticides_applied: [
            {
              pesticide_id: {
                type: Schema.Types.ObjectId,
                ref: 'Pesticides',
                required: true
              },
              volume_applied: { type: Number, required: true }
            }
          ],
          datecreated: { type: Date, default: Date.now }
        }
      ],
      datecreated: { type: Date, default: Date.now }
    }
  ],
  datecreated: { type: Date, default: Date.now }
});
