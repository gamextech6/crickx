const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const AdminAgentModel = require("../models/adminAgentModel");
const UserTransactionsModel = require("../models/userTransactionsModel");
const PoolContestModel = require("../models/poolContestModel");
const RankPriceModel = require("../models/rankPricemodel");
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

    return res
      .status(200)
      .send({
        success: true,
        message: "all user",
        allUserCount: totalCount,
        allUser:totalUser,
        activeCount: activeCount,
        activeUser:activeUser
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
    const { match_id } = req.body;
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
