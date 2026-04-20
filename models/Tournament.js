const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    tournament_name: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
