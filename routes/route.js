const express = require("express");
const router = express.Router();
const multer = require('multer');

const { 
  sendOTP,
  verifyOTP,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserProfile,
  getUserProfile,
  getUserBalance,
  userAddPanAadhar,
  getUserByPhoneNumber,
  getUserReferralCode,
  registerWithReferral,
  transactions,
  dialCode,
  getAllPoolContest,
  logOut,
  savePhoneNumber,
  getRankPrice
    } = require("../controller/controller");

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'pan', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
  ]);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/getalluser", getAllUsers);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.put("/update-profile", updateUserProfile);
router.post("/uploadpanaadhar", upload, userAddPanAadhar);
router.post("/getprofile", getUserProfile);
router.post("/getuser-balance", getUserBalance);
router.post("/getuser", getUserByPhoneNumber)
router.post("/user-raferral", getUserReferralCode);
router.post("/registerwithreferral", registerWithReferral);
router.post("/transactions",transactions);
router.post("/dialCode",dialCode);
router.post("/getpool-contest", getAllPoolContest);
router.post("/logout", logOut)
router.post("/savenumber", savePhoneNumber)
router.post("/getRankPrice", getRankPrice);

// router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
// router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;