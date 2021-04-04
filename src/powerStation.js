/*jslint node: true */
"use strict";
const debug = require("debug")("server:debug");

/**
 * This application is developed as part of the NordCloud assignment
 * @author Syam Voleti
 */

// Test points (device locations)
let deviceLocations = [
  [0, 0],
  [100, 100],
  [15, 10],
  [18, 18],
];

/**
 * Sorts stations in descending order
 * @param    {object} stations Power stations
 * @return   {object} stations Returns sorted stations
 */
const sortStations = async (stations) => {
  await stations.sort((firstStation, secondStation) => {
    return firstStation.power - secondStation.power;
  });
  return stations;
};

/**
 * @param    {String} distance
 * @param   {String} reach
 * @return   {number} power
 */
const calculatePower = async (distance, reach) => {
  let power = await (distance > reach
    ? 0
    : Math.pow(Math.abs(reach - distance), 2));
  return power;
};

/**
 * @param    {Array} deviceLocation Test point
 * @param   {Array} cords  Link Station coordinates
 * @return   {number} power
 */
const findDistance = (deviceLocation, psCords) => {
  debug("Received cords ", deviceLocation, psCords);

  try {
    let distance = Math.sqrt(
      Math.pow(Math.abs(deviceLocation[0] - psCords[0]), 2) +
        Math.pow(Math.abs(deviceLocation[1] - psCords[1]), 2)
    );

    return distance;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Calculates the powers for all desired points
 * @param    {Array} deviceLocation Test point
 * @return   {Array} linkStations with updated power values.
 */
const getBestLinkStations = async (deviceLocation) => {
  let linkStations = [
    { cords: [0, 0], reach: 10, power: 0 },
    { cords: [2, 2], reach: 8, power: 0 },
    { cords: [20, 20], reach: 5, power: 0 },
    { cords: [10, 0], reach: 12, power: 0 },
  ];

  // iterate each station and figure out if it provides the best power
  await linkStations.map(async (psPoint) => {
    // now get the distance from the test point
    try {
      let distance = await findDistance(deviceLocation, psPoint.cords);
      let result = await calculatePower(distance, psPoint.reach);
      psPoint.power = result;
    } catch (err) {
      throw new Error(err);
    }
  });

  return await linkStations;
};

// Program origin point
const linkStationsSolution = deviceLocations.map(async (deviceLocation) => {
  try {
    let linkStations = await getBestLinkStations(deviceLocation);
    debug("Received link stations with updated powers:  ", linkStations);

    // filter all stations with positive power values
    linkStations = await linkStations.filter((res) => res.power > 0);

    // sort the results in descending order
    linkStations = await sortStations(linkStations);

    // extract the top most powerstation with most suitable power
    linkStations = linkStations.length ? linkStations.pop() : undefined;

    // Compose the final output based on its result.
    (await (typeof linkStations !== "undefined"))
      ? console.log(
          `"Best link station for point ${deviceLocation[0]}, ${
            deviceLocation[1]
          } is ${linkStations.cords[0]}, ${
            linkStations.cords[1]
          } with power ${linkStations.power.toFixed(2)}"`
        )
      : console.log(
          `"No link station within reach for point ${deviceLocation[0]}, ${deviceLocation[1]}"`
        );
  } catch (err) {
    throw new Error(err);
  }
});

// exported modules for unit testing purposes
module.exports.linkStationsSolution = linkStationsSolution;
module.exports.getBestLinkStations = getBestLinkStations;
module.exports.findDistance = findDistance;
module.exports.calculatePower = calculatePower;
module.exports.sortStations = sortStations;
