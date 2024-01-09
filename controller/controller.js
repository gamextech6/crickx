const UserModel = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const Notification = require('../models/notifications');
const AdminBankModel = require("../models/adminBankModel");
const UserTransactionsModel = require("../models/userTransactionsModel");
const PoolContestModel = require("../models/poolContestModel");
const DialCodeModel = require("../models/dialCodeModel");
const TeamModel = require("../models/teamModel");
const RankPriceModel = require("../models/rankPricemodel");
const axios = require('axios');
const requestIp = require("request-ip");
const twilio = require("twilio");
const AWS = require("aws-sdk");
const { ONE_SIGNAL_CONFIG } = require("../config/app.config");
const pushNotificationServices = require("../services/push_notification_service");
const teamModel = require("../models/teamModel");
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

exports.updateUserProfile = async (req, res) => {
  const { phoneNumber, firstName, lastName, gender, dob } = req.body;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update user profile information
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.dob = dob;

    // Save the updated user profile
    await user.save();
    return res.status(200).send({
      sucess: true,
      message: "User profile updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.userAddPanAadhar = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;

    const blockedUser = await UserModel.findOne({ phoneNumber, blocked: true });
    if (blockedUser) {
      return res
        .status(403)
        .send({
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
    return res.status(200).send({
      sucess: true,
      message: "User account Details submitted successfully.",
      data: user
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return user profile information
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dob: user.dob,
    };
    return res.status(200).send({
      sucess: true,
      message: "User profile got successfully",
      data: userProfile,
    });

    // res.send(userProfile);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).send({ error: "Internal server error" });
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
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserReferralCode = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  try {
    // Search for the user with the provided phone number
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return user profile information
    const userRefferal = {
      referrerCode: user.referrerCode,
    };
    return res.status(200).send({
      sucess: true,
      message: "User referral got successfully",
      data: userRefferal,
    });

    // res.send(userBalance);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).send({ error: "Internal server error" });
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
        return res.status(400).send({ message: "Referral code not found." });
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

      return res.status(200).send({super: true, message: "User registered with referral.", data:newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Registration failed." });
    }
  }
  res.send;
};

exports.transactions = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const transactionDetails = await UserTransactionsModel.find({ phoneNumber });
    res.status(200).send({ success: true, message: "All transaction of user ", data: transactionDetails });
  } catch (error) {
    console.error("Error In Fetching Account Detail :", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.dialCode = async (req, res) => {
  try {
    const dialCode = await DialCodeModel.find();
    return res.status(200).send({ success: true,message:"Dial code for all countery", data: dialCode });
  } catch (error) {
    console.error("Error In Fetching Account Detail :", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAllPoolContest = async (req, res) => {
  try {
    const { match_id } = req.body
    const pool = await PoolContestModel.find({ match_id });
    return res
      .status(200)
      .send({ success: true, message: "All Pool Contest of This match.", data: pool  });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}

exports.team = async (req, res) => {
  try {
    const { match_id, poolContestId, phoneNumber, playersID, playersName, playersSkill, playersPoint, c, vc } = req.body;

    // Check if the required properties are present and are arrays
    if (!Array.isArray(playersID) || !Array.isArray(playersName) || !Array.isArray(playersSkill) || !Array.isArray(playersPoint)) {
      return res.status(400).send({ error: "Invalid request body format" });
    }

    // Check if the arrays have the same length
    if (
      playersID.length !== playersName.length ||
      playersID.length !== playersSkill.length ||
      playersID.length !== playersPoint.length
    ) {
      return res.status(400).send({ error: "Arrays must have the same length" });
    }

    // Convert array data to the desired format
    const transformedData = playersID.reduce((acc, playerId, index) => {
      acc[`player${index + 1}`] = {
        pid: playerId,
        name: playersName[index],
        skill: playersSkill[index],
        point: playersPoint[index],
        fantasy_Point: 0,
        c: playerId === c, // Set c to true if playerId matches c
        vc: playerId === vc, // Set vc to true if playerId matches vc
      };
      return acc;
    }, { match_id, poolContestId, phoneNumber });

    // Create the new team object
    const newTeam = new TeamModel(transformedData);

    await newTeam.save();

    return res.status(200).send({
      success: true,
      data: newTeam,
      message: "New Team Created Successfully.",
    });
  } catch (error) {
    console.error("Error Creating Team:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};


exports.updatePlayer = async (req, res) => {
  try {
    const { _id, pid, fantasy_Point, c, vc} = req.body;

    // Find the team where the player with the specified pid exists
    const team = await TeamModel.findOne({ _id,
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
      return res.status(404).send({ error: 'Player not found in any team' });
    }

    ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9', 'player10', 'player11'].forEach(
      (playerField) => {
        const player = team[playerField];
        if (player && player.pid === pid) {
          player.fantasy_Point = fantasy_Point;
          player.c = c;
          player.vc = vc;
        }
      }
    );

    await team.save();

    res.send({ message: 'Player updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createOrUpdateTeam = async (req, res) => {
  try {
    const { match_id, contest_id, players } = req.body;

    // Validate if the required fields are present
    if (!match_id || !contest_id || !players || players.length !== 11) {
      return res.status(400).send({ error: 'Invalid request body' });
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
        return res.status(400).send({ error: `Invalid data for ${playerKey}` });
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

    res.send(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.logOut = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await UserModel({phoneNumber});
    user.isActive = false;
    user.save();
    return res.status(201).send({sucess: false, message: "User Blocked Successfully", data: user})
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }

};

exports.savePhoneNumber = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const user = await UserModel.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    const newUser = new UserModel({
      phoneNumber: phoneNumber,
      isActive: true,
    });
    newUser.save();
    res.status(200).send({ status:true, message:"Hi, Welcome to CrickX", data: newUser })
  } else if (user.blocked) {
    res.status(201).send({ status:false, message:"Hi, You are blocked.", data: user })
  }else{
    user.isActive = true;
    user.save();
    res.status(200).send({ status:true, message:"Hi, Welcome Back", data: user })
  }
};

exports.getRankPrice = async (req, res) => {
  try {
      const { contest_id } = req.body;
      const rankPrice = await RankPriceModel.findOne({ contest_id });

      return res.status(200).send({status: true, message: "The rank and price of this contest ",data : rankPrice});
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
}

exports.getPoolContest = async (req, res) => {
  try {
    const { contest_id } = req.body;
    const pool = await PoolContestModel.find({ _id: contest_id });
    return res
      .status(200)
      .send({
        success: true,
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.SendNotification = (req, res, next) => {
  var message = {
      app_id: ONE_SIGNAL_CONFIG.APP_ID,
      contents: { en: "Test Push Notification" },//message which will show on push notification
      included_segments: ["All"],
      content_available: true,
      small_icon: "ic_notification_icon",
      data: {
          PushTitle: "CUSTOM NOTIFICATION",
      },  
  };

  pushNotificationServices.SendNotification(message, (error, results) => {
      if(error) {
          return next(error);
      }
      return res.status(200).send({
          message: "Success",
          data: results,
      });
  });
};

exports.getNotification = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notifications = await Notification.find({ phoneNumber, seen: false });
  
    const filter = { phoneNumber, seen: false };
    const update = { $set: { seen: true } };
    const result = await Notification.updateMany(filter, update);
    res.status(200).send({success: true, message: 'Notifications seen successfully', notifications, result});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const count = await Notification.countDocuments({ phoneNumber, seen: false });
    res.status(200).send({success: true, count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getNotificationByID = async (req, res) => {
  try {
    const { _id } = req.body;
    const count = await Notification.findById({ _id });
    res.status(200).send({success: true, count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCreatedTeam = async (req, res) => {
  try {
    const { match_id, contest_id, phoneNumber } = req.body;
    const teams = await teamModel.find({ match_id: match_id, poolContestId: contest_id, phoneNumber: phoneNumber });
    if(!teams){
      return res.status(200).send({success:true,message:"You have not created any team", teams });
    }else{
      return res.status(200).send({success:true,message:"Your created teams", teams });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



