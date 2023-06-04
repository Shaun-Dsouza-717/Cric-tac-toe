// Object to store player details
let playerDetails = {};

console.log("These are the player details scraped", playerDetails);

// Function to scrape player details from the individual cards on the team page of iplt20.com
async function scrapePlayerDetails(url, team) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      // Get the HTML text
      const html = await response.text();
      const parser = new DOMParser();
      // Parse the HTML text to a DOM
      const doc = parser.parseFromString(html, "text/html");

      // Select the player details
      let player = doc.querySelector(".plyr-name-nationality");
      if (player) {
        // Get the player details
        team = team.split("-").join(" ");
        let name = player.querySelector("h1").textContent;
        let nationality = player.querySelector("span").textContent;
        // Add the player details to the playerDetails object if it doesn't exist
        if (name in playerDetails) {
          // Add the team to the player details if it doesn't exist in the teams array
          if (!playerDetails[`${name}`].teams.includes(team)) {
            playerDetails[`${name}`].teams.push(team);
          }
        } else {
          playerDetails[`${name}`] = {
            nationality: nationality,
            teams: [team],
          };
        }
      }
    }
  } catch (error) {
    console.error("Error scraping player details:", error);
  }
}

// Function to scrape according to each season given in the iplt20.com team page
async function scrapSeason(url, team) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      // Get the HTML text
      const html = await response.text();
      const parser = new DOMParser();
      // Parse the HTML text to a DOM
      const doc = parser.parseFromString(html, "text/html");
      let sections = doc.querySelectorAll(".ih-pcard-sec");
      // Check if the sections exist in the DOM
      if (sections.length !== 0) {
        for (let section of sections) {
          let cardArray = section.querySelectorAll("ul")[0];
          let cardList = cardArray.querySelectorAll("li");
          for (let card of cardList) {
            const url = card.querySelector("a").href;
            await scrapePlayerDetails(url, team);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error scraping player details:", error);
  }
}

// Function to scrape according to each team and season given in the iplt20.com team page
async function scrapeSeasons() {
  let teams = [
    "Royal-Challengers-Bangalore",
    "Chennai-Super-Kings",
    "Delhi-Capitals",
    "Punjab-Kings",
    "Kolkata-Knight-Riders",
    "Mumbai-Indians",
    "Rajasthan-Royals",
    "Sunrisers-Hyderabad",
    "Gujarat-Titans",
    "Lucknow-Super-Giants",
  ];
  // Iterate through each team and season
  for (let team of teams) {
    for (let i = 2008; i <= 2023; i++) {
      const url = `https://www.iplt20.com/teams/${team}/squad/${i}/#list`;
      await scrapSeason(url, team);
    }
  }

  // Convert playerDetails to JSON string
  let jsonString = JSON.stringify(playerDetails);

  // Create a new Blob with the JSON string
  let blob = new Blob([jsonString], { type: "application/json" });

  // Create a download link
  let downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "playerDetails.json";

  // Programmatically trigger the download
  downloadLink.click();
}

scrapeSeasons();
