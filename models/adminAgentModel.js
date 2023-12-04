const mongoose = require('mongoose');

const adminAgentSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNo: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
});

const AdminAgentModel = mongoose.model('AdminAgent', adminAgentSchema);

module.exports = AdminAgentModel;
