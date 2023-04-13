const http = require("http");
// For Creating multiple processes in Windows
// const cluster = require("cluster");
// cluster.schedulingPolicy = cluster.SCHED_RR;
require("dotenv").config();

const app = require("./app.js");

const { mongoConnect } = require("./services/mongo.js");

const { loadPlanetsData } = require("./models/planets/planets.model.js");
const { loadLaunchData } = require("./models/launches/launches.model.js");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
