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
    player1: {
        pid: {
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
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
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
    },
    player11: {
        pid: {
            type: Number,
            required: true
        },
        fantasy_Point: Number,
        c: {
            type: Boolean,
            default: false
        },
        vc: {
            type: Boolean,
            default: false
        },
    },
},{
    timestamps: true,
}
);

const teamModel = mongoose.model('team', teamSchema);

module.exports = teamModel;