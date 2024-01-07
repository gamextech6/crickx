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
    phoneNumber: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
    },
    prize:{
        type: Number,
    },
    player1: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player2: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player3: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player4: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player5: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player6: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player7: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player8: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player9: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player10: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
    player11: {
        pid: {
            type: String,
            required: true
        },
        point: String,
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
        name: String,
        skill: String,
    },
},{
    timestamps: true,
}
);

const teamModel = mongoose.model('team', teamSchema);

module.exports = teamModel;