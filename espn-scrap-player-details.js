/* Scrap players from espn  */

// Object to store player details
let playerDetails = {};

console.log("These are the player details scraped", playerDetails);

// Function to scrape player details from the individual cards on the team page of iplt20.com
async function scrapePlayerDetails(url,team) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            // Get the HTML text
            const html = await response.text();
            const parser = new DOMParser();
            // Parse the HTML text to a DOM
            const doc = parser.parseFromString(html, "text/html");

            // Select the player details
            // let player = doc.querySelector(".plyr-name-nationality");
            let list = doc.querySelectorAll(".ds-p-0")[0];
            let playerList = list.querySelectorAll(".ds-flex-1");
            for (player of playerList) {
                let playerLink = player.querySelector("a").href;
                const response = await fetch(playerLink);
                if (response.ok) {
                    // Get the HTML text
                    const html = await response.text();
                    const parser = new DOMParser();
                    // Parse the HTML text to a DOM
                    const doc = parser.parseFromString(html, "text/html");
                    let name = doc.querySelector(".ds-pt-8 h1").textContent;
                    let nationality = doc.querySelector(".ds-pt-8 span").textContent;
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
        }
    } catch (error) {
        console.error("Error scraping player details:", error);
    }
}

// Function to scrape according to each season given in the iplt20.com team page
async function scrapSeason(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            // Get the HTML text
            const html = await response.text();
            const parser = new DOMParser();
            // Parse the HTML text to a DOM
            const doc = parser.parseFromString(html, "text/html");
            let list = doc.querySelectorAll(".ds-p-0")[0];
            let teams = list.querySelectorAll("a");
            // let list = doc.querySelectorAll(".ds-inline-flex");
            // Check if the sections exist in the DOM
                for (let item of teams) {
                    let link = item.href;
                    let team = item.textContent;
                    await scrapePlayerDetails(link,team);
                }
        }
    } catch (error) {
        console.error("Error scraping player details:", error);
    }
}

// Function to scrape according to each team and season given in the iplt20.com team page
async function scrapeSeasons() {
    let years = [
        "indian-premier-league-2007-08-313494",
        "indian-premier-league-2009-374163",
        "indian-premier-league-2011-466304",
        "indian-premier-league-2012-520932",
        "indian-premier-league-2013-586733",
        "pepsi-indian-premier-league-2014-695871",
        "pepsi-indian-premier-league-2015-791129",
        "ipl-2016-968923",
        "ipl-2017-1078425",
        "ipl-2018-1131611",
        "ipl-2019-1165643",
        "ipl-2020-21-1210595",
        "ipl-2021-1249214",
    ];
    // Iterate through each team and season
    for (let year of years) {
            const url = `https://www.espncricinfo.com/series/${year}/squads`;
            await scrapSeason(url);
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
