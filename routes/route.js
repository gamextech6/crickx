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
  getRankPrice,
  SendNotification,
  sendToAllUserNotification,
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
router.post("/savenumber", savePhoneNumber)
router.post("/getRankPrice", getRankPrice);
router.get("/getSendNotification", SendNotification);
router.post("/notifications/send-to-all", sendToAllUserNotification);
router.post("/notifications/:phoneNumber", sendToAllUserNotification);

// router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
// router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;