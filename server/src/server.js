const http = require("http");
// For Creating multiple processes in Windows
// const cluster = require("cluster");
// cluster.schedulingPolicy = cluster.SCHED_RR;

const app = require("./app.js");

const { mongoConnect } = require("./services/mongo.js");

const { loadPlanetsData } = require("./models/planets.model.js");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
