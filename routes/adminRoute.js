const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    adminLogin,
    createAdminAgent, 
    getAdminAgentDetails, 
    blockAdminAgent, 
    unblockAdminAgent, 
    getAllAdminAgents, 
    getUserCount, 
    getAdminAgentCount,
    poolContest,
} = require("../controller/adminController");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/admin-login", adminLogin);
router.post("/admin-agent", createAdminAgent);
router.post("/getall-admin-agent", getAllAdminAgents);
router.post("/getadmin-agent/:userName", getAdminAgentDetails);
router.put("/admin-agent/block/:userName", blockAdminAgent);
router.put("/admin-agent/unblock/:userName", unblockAdminAgent);
router.post("/gettotal-user", getUserCount);
router.post("/gettotal-admin-agent", getAdminAgentCount);
router.post("/pool-contest", poolContest)

module.exports = router;