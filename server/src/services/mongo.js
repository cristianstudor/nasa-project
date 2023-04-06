const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:fCxj0lERXkCQbtb9@nasacluster.jsdipmj.mongodb.net/nasa_db?retryWrites=true&w=majority";

// Event emitter that emits events when the connection is ready
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
