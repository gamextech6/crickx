const express = require("express");
const router = express.Router();
const multer = require('multer');

const { 
  updateUserProfile,
  getUserProfile,
  userAddPanAadhar,
  getUserByPhoneNumber,
  getUserReferralCode,
  registerWithReferral,
  transactions,
  dialCode,
  getAllPoolContest,
  getPoolContest,
  logOut,
  savePhoneNumber,
  team,
  updatePlayer,
  getRankPrice,
  SendNotification,
  getNotification,
  getNotificationCount,
  getNotificationByID, 
  getCreatedTeam
    } = require("../controller/controller");

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'pan', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
  ]);

router.put("/update-profile", updateUserProfile);
router.post("/uploadpanaadhar", upload, userAddPanAadhar);
router.post("/getprofile", getUserProfile);
router.post("/getuser", getUserByPhoneNumber)
router.post("/user-raferral", getUserReferralCode);
router.post("/registerwithreferral", registerWithReferral);
router.post("/transactions",transactions);
router.post("/dialCode",dialCode);
router.post("/getpool", getAllPoolContest);
router.post("/getpool-contest", getPoolContest);
router.post("/logout", logOut)
router.post("/savenumber", savePhoneNumber);
router.post("/team", team);
router.post("/updatePlayer", updatePlayer);
router.post("/getRankPrice", getRankPrice);
router.get("/getSendNotification", SendNotification);
router.post("/notifications/:phoneNumber", getNotification);
router.post("/getNotificationCount/:phoneNumber", getNotificationCount);
router.post("/getNotificationByID", getNotificationByID);
router.post("/getCreatedTeam", getCreatedTeam);

// router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
// router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;