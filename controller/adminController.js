const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const AdminAgentModel = require("../models/adminAgentModel");
const UserTransactionsModel = require("../models/userTransactionsModel");
const PoolContestModel = require("../models/poolContestModel");
const RankPriceModel = require("../models/rankPricemodel");
const Notification = require("../models/notifications");
const TeamModel = require("../models/teamModel")
const axios = require('axios');
const AWS = require("aws-sdk");
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();
const AdminBankModel = require("../models/adminBankModel");
const requestIp = require("request-ip");
const twilio = require("twilio");
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

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await AdminModel.findOne({ username, password });

    if (!admin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    return res.status(200).send({
      sucess: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await UserModel.find({ phoneNumber });
    if(!user){
      res.status(201).send({
        sucess: false,
        message: "User Not Found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "User get successfully",
      data: user,
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: true , isActive:false} },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    const user1 = await UserModel.find({ phoneNumber: phoneNumber })

    return res.status(200).send({ success: true, message: "User Blocked Successfully",  data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { blocked: false } },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    const user1 = await UserModel.find({ phoneNumber: phoneNumber })

    return  res.status(200).send({ success: true, message: "User Unblocked Successfully", data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.createAdminAgent = async (req, res) => {
  try {
    await AdminAgentModel.deleteMany({ userName: null });
    const { userName, firstName, lastName, phoneNo, password } = req.body;

    // await AdminAgentModel.deleteMany({ userName: null });
    // Check if the username is already taken
    const existingUser = await AdminAgentModel.findOne({ userName });

    if (existingUser) {
      return res.status(400).send({ error: "Username is already taken." });
    }

    // Create a new admin agent
    const newAdminAgent = new AdminAgentModel({
      userName,
      firstName,
      lastName,
      phoneNo,
      password,
    });

    // Save to the database
    await newAdminAgent.save();

    return res
      .status(200)
      .send({
        success: true,
        message: "Admin agent created successfully.",
        data: newAdminAgent,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAllAdminAgents = async (req, res) => {
  try {
    // Find all admin agents
    const adminAgents = await AdminAgentModel.find();

    res
      .status(200)
      .send({ success: true, message: "All Admin agent", data: adminAgents });
  } catch (error) {
    console.error("Error getting all admin agents:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAdminAgentDetails = async (req, res) => {
  try {
    const { userName } = req.body;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({ userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).send({ error: "Admin agent not found." });
    }

    // Return the admin agent details
    res.status(200).send({
      sucess: true,
      message: "Agent got successfully",
      data: adminAgent,
    });
  } catch (error) {
    console.error("Error getting admin agent details:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.blockAdminAgent = async (req, res) => {
  try {
    const { userName } = req.body;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({ userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).send({ error: "Admin agent not found." });
    }

    // Update the admin agent's status to blocked
    adminAgent.blocked = true;

    // Save the updated admin agent to the database
    await adminAgent.save();

    res
      .status(200)
      .send({
        success: true,
        message: "Admin agent blocked successfully.",
        data: adminAgent,
      });
  } catch (error) {
    console.error("Error blocking admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.unblockAdminAgent = async (req, res) => {
  try {
    const { userName } = req.body;

    // Find the admin agent by username
    const adminAgent = await AdminAgentModel.findOne({ userName });

    // Check if the admin agent exists
    if (!adminAgent) {
      return res.status(404).send({ error: "Admin agent not found." });
    }

    // Update the admin agent's status to unblocked
    adminAgent.blocked = false;

    // Save the updated admin agent to the database
    await adminAgent.save();

    res
      .status(200)
      .send({
        success: true,
        message: "Admin agent unblocked successfully.",
        data: adminAgent,
      });
  } catch (error) {
    console.error("Error unblocking admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.deleteAdminAgent = async (req, res) => {
  try {
    const { userName } = req.body;
    await AdminAgentModel.findOneAndRemove({ userName });
    res.status(200).send({
      success: true,
      message: "Admin Agent Deleted Successfully.",
    });
  } catch (error) {
    console.error("Error blocking agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const totalCount = await UserModel.countDocuments();
    const totalUser = await UserModel.find();
    const activeCount = await UserModel.countDocuments({ isActive: true });
    const activeUser = await UserModel.find({ isActive: true });
    const blockedCount = await UserModel.countDocuments({ blocked: true });
    const blockedUser = await UserModel.find({ blocked: true });

    return res
      .status(200)
      .send({
        success: true,
        message: "all user",
        allUserCount: totalCount,
        allUser:totalUser,
        activeCount: activeCount,
        activeUser:activeUser,
        blockedCount: blockedCount,
        blockedUser: blockedUser
      });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAdminAgentCount = async (req, res) => {
  try {
    const totalCount = await AdminAgentModel.countDocuments();
    res.status(200).send({
      sucess: true,
      message: "Today Admin Agent Count",
      data: totalCount,
    });
    // res.status(200).send({ success: true, totalCount });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.poolContest = async (req, res) => {
  try {
    const {
      match_id,
      price_pool_percent,
      entry_fee,
      total_spots,
      winning_spots_precent,
    } = req.body;
    const price_pool = (total_spots * entry_fee * price_pool_percent) / 100;
    const winning_spots = (total_spots * winning_spots_precent) / 100;
    const newPool = new PoolContestModel({
      match_id,
      price_pool_percent,
      price_pool,
      entry_fee,
      total_spots,
      winning_spots_precent,
      winning_spots,
    });
    await newPool.save();
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Created Successfully.",
        data: newPool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getAllPoolContest = async (req, res) => {
  try {
    const { match_id } = req.params;
    const pool = await PoolContestModel.find({ match_id });
    return res
      .status(200)
      .send({
        success: true,
        message: "All Pool Contest of This match.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

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

exports.deletePoolContest = async (req, res) => {
  try {
    const { _id } = req.body;
    const pool = await PoolContestModel.findByIdAndDelete({ _id });
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Deleted Successfully.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.editPoolContest = async (req, res) => {
  try {
    const {
      _id,
      price_pool_percent,
      entry_fee,
      total_spots,
      winning_spots_precent,
    } = req.body;
    const price_pool = (total_spots * entry_fee * price_pool_percent) / 100;
    const winning_spots = (total_spots * winning_spots_precent) / 100;
    const pool = await PoolContestModel.findByIdAndUpdate(
      _id,
      {
        price_pool_percent,
        price_pool,
        entry_fee,
        total_spots,
        winning_spots_precent,
        winning_spots,
      },
      { new: true }
    );
    if (!pool) {
      return res.status(404).send({ error: "Pool not found" });
    }
    return res
      .status(200)
      .send({
        success: true,
        message: "Pool Contest Deleted Successfully.",
        data: pool,
      });
  } catch (error) {
    console.error("Error creating admin agent:", error);
    res.status(500).send({ status: false, error: "Internal server error" });
  }
};

exports.addOrUpdateRankPrice = async (req, res) => {
  try {
    const { contest_id, rank, price } = req.body;

    if (!contest_id || !rank || !price) {
      return res.status(400).send({ error: "Invalid request body" });
    }
    const filter = { contest_id };
    const update = { $set: { [`ranksAndPrices.${rank}`]: price } };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const updatedRankPrice = await RankPriceModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.send(updatedRankPrice);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


exports.sendToAllUserNotification = async (req, res) => {
  try {
     const { title, message } = req.body;

  //   // Find all users
    const users = await UserModel.find();

    const notifications = await Notification.create(
      users.map(user => ({ phoneNumber: user.phoneNumber,title, message }))
    );

  // await notifications.save();

    // Send notifications to each user
    // for (const user of users) {
    //   // Find the latest notification for this user
    //   const latestNotification = await Notification.findOne({
    //     phoneNumber: user.phoneNumber,
    //   }).sort({ createdAt: -1 });

    //   // Create a new notification only if there are no previous notifications or the latest one is seen
    //   if (!latestNotification || latestNotification.seen) {
    //     const newNotification = new Notification({
    //       phoneNumber: user.phoneNumber,
    //       message,
    //       seen: false,
    //     });
    //     await newNotification.save();
    //   }
    // }

    // for (const user of users) {
    //   const notification = new Notification({ phoneNumber: user.phoneNumber, message });
    //   await notification.save();
    // }

    res.status(200).send({ success: true, message: 'Notifications sent successfully', notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.postNotification = async (req, res) => {
  try {
    const { phoneNumber,title, message } = req.body;
    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notification = await Notification.create({ phoneNumber,title, message });
    res.status(200).send({success: true, message: 'Notifications sent successfully', notification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchNotificationByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const seenedNotifications = await Notification.find({ phoneNumber, seen: true });
    const unSeenedNotifications = await Notification.find({ phoneNumber, seen: false });
    res.status(200).send({success: true, message: 'Users Notifications', seenedNotifications, unSeenedNotifications});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationByID = async (req, res) => {
  try {
    const { _id } = req.body;
    const deleteNotification = await Notification.findByIdAndDelete({ _id });
    res.status(200).send({success: true, message: 'Notifications Deleted successfully', deleteNotification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.showNotificationMessage = async (req, res) => {
  try {
    const uniqueMessages = await Notification.distinct('message');
    res.status(200).json({ success: true, message: 'Unique Notification Messages Fetched Successfully', uniqueMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationsByMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const result = await Notification.deleteMany({ message });

    res.status(200).json({
      success: true,
      message: `Notifications with message type '${message}' deleted successfully`,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.seduleMatchData = async (req, res) => {
  try {
    const apiUrl = 'https://rest.entitysport.com/v2/matches/?status=1&token=444b8b1e48d9cd803ea3820c5c17ecc4';
    // Make a request to the external API
    const externalApiResponse = await axios.get(apiUrl);
    // const flattenedResponse = flatted.stringify(externalApiResponse.data);
    // Send the response back to the client
    res.send(externalApiResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFantasyPoints = async (req, res) => {
  try {
    const {match_id} = req.body;
    // Fetch data from the external API
    const apiURL = 'https://rest.entitysport.com/v2/matches/${match_id}/newpoint2?token=ec471071441bb2ac538a0ff901abd249';
    const apiResponse = await axios.get(apiURL);

    const allTeams = await TeamModel.find({ match_id });
    console.log(allTeams);

    // Extract relevant data from the API response
    const timestampEnd = apiResponse.response.timestamp_end;
    const playersFantasyPointsTeama = apiResponse.response.points.teama.playing11;
    const playersFantasyPointsTeamb =  apiResponse.response.points.teamb.playing11; // Assuming this is an array of player objects

    
    // Calculate total fantasy points
    const totalFantasyPoints = playersFantasyPoints.reduce((total, player) => {
      return total + player.fantasy_point;
    }, 0);

    // Wait until the timestamp_end is reached
    const currentTime = new Date().getTime() / 1000; // Convert to seconds
    const delayInSeconds = Math.max(timestampEnd - currentTime, 0);
    await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));

    // Update fantasy points in TeamModel based on player PIDs
    const team = await TeamModel.find({ match_id });

    if (!team) {
      console.log('Team not found');
      return;
    }

    for(let i=0; i<team.length; i++){
      ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9', 'player10', 'player11'].forEach(
        (playerField) => {
          const player = team[playerField];
          if (player) {
            const matchingPlayer = playersFantasyPoints.find(apiPlayer => apiPlayer.pid === player.pid);
            if (matchingPlayer) {
              player.fantasy_Point = matchingPlayer.fantasy_point;
              // Optionally, update other fields like 'c' if needed
            }
          }
        }
      );
    }

    await team.save();
    console.log('Fantasy points updated successfully');
  } catch (error) {
    console.error('Error updating fantasy points:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
