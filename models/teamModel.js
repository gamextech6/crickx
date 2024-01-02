const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    match_id: {
        type: Number,
        required: true,
    },
    total_fantasy_Point:{
        type: Number,
    },
    poolContestId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    player1: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
        vc: Boolean,
    },
    player2: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player3: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player4: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player5: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player6: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player7: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player8: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player9: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player10: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
    },
    player11: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
    },
    team: Number,
},{
    timestamps: true,
}
);

const teamModel = mongoose.model('team', teamSchema);

module.exports = teamModel;