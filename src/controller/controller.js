const service = require("../service/service");
const errorHandle = require("../utils/errorHandler");

const sendPushNotification = async (req, res) => {
  const { title, body, data, token } = req.body;

  try {
    const response = await service.sendPushNotificationService(
      title,
      body,
      data,
      token
    );
    return res.status(200).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const sendMulticastPushNotification = async (req, res) => {
  const { title, body, data, tokens } = req.body;

  try {
    const response = await service.sendMulticastPushNotificationService(
      title,
      body,
      data,
      tokens
    );
    return res.status(200).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await service.getAllUsersService();
    return res.status(200).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const createUserData = async (req, res) => {
  try {
    const response = await service.createUserService(req.body);
    return res.status(201).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const createMessageData = async (req, res) => {
  try {
    const response = await service.createMessageService(req.body);
    return res.status(201).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const createChatRoomData = async (req, res) => {
  try {
    const response = await service.createChatRoomService(req.body);
    return res.status(201).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

const getUserByEmailService = async (req, res) => {
  try {
    const response = await service.getUserByEmailService(req.body.email);
    return res.status(201).json(response);
  } catch (error) {
    errorHandle(res, error);
  }
};

//const sendToTopicPushNotification = async () => {
//  await firebaseAdmin.messaging().sendToTopic("mantenimiento", {
//    notification: {
//      title: "Alerta de mantenimiento 🚨",
//      body: "Entre las 11hs y 12hs vamos a estar realizando tareas de mantenimiento 🔧",
//    },
//    data: {
//      click_action: "ALERT_MODAL",
//      tab: "/home",
//    },
//  });
//};
//
const controller = {
  sendPushNotification,
  sendMulticastPushNotification,
  getAllUsers,
  createUserData,
  createMessageData,
  createChatRoomData,
  getUserByEmailService,
  //sendToTopicPushNotification,
};
module.exports = controller;
