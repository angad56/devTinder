const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const Allowed_Status = ["ignored", "interested"];

      if (!Allowed_Status.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type: " + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exists" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        res
          .status(404)
          .json({ message: "This User is not Present on the App" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const Allowed_Status = ["accepted", "rejected"];

      if (!Allowed_Status.includes(status)) {
        return res.status(400).json({ message: " Invalid Status " });
      }

      const connectionRequestData = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequestData) {
        return res
          .status(404)
          .json({ message: " Connection Request Not Found! " });
      }

      connectionRequestData.status = status;
      const data = await connectionRequestData.save();

      res.json({
        message: "Connection Request " + status + " Successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
