const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    match_id: {
        type: Number,
        required: true,
    },
    contest_id:{
        type: String,
        required: true,
    },
    total_fantasy_Point:{
        type: Number,
    },
    player1: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: Boolean,
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