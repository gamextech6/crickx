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
    player2: {
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
    player3: {
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
    player4: {
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
    player5: {
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
    player6: {
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
    player7: {
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
    player8: {
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
    player9: {
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