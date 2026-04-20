const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    player_name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
