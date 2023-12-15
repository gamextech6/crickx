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
    getUserByPhoneNumber, 
    blockUser,
    unblockUser,
    getAdminAgentCount,
    poolContest,
    getAllPoolContest,
    deletePoolContest,
    editPoolContest,
    addOrUpdateRankPrice,
} = require("../controller/adminController");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/admin-login", adminLogin);
router.post("/admin-agent", createAdminAgent);
router.post("/getall-admin-agent", getAllAdminAgents);
router.post("/getadmin-agent", getAdminAgentDetails);
router.put("/admin-agent/block", blockAdminAgent);
router.put("/admin-agent/unblock", unblockAdminAgent);
router.post("/gettotal-admin-agent", getAdminAgentCount);
router.post("/gettotal-user", getUserCount);
router.post("/getuser/:phoneNumber", getUserByPhoneNumber);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.post("/pool-contest", poolContest);
router.post("/getpool-contest/:match_id", getAllPoolContest);
router.post("/delete-pool-contest", deletePoolContest);
router.post("/edit-pool-contest", editPoolContest);
router.post("/pricerank", addOrUpdateRankPrice);

module.exports = router;