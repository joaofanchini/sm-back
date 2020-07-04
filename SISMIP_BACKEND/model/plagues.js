const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { toArray: phasesEnum } = require('./../enums/phasesEnum');

const PlaguesSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { data: ArrayBuffer, type: String, required: false },
    na_phase_v: { type: Number, required: true },
    na_phase_r: { type: Number, required: true },
    initial_phase: {
        type: String,
        enum: phasesEnum(),
        required: true
    },
    end_phase: {
        type: String,
        enum: phasesEnum(),
        required: true
    },
    datecreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plagues', PlaguesSchema);