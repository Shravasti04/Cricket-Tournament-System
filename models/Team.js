const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: true,
        trim: true
    },
    coach: {
        type: String,
        required: true,
        trim: true
    },
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
