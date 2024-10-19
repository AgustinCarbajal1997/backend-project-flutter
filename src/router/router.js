const express = require("express");
const controller = require("../controller/controller");
const router = express.Router();

router
  .get("/getAllUsers", controller.getAllUsers)
  .post("/createUser", controller.createUserData)
  .post("/createMessage", controller.createMessageData)
  .post("/createChatRoom", controller.createChatRoomData)
  .post("/getUserByEmail", controller.getUserByEmailService)
  .post("/sendPushNotification", controller.sendPushNotification)
  .post(
    "/sendMulticastPushNotification",
    controller.sendMulticastPushNotification
  );

module.exports = router;
