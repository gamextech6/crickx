const UserModel = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const AdminBankModel = require("../models/adminBankModel");
const UserTransactionsModel = require("../models/userTransactionsModel");
const PoolContestModel = require("../models/poolContestModel");
const DialCodeModel = require("../models/dialCodeModel");
const TeamModel = require("../models/teamModel")
const { createJwtToken } = require("../util/tokenUtil");
const requestIp = require("request-ip");
const twilio = require("twilio");
const AWS = require("aws-sdk");
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_Id,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const os = require("os").platform();

const generateReferrerCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-character code (you can adjust the length)
    code = Math.random().toString(36).slice(2, 8).toUpperCase();

    // Check if the code is unique
    const existingUser = await (UserModel.findOne({ referrerCode: code }) ||
      AdminModel.findOne({ referrerCode: code }));
    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
};

exports.sendOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(otp);

  const admin = await AdminModel.findOne({ phoneNumber: phoneNumber });
  if (admin) {
    return res.status(200).send({
      sucess: true,
      message: "You are Admin",
    });
  }

  const user = await UserModel.findOne({ phoneNumber: phoneNumber });
  // client.messages
  //   .create({
  //     body: `Your GameX OTP is ${otp}. Please do not share it with anyone. It is valid for 5 minutes.`,
  //     from: process.env.PHONE_NUMBER,
  //     to: phoneNumber,
  //   })
  //   .then((message) => console.log(message.sid));

  if (!user) {
    const newUser = new UserModel({
      phoneNumber: phoneNumber,
      otp: otp,
      referrerCode: generateReferrerCode()
    });
    newUser.save();
    // res.json.status(false)({message: "User Not Found. Please resister first."});
  } else {
    user.otp = otp;
    user
      .save()
      .then((savedOTP) => {
        console.log("OTP saved:", savedOTP);
      })
      .catch((error) => {
        console.error("Error saving OTP:", error);
      });
  }
  res.status(200).send({
    sucess: true,
    message: "OTP sent successfully",
  });
};

