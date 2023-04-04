const http = require("http");
const mongoose = require("mongoose");
// For Creating multiple processes in Windows
// const cluster = require("cluster");
// cluster.schedulingPolicy = cluster.SCHED_RR;

const app = require("./app.js");

const { loadPlanetsData } = require("./models/planets.model.js");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:fCxj0lERXkCQbtb9@nasacluster.jsdipmj.mongodb.net/nasa_db?retryWrites=true&w=majority";

const server = http.createServer(app);

// Event emitter that emits events when the connection is ready
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
