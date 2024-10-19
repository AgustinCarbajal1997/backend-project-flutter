const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccount.json");
const { v4: uuidv4 } = require("uuid");

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

  async createUserData(data) {
    const usersDb = this.db.collection("users");
    const id = uuidv4();
    await usersDb.doc(id).set({ id, ...data });
    return "Created successfully";
  }

  async createMessageData(data) {
    const messageDb = this.db.collection("messages");
    const id = uuidv4();
    await messageDb.doc(id).set({ id, date: Date.now(), ...data });
    return "Created successfully";
  }

  async createChatRoomData(data) {
    const chatRoomDb = this.db.collection("chatRooms");
    const id = uuidv4();
    await chatRoomDb.doc(id).set({ id, date: Date.now(), ...data });
    return "Created successfully";
  }
}

const FB = new FirebaseConfig();
module.exports = { FB };
