var expect = require("chai").expect;
var assert = require("assert");

let linkStationsSolution;

describe("Link Station Test Suit", () => {
  before(async () => {
    linkStationsSolution = require("../src/powerStation");
    console.log(
      "--------------> ",
      await linkStationsSolution.calculatePower(7, 10)
    );
  });

  it("Get link stations with updated powers", async () => {
    let expOutput = [
      { cords: [0, 0], reach: 10, power: 100 },
      { cords: [2, 2], reach: 8, power: 26.745166004060962 },
      { cords: [20, 20], reach: 5, power: 0 },
      { cords: [10, 0], reach: 12, power: 4 },
    ];

    expect(await linkStationsSolution.getBestLinkStations([0, 0])).to.eql(
      expOutput
    );
  });

  it("Get distance between device location and link station", async () => {
    let deviceCoordinates = [18, 18];
    let linkStationCoordinates = [0, 0];
    let expectedDistance = 25.45584412271571;

    expect(
      await linkStationsSolution.findDistance(
        deviceCoordinates,
        linkStationCoordinates
      )
    ).to.be.eql(expectedDistance);
  });

  it("Get power as zero when distance > reach ", async () => {
    let distance = 10;
    let reach = 8;
    let expectedPower = 0;
    expect(
      await linkStationsSolution.calculatePower(distance, reach)
    ).to.be.eql(expectedPower);
  });

  it("Get power as positivie value when  reach > distance ", async () => {
    let distance = 6;
    let reach = 8;

    expect(
      await linkStationsSolution.calculatePower(distance, reach)
    ).to.be.greaterThan(0);
  });

  it("empty input arrays shold give an NaN error", async () => {
    let deviceCoordinates = [];
    let linkStationCoordinates = [];

    expect(
      await linkStationsSolution.findDistance(
        deviceCoordinates,
        linkStationCoordinates
      )
    ).to.be.NaN;
  });

  it("Sort Stations based on power in descending order ", async () => {
    let inputArray = [
      { cords: [0, 0], reach: 10, power: 100 },
      { cords: [2, 2], reach: 8, power: 26 },
      { cords: [10, 0], reach: 12, power: 4 },
    ];
    let expectedArray = [
      { cords: [10, 0], reach: 12, power: 4 },
      { cords: [2, 2], reach: 8, power: 26 },
      { cords: [0, 0], reach: 10, power: 100 },
    ];
    let reach = 8;

    expect(await linkStationsSolution.sortStations(inputArray)).to.be.eql(
      expectedArray
    );
  });

  // release memory
  after(() => {
    linkStationsSolution = undefined;
  });
});
