const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const Match = require('../models/Match');
const Score = require('../models/Score');
const Tournament = require('../models/Tournament');

// --- POST APIs ---

// Add a new tournament
router.post('/addTournament', async (req, res) => {
    try {
        const { tournament_name, start_date, end_date, organizer } = req.body;
        const newTournament = new Tournament({ tournament_name, start_date, end_date, organizer });
        await newTournament.save();
        res.status(201).json({ message: 'Tournament added successfully', tournament: newTournament });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new team
router.post('/addTeam', async (req, res) => {
    try {
        const { team_name, coach, tournament_id } = req.body;
        const newTeam = new Team({ team_name, coach, tournament_id });
        await newTeam.save();
        res.status(201).json({ message: 'Team added successfully', team: newTeam });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new player
router.post('/addPlayer', async (req, res) => {
    try {
        const { player_name, age, role, team_id } = req.body;
        const newPlayer = new Player({ player_name, age, role, team_id });
        await newPlayer.save();
        res.status(201).json({ message: 'Player added successfully', player: newPlayer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Schedule a match
router.post('/addMatch', async (req, res) => {
    try {
        const { tournament_id, team1_id, team2_id, date, venue } = req.body;
        const newMatch = new Match({ tournament_id, team1_id, team2_id, date, venue });
        await newMatch.save();
        res.status(201).json({ message: 'Match scheduled successfully', match: newMatch });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a score
router.post('/addScore', async (req, res) => {
    try {
        const { match_id, team_id, runs, wickets, overs } = req.body;
        const newScore = new Score({ match_id, team_id, runs, wickets, overs });
        await newScore.save();
        res.status(201).json({ message: 'Score added successfully', score: newScore });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET APIs ---

// Get all tournaments
router.get('/tournaments', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all teams (or filter by tournament_id)
router.get('/teams', async (req, res) => {
    try {
        const { tournament_id } = req.query;
        let query = {};
        if (tournament_id) {
            query.tournament_id = tournament_id;
        }
        const teams = await Team.find(query);
        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all players with team details (or filter by tournament_id)
router.get('/players', async (req, res) => {
    try {
        const { tournament_id } = req.query;
        let query = {};
        if (tournament_id) {
            const teams = await Team.find({ tournament_id });
            const teamIds = teams.map(t => t._id);
            query = { team_id: { $in: teamIds } };
        }
        const players = await Player.find(query).populate('team_id', 'team_name');
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all matches with team details (or filter by tournament_id)
router.get('/matches', async (req, res) => {
    try {
        const { tournament_id } = req.query;
        let query = {};
        if (tournament_id) {
            query.tournament_id = tournament_id;
        }
        const matches = await Match.find(query)
            .populate('tournament_id', 'tournament_name')
            .populate('team1_id', 'team_name')
            .populate('team2_id', 'team_name')
            .sort({ date: 1 });
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all scores with match and team details
router.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find()
            .populate({
                path: 'match_id',
                populate: { path: 'tournament_id team1_id team2_id', select: 'tournament_name team_name' }
            })
            .populate('team_id', 'team_name');
        res.status(200).json(scores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get Points Table (Advanced Aggregation)
router.get('/points-table', async (req, res) => {
    try {
        const { tournament_id } = req.query;
        const mongoose = require('mongoose');
        
        const pipeline = [];
        let matchPipelineStage = {
            $match: {
                $expr: {
                    $or: [
                        { $eq: ["$team1_id", "$$teamId"] },
                        { $eq: ["$team2_id", "$$teamId"] }
                    ]
                }
            }
        };

        if (tournament_id) {
            const matches = await Match.find({ tournament_id });
            const teamIds = new Set();
            matches.forEach(m => {
                teamIds.add(m.team1_id.toString());
                teamIds.add(m.team2_id.toString());
            });
            pipeline.push({
                $match: {
                    _id: { $in: Array.from(teamIds).map(id => new mongoose.Types.ObjectId(id)) }
                }
            });

            matchPipelineStage.$match.tournament_id = new mongoose.Types.ObjectId(tournament_id);
        }

        pipeline.push(
            {
                $lookup: {
                    from: "matches",
                    let: { teamId: "$_id" },
                    pipeline: [
                        matchPipelineStage,
                        {
                            $lookup: {
                                from: "scores",
                                localField: "_id",
                                foreignField: "match_id",
                                as: "match_scores"
                            }
                        },
                        {
                            $match: {
                                "match_scores.1": { $exists: true } // Only matches with both scores
                            }
                        },
                        {
                            $addFields: {
                                my_score: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$match_scores",
                                                as: "score",
                                                cond: { $eq: ["$$score.team_id", "$$teamId"] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                opponent_score: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$match_scores",
                                                as: "score",
                                                cond: { $ne: ["$$score.team_id", "$$teamId"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        },
                        {
                            $addFields: {
                                is_win: { $cond: [{ $gt: ["$my_score.runs", "$opponent_score.runs"] }, 1, 0] },
                                is_loss: { $cond: [{ $lt: ["$my_score.runs", "$opponent_score.runs"] }, 1, 0] }
                            }
                        }
                    ],
                    as: "team_matches"
                }
            },
            {
                $project: {
                    team_name: 1,
                    matchesPlayed: { $size: "$team_matches" },
                    wins: { $sum: "$team_matches.is_win" },
                    losses: { $sum: "$team_matches.is_loss" }
                }
            },
            {
                $addFields: {
                    points: { $multiply: ["$wins", 2] }
                }
            },
            {
                $sort: { points: -1, wins: -1, team_name: 1 }
            }
        );
        
        const pointsTable = await Team.aggregate(pipeline);
        res.status(200).json(pointsTable);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Grouped Matches by Tournament
router.get('/matches-grouped', async (req, res) => {
    try {
        const groupedMatches = await Tournament.aggregate([
            {
                $lookup: {
                    from: "matches",
                    localField: "_id",
                    foreignField: "tournament_id",
                    as: "matches"
                }
            },
            {
                $unwind: { path: "$matches", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "matches.team1_id",
                    foreignField: "_id",
                    as: "matches.team1"
                }
            },
            {
                $lookup: {
                    from: "teams",
                    localField: "matches.team2_id",
                    foreignField: "_id",
                    as: "matches.team2"
                }
            },
            {
                $unwind: { path: "$matches.team1", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: "$matches.team2", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "scores",
                    localField: "matches._id",
                    foreignField: "match_id",
                    as: "matches.scores"
                }
            },
            {
                $addFields: {
                    "matches.team1_score": {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$matches.scores",
                                    as: "score",
                                    cond: { $eq: ["$$score.team_id", "$matches.team1_id"] }
                                }
                            },
                            0
                        ]
                    },
                    "matches.team2_score": {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$matches.scores",
                                    as: "score",
                                    cond: { $eq: ["$$score.team_id", "$matches.team2_id"] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $addFields: {
                    "matches.winner_id": {
                        $cond: {
                            if: { $and: [{ $ne: ["$matches.team1_score", null] }, { $ne: ["$matches.team2_score", null] }, { $gt: ["$matches.team1_score.runs", "$matches.team2_score.runs"] }] },
                            then: "$matches.team1_id",
                            else: {
                                $cond: {
                                    if: { $and: [{ $ne: ["$matches.team1_score", null] }, { $ne: ["$matches.team2_score", null] }, { $lt: ["$matches.team1_score.runs", "$matches.team2_score.runs"] }] },
                                    then: "$matches.team2_id",
                                    else: null
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    tournament_name: { $first: "$tournament_name" },
                    start_date: { $first: "$start_date" },
                    end_date: { $first: "$end_date" },
                    organizer: { $first: "$organizer" },
                    matches: {
                        $push: {
                            $cond: [
                                { $ifNull: ["$matches._id", false] },
                                {
                                    _id: "$matches._id",
                                    date: "$matches.date",
                                    venue: "$matches.venue",
                                    team1: "$matches.team1",
                                    team2: "$matches.team2",
                                    team1_score: "$matches.team1_score",
                                    team2_score: "$matches.team2_score",
                                    winner_id: "$matches.winner_id"
                                },
                                null
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    matches: {
                        $filter: {
                            input: "$matches",
                            as: "match",
                            cond: { $ne: ["$$match", null] }
                        }
                    }
                }
            },
            {
                $sort: { start_date: -1 }
            }
        ]);
        res.status(200).json(groupedMatches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
