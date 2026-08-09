require("dotenv").config();
const socketIo = require("socket.io");
const { userModel } = require("./models/user-model");
const { captainModel } = require("./models/captain-model");

let io;
function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONT_END_URL,
      methods: ["GET", "POST"], // Allow these HTTP methods
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected", socket.id);

    socket.on("join", async (data) => {
      const { ID, userType } = data;
      if (userType === "user") {
        await userModel.findByIdAndUpdate(ID, {
          socketID: socket.id,
        });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(ID, { socketID: socket.id });
      }
    });

    socket.on("update-captain-location", async (data) => {
      const { captainID, latitude, longitude } = data;

      if (!latitude || !longitude) {
        return socket.emit("error", { message: "Invalid location" });
      }
      try {
        await captainModel.findByIdAndUpdate(captainID, {
          location: {
            ltd: latitude,
            lng: longitude,
          },
        });
      } catch (error) {
        console.log("error in latitude and longitude updation", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}

function sendMessageToSocketID(socketID, messageObject) {
  if (io) {
    io.to(socketID).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket io is not initialized");
  }
}

module.exports = { initializeSocket, sendMessageToSocketID };