exports.verifyOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const userEnteredOTP = req.body.otp;

  const otpDocument = await UserModel.findOne({ phoneNumber: phoneNumber });

  if (otpDocument) {
    const storedOTP = otpDocument.otp;

    if (userEnteredOTP === storedOTP) {
      const token = createJwtToken({ phoneNumber: otpDocument.phoneNumber });
      console.log(token);
      res.status(200).send({
        sucess: true,
        message: "Verified successfully",
      });
      otpDocument.otp = "";
      otpDocument.save();
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } else {
    res.json({ message: "No OTP found" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const allUsers = await UserModel.find();

    // Return the user data as JSON
    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { phoneNumber, blocked } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: true } },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ success: true, blocked: user, message: "User Blocked Successfully" });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { phoneNumber, blocked } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: false } },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ success: true, unblockedUser: user, message: "User Unblocked Successfully" });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const { firstName, lastName, gender, dob } = req.body;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile information
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.dob = dob;

    // Save the updated user profile
    await user.save();
    res.status(200).send({
      sucess: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userAddPanAadhar = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;

    const blockedUser = await UserModel.findOne({ phoneNumber, blocked: true });
    if (blockedUser) {
      return res
        .status(403)
        .json({
          error:
            "User is blocked. Cannot able to upload bank details. Please connect to support team.",
        });
    }

    const panName = `pans/${phoneNumber}`;
    const aadharName = `aadhars/${phoneNumber}`;
    const panParams = {
      Bucket: process.env.PAN_BUCKET,
      Key: panName,
      Body: req.files["aadhar"][0].buffer,
    };
    const s3UploadPanResponse = await s3.upload(panParams).promise();

    const aadharParams = {
      Bucket: process.env.AADHAR_BUCKET,
      Key: aadharName,
      Body: req.files["pan"][0].buffer,
    };
    const s3UploadAadharResponse = await s3.upload(aadharParams).promise();

    user.pan = s3UploadPanResponse.Location;
    user.aadhar = s3UploadAadharResponse.Location;
    // Save user to the database
    await user.save();
    res.status(200).send({
      sucess: true,
      message: "User account Details submitted successfully.",
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile information
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob,
    };
    res.status(200).send({
      sucess: true,
      message: "User profile got successfully",
      userProfile,
    });

    // res.json(userProfile);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserBalance = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile information
    const userBalance = {
      balance: user.balance,
    };

    res.status(200).send({
      sucess: true,
      message: "User ballance got successfully",
      userBalance,
    });

    // res.json(userBalance);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Use a regular expression for a case-insensitive search

    // Search for users with a matching username
    const user = await UserModel.find({ phoneNumber });
    res.status(200).send({
      sucess: true,
      message: "User ballance got successfully",
      data: user,
    });
    // res.json({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserReferralCode = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile information
    const userRefferal = {
      referrerCode: user.referrerCode,
    };
    res.status(200).send({
      sucess: true,
      message: "User referral got successfully",
      userRefferal,
    });

    // res.json(userBalance);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.registerWithReferral = async (req, res) => {
  const { phoneNumber, referralCode } = req.body;
  //Check that is user alrady exist of not
  const user = await UserModel.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    try {
      // Check if the referral code exists in the database
      const referrer = await UserModel.findOne({ referrerCode: referralCode });
      if (!referrer) {
        return res.status(400).json({ message: "Referral code not found." });
      }

      const newUser = new UserModel({
        otp: otp,
        phoneNumber: phoneNumber,
        point: 100,
        ip: clientIp,
        os: os,
        referredCode: referrerCode, // Store the referrer's code
      });

      // Save the new user
      await newUser.save();

      res.json({ message: "User registered with referral." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed." });
    }
  }
  res.json;
};

exports.transactions = async (req, res) => {
  try {
    const { userName } = req.body;
    const transactionDetails = await UserTransactionsModel.find({ userName });
    res.status(200).json({ success: true, data: transactionDetails });
  } catch (error) {
    console.error("Error In Fetching Account Detail :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.dialCode = async (req, res) => {
  try {
    const dialCode = await DialCodeModel.find();
    res.status(200).json({ success: true, data: dialCode });
  } catch (error) {
    console.error("Error In Fetching Account Detail :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllPoolContest = async (req, res) => {
  try {
    const { match_id } = req.body
    const pool = await PoolContestModel.find({ match_id });
    return res
      .status(200)
      .json({ success: true, Pool: pool ,message: "All Pool Contest of This match." });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.team = async (req, res) => {
  try {
    const { match_id,pid, entry_fee, total_spots, winning_spots_precent } = req.body;
    const price_pool = total_spots*entry_fee*price_pool_percent/100;
    const winning_spots = total_spots*winning_spots_precent/100
    const newPool = new TeamModel({ 
      match_id, 
      price_pool_percent, 
      "player1.pid" : pid,
      entry_fee, 
      total_spots, 
      winning_spots_precent,
      winning_spots,
     });
    await newPool.save();
    return res
      .status(200)
      .json({ success: true, newPool: newPool ,message: "Pool Contest Created Successfully." });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.updatePlayer = async (req, res) => {
  try {
    const { pid, fantasy_Point, c } = req.body;

    // Find the team where the player with the specified pid exists
    const team = await TeamModel.findOne({
      $or: [
        { 'player1.pid': pid },
        { 'player2.pid': pid },
        { 'player3.pid': pid },
        { 'player4.pid': pid },
        { 'player5.pid': pid },
        { 'player6.pid': pid },
        { 'player7.pid': pid },
        { 'player8.pid': pid },
        { 'player9.pid': pid },
        { 'player10.pid': pid },
        { 'player11.pid': pid },
      ],
    });

    if (!team) {
      return res.status(404).json({ error: 'Player not found in any team' });
    }

    ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9', 'player10', 'player11'].forEach(
      (playerField) => {
        const player = team[playerField];
        if (player && player.pid === pid) {
          player.fantasy_Point = fantasy_Point;
          player.c = c;
        }
      }
    );

    await team.save();

    res.json({ message: 'Player updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createOrUpdateTeam = async (req, res) => {
  try {
    const { match_id, contest_id, players } = req.body;

    // Validate if the required fields are present
    if (!match_id || !contest_id || !players || players.length !== 11) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Construct the team object based on the provided player data
    const teamData = {
      match_id,
      contest_id,
    };

    for (let i = 1; i <= 11; i++) {
      const playerKey = `player${i}`;
      const playerInfo = players[i - 1];

      // Validate if the required fields are present for each player
      if (!playerInfo || !playerInfo.pid || !playerInfo.fantasy_Point) {
        return res.status(400).json({ error: `Invalid data for ${playerKey}` });
      }

      teamData[playerKey] = {
        pid: playerInfo.pid,
        fantasy_Point: playerInfo.fantasy_Point,
        c: Boolean(playerInfo.c),
      };
    }

    // Find and update the team if it already exists, otherwise create a new team
    const filter = { match_id, contest_id };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const updatedTeam = await TeamModel.findOneAndUpdate(filter, teamData, options);

    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

