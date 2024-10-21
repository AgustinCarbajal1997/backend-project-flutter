const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");
const { v4: uuidv4 } = require("uuid");
const { FieldValue } = require("firebase-admin/firestore");

class FirebaseConfig {
  firebaseAdmin;
  db;

  initFirebaseAdmin() {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.db = this.firebaseAdmin.firestore();
    return this.firebaseAdmin;
  }

  async getAllUsersRegistered() {
    const snapshot = await this.db.collection("users").get();
    let users = [];
    snapshot.forEach((doc) => users.push(doc.data()));
    return users;
  }

  async getUserData(email) {
    const snapshot = await this.db
      .collection("users")
      .where("email", "==", email)
      .get();
    let users = [];
    snapshot.forEach((doc) => users.push(doc.data()));
    if (users.length == 0) {
      throw { status: 404, code: "The user does not exist" };
    }

    return users[0];
  }

  async getChatRoomsByUserId(data) {
    //busco los chatrooms que tiene el usuario
    const snapshotUser = await this.db
      .collection("users")
      .where("id", "==", data.userId)
      .get();
    let users = [];
    snapshotUser.forEach((doc) => users.push(doc.data()));

    if (users.length == 0) {
      throw { status: 404, code: "The user does not exist" };
    }

    //filtro los chatrooms asociados
    const snapshotChatRooms = await this.db
      .collection("chatRooms")
      .where("id", "in", users[0].chatRooms)
      .get();
    let chatRooms = [];
    snapshotChatRooms.forEach((doc) => chatRooms.push(doc.data()));

    // busco el otro usuario para cada chatRoom
    const agregatedData = await Promise.all(
      chatRooms.map(async (cr) => {
        const snapshotAgregatedUser = await this.db
          .collection("users")
          .where("chatRooms", "array-contains-any", [cr.id])
          .get();
        let agregatedDataUsers = [];
        snapshotAgregatedUser.forEach((doc) =>
          agregatedDataUsers.push(doc.data())
        );
        agregatedDataUsers = agregatedDataUsers.filter(
          (usr) => usr.id !== data.userId
        );

        return {
          chatRoomData: cr,
          ...agregatedDataUsers[0],
        };
      })
    );

    return agregatedData;
  }

  async getChat(data) {
    const snapshot = await this.db
      .collection("messages")
      .where("chatRoomId", "==", data.chatRoomId)
      .orderBy("created", "asc")
      .get();
    let chats = [];
    snapshot.forEach((doc) => chats.push(doc.data()));
    return chats;
  }

  async createUserData(data) {
    const usersDb = this.db.collection("users");
    const id = uuidv4();
    await usersDb.doc(id).set({ id, ...data });
    return "Created successfully";
  }

  async createMessageData(data) {
    const messageDb = this.db.collection("messages");
    const id = uuidv4();
    await messageDb.doc(id).set({
      id,
      date: Date.now(),
      created: FieldValue.serverTimestamp(),
      ...data,
    });
    return "Created successfully";
  }

  async createChatRoomData(data) {
    const chatRoomDb = this.db.collection("chatRooms");
    const id = uuidv4();
    await chatRoomDb.doc(id).set({ id, date: Date.now() });
    const userId = await this.db
      .collection("users")
      .doc(data.userId)
      .update({
        chatRooms: FieldValue.arrayUnion(id),
      });
    const senderUserId = await this.db
      .collection("users")
      .doc(data.senderUserId)
      .update({
        chatRooms: FieldValue.arrayUnion(id),
      });
    return "Created successfully";
  }

  async sendPushNotification(notification) {
    try {
      await this.firebaseAdmin.messaging().send(notification);
    } catch (error) {
      throw error;
    }
  }

  async sendMulticastPushNotification(notification) {
    try {
      await this.firebaseAdmin.messaging().sendEachForMulticast(notification);
    } catch (error) {
      throw error;
    }
  }
}

const FB = new FirebaseConfig();
module.exports = { FB };
