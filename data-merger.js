const fs = require("fs");

const ipl = fs.readFileSync(
  "./scrapped-data/iplt20-player-details.json",
  "utf8"
);
const iplObj = JSON.parse(ipl);

const espn = fs.readFileSync(
  "./scrapped-data/espn-player-details.json",
  "utf8"
);
const espnObj = JSON.parse(espn);

console.log(
  "These are the player details scraped from ipl t20 website",
  Object.keys(iplObj).length
);
console.log(
  "These are the player details scraped from espn website",
  Object.keys(espnObj).length
);

// Merge the objects
Object.keys(espnObj).forEach((key) => {
  if (!(key in iplObj)) {
    console.log("Player", key);
    iplObj[key] = espnObj[key];
  }
});

fs.writeFileSync(
  "./scrapped-data/merged-player-details.json",
  JSON.stringify(iplObj)
);

const mergedData = fs.readFileSync(
  "./scrapped-data/merged-player-details.json",
  "utf8"
);

const mergedObj = JSON.parse(mergedData);

console.log("Final merged data", Object.keys(mergedObj).length);
