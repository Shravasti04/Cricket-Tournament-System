const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    match_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    runs: {
        type: Number,
        required: true,
        min: 0
    },
    wickets: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    overs: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
