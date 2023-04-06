const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo.js");

function isHabitablePLanet(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const arrayOfSavePlanetPromises = [];

    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true
        })
      )
      .on("data", async (data) => {
        if (isHabitablePLanet(data)) {
          arrayOfSavePlanetPromises.push(savePlanet(data));
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        Promise.allSettled(arrayOfSavePlanetPromises).then(() => {
          const countPlanetsFound = arrayOfSavePlanetPromises.length;
          console.log(
            `${countPlanetsFound} habitable planets have been found!`
          );
          resolve();
        });
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name }, // first doc found that meets condition
      { keplerName: planet.kepler_name }, // update first doc found
      { upsert: true } // create new doc in collection, if no doc found
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets
};
