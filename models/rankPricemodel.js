const mongoose = require('mongoose');

const rankPriceSchema = new mongoose.Schema({
    contest_id: {
        type: String,
        required: true,
    },
    ranksAndPrices: {
        type: Map,
        of: Number,
        default: {},
    },
});

const RankPriceModel = mongoose.model('RankPrice', rankPriceSchema);

module.exports = RankPriceModel;
