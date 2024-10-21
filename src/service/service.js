const { FB } = require("../config/config");

const getAllUsersService = async () => {
  try {
    const users = await FB.getAllUsersRegistered();
    return {
      statusCode: 200,
      status: "success",
      users,
    };
  } catch (error) {
    throw error;
  }
};

const createUserService = async (body) => {
  try {
    const res = await FB.createUserData(body);
    return {
      statusCode: 201,
      status: res,
    };
  } catch (error) {
    throw error;
  }
};

const getChatRoomsByUserIdService = async (body) => {
  try {
    const users = await FB.getChatRoomsByUserId(body);
    return {
      statusCode: 200,
      status: "success",
      users,
    };
  } catch (error) {
    throw error;
  }
};

const createMessageService = async (body) => {
  try {
    const res = await FB.createMessageData(body);
    return {
      statusCode: 201,
      status: res,
    };
  } catch (error) {
    throw error;
  }
};

const createChatRoomService = async (body) => {
  try {
    const res = await FB.createChatRoomData(body);
    return {
      statusCode: 201,
      status: res,
    };
  } catch (error) {
    throw error;
  }
};

const getUserByEmailService = async (email) => {
  try {
    const res = await FB.getUserData(email);
    return {
      statusCode: 201,
      status: res,
    };
  } catch (error) {
    throw error;
  }
};

const getChatService = async (body) => {
  try {
    const res = await FB.getChat(body);
    return {
      statusCode: 201,
      status: res,
    };
  } catch (error) {
    throw error;
  }
};

const sendPushNotificationService = async (title, body, data, token) => {
  try {
    await FB.sendPushNotification({
      token,
      notification: {
        title,
        body,
      },
      data,
      android: { notification: { color: "#20B2AA" } },
    });
    return {
      statusCode: 200,
      status: "success",
    };
  } catch (error) {
    throw error;
  }
};

const sendMulticastPushNotificationService = async (
  title,
  body,
  data,
  tokens
) => {
  try {
    await FB.sendMulticastPushNotification({
      tokens,
      notification: {
        title,
        body,
      },
      data,
    });
    return {
      statusCode: 200,
      status: "success",
    };
  } catch (error) {
    throw error;
  }
};

const service = {
  sendPushNotificationService,
  sendMulticastPushNotificationService,
  getAllUsersService,
  createUserService,
  createMessageService,
  createChatRoomService,
  getUserByEmailService,
  getChatRoomsByUserIdService,
  getChatService,
};
module.exports = service;
