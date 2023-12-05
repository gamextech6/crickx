const mongoose = require('mongoose');

const poolContestSchema = new mongoose.Schema({
    match_id: {
    type: Number,
    required: true,
    },
    price_pool_percent: {
    type: Number,
    },
    price_pool: {
        type: Number,
        required: true,
    },
    entry_fee: {
        type: Number,
        required: true,
    },
    totel_spots: {
        type: Number,
        require: true,
    },
    winning_spots: {
        type: Number,
        require: true,
    },
    left_spots: {
        type: Number
    },
    done_spots: {
        type: Number,
        default: 0,
    }  
});

const poolContestModel = mongoose.model('PoolContest', poolContestSchema);

module.exports = poolContestModel;