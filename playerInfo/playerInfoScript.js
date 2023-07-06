const submit = document.querySelector('.submit');
const matchHistoryButton = document.querySelector('.matchHistoryButton');

const navMenu = document.querySelector(".toolList");

const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}



function fetchResults() {

  // Assemble the full URL
  const url_start = "https://data.ninjakiwi.com/battles2/users/";
  let url = url_start + window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
  // Use fetch() to make the request to the API
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayResults(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}
function displayResults(json) {
  player = json.body;
  generateBanner(player)
  updateRankedStats(player);
  updateSummary(player);
  updateGeneralStats(player);
  updateMedals(player);
  updateRankHistory(player);
  updateLastMatch(player)
  matchHistoryButton.addEventListener('click', () => {
    window.location.href = '../matchViewer/matches.html?' + player.matches;
  })
};

function generateBanner(player) {
  const playerBannerContainer = document.querySelector('.playerBannerContainer');
  const playerName = document.createElement('h1');
  playerName.classList.add('playerName');
  const playerIcon = document.createElement('img');
  playerIcon.classList.add('playerIcon');
  const playerBanner = document.createElement('img');
  playerBanner.classList.add('playerBanner');
  playerBanner.src = player.equippedBannerURL;
  playerBanner.borderImageSource = "url(player.equippedBorderURL)";
  playerName.textContent = `${player.displayName}`;
  playerIcon.src = player.equippedAvatarURL;
  playerBannerContainer.appendChild(playerBanner);
  playerBannerContainer.appendChild(playerIcon);
  playerBannerContainer.appendChild(playerName);
}

function updateRankedStats(player) {
  for (const key in player.rankedStats) {
    let dataOutput = document.querySelector(`[data-key = ${key.toString()}]>td:last-child`);
    dataOutput.textContent = player.rankedStats[key];
  }
}

function updateSummary(player) {
  function getColor(value){
    console.log(value)
    //value from 0 to 1
    if (value >= 0.5) {
      value = 1-value
      var hue=((1-value)*150).toString(10);
    } else if (value < 0.5) {
      var hue=((1-value)*50).toString(10);
    }
    return ["hsl(",hue,",100%,45%)"].join("");
  }
  const towers = player._towers
  let winrate = (player.rankedStats['wins']/(player.rankedStats['wins']+player.rankedStats['losses']))*100
  winrate = Math.floor(winrate*10)/10
  let favoriteTower1 = {
    'type': 'none',
    'used': 0
  }
  let favoriteTower2 = {
    'type': 'none',
    'used': 0
  }
  let favoriteTower3 = {
    'type': 'none',
    'used': 0
  }
  for (let i = 0; i < towers.length; i++) {
    tower = towers[i]
    const heroTowers = ['Quincy', 'Quincy_Cyber', 'Gwendolin', 'Gwendolin_Science', 'Churchill', 'Churchill_Sentai', 'StrikerJones', 'StrikerJones_Biker', 'Obyn', 'Obyn_Ocean', 'Benjamin', 'Benjamin_DJ', 'Ezili', 'Ezili_SmudgeCat', 'PatFusty', 'PatFusty_Snowman', 'Agent_Jericho', 'Highwayman_Jericho']
    if (tower == favoriteTower1 || tower == favoriteTower2 || tower == favoriteTower3) {
      continue
    }
    if (heroTowers.includes(tower.type)) {
      continue
    }
    if (tower.used > favoriteTower1.used) {
      favoriteTower3 = favoriteTower2
      favoriteTower2 = favoriteTower1
      favoriteTower1 = tower
      continue
    }
    if (tower.used > favoriteTower2.used) {
      favoriteTower3 = favoriteTower2
      favoriteTower2 = tower
      continue
    }
    if (tower.used > favoriteTower3.used) {
      favoriteTower3 = tower
      continue
    }
  }

  let winrateText = document.querySelector('.winrateNum');
  let tower1Text = document.querySelector('.tower1')
  let tower2Text = document.querySelector('.tower2')
  let tower3Text = document.querySelector('.tower3')
  winrateText.textContent = winrate + "%"
  winrateText.style.color = getColor((winrate/100))
  tower1Text.textContent = favoriteTower1.type
  tower2Text.textContent = favoriteTower2.type
  tower3Text.textContent = favoriteTower3.type
}

function updateGeneralStats() {
  bloonStats = player._bloonStats;
  towerStats = player._towers;
  heroTable = document.querySelector('.heroClass>tbody');
  primaryTable = document.querySelector('.primaryClass>tbody');
  militaryTable = document.querySelector('.militaryClass>tbody');
  magicTable = document.querySelector('.magicClass>tbody');
  supportTable = document.querySelector('.supportClass>tbody');
  bloonTable = document.querySelector('.bloonClass>tbody');
  moabTable = document.querySelector('.moabClass>tbody');
  bloonStats.forEach(bloon => {generateBloonRow(bloon, bloonTable, moabTable)});
  for (let i = 0; i < towerStats.length; i++) {
    generateTowerRow(towerStats[i], heroTable, primaryTable, militaryTable, magicTable, supportTable);
  }
}

function generateTowerRow(tower, heroTable, primaryTable, militaryTable, magicTable, supportTable) {
  let towerClass = '';
  const primaryTowers = ['DartMonkey', 'TackShooter', 'BombShooter', 'BoomerangMonkey', 'IceMonkey', 'GlueGunner']
  const magicTowers = ['Alchemist', 'SuperMonkey', 'NinjaMonkey', 'Druid', 'WizardMonkey']
  const militaryTowers = ['MonkeySub', 'MonkeyAce', 'HeliPilot', 'SniperMonkey', 'DartlingGunner', 'MonkeyBuccaneer', 'MortarMonkey']
  const supportTowers = ['BananaFarm', 'SpikeFactory', 'MonkeyVillage', 'EngineerMonkey', 'BeastHandler']
  const heroTowers = ['Quincy', 'Quincy_Cyber', 'Gwendolin', 'Gwendolin_Science', 'Churchill', 'Churchill_Sentai', 'StrikerJones', 'StrikerJones_Biker', 'Obyn', 'Obyn_Ocean', 'Benjamin', 'Benjamin_DJ', 'Ezili', 'Ezili_SmudgeCat', 'PatFusty', 'PatFusty_Snowman', 'Agent_Jericho', 'Highwayman_Jericho']

  //set tower class based on what list its in
  if (primaryTowers.includes(tower.type)) {
    towerClass = 'primary';
  } else if (magicTowers.includes(tower.type)) {
    towerClass = 'magic';
  } else if (militaryTowers.includes(tower.type)) {
    towerClass = 'military';
  } else if (supportTowers.includes(tower.type)) {
    towerClass = 'support';
  } else if (heroTowers.includes(tower.type)) {
    towerClass = 'hero';
  }
  let row = document.createElement('tr');
  let name = document.createElement('th');
  let uses = document.createElement('td');
  name.textContent = tower.type;
  uses.textContent = tower.used;
  row.appendChild(name);
  row.appendChild(uses);
  switch (towerClass) {
    case 'hero':
      heroTable.appendChild(row);
      break;
    case 'primary':
      primaryTable.appendChild(row);
      break;
    case 'military':
      militaryTable.appendChild(row);
      break;
    case 'magic':
      magicTable.appendChild(row);
      break;
    case 'support':
      supportTable.appendChild(row);
      break;
    default:
      break;
  }
}
function generateBloonRow(bloon, bloonTable, moabTable) {
  let row = document.createElement('tr');
  let name = document.createElement('th');
  let sends = document.createElement('td');
  let pops = document.createElement('td');
  name.textContent = bloon.bloon_type;
  sends.textContent = bloon.sends;
  pops.textContent = bloon.pops;
  row.appendChild(name);
  row.appendChild(sends);
  row.appendChild(pops);
  if (bloon.bloon_type != bloon.bloon_type.toUpperCase()) {
    bloonTable.appendChild(row);
  } else {
    moabTable.appendChild(row);
  }
}


function updateRankHistory(player) {
  fetch(player.homs)
    .then((response) => response.json())
    .then((json) => displayRankHistory(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function  displayRankHistory(json) {
    seasons = json.body;
    // console.log(seasons);
    if (seasons[0].rank) {
        let currentRank = seasons[0].rank;
        let currentScore = seasons[0].score;
        let currentTotal = seasons[0].totalScores;
        let currentRankDisplay = document.querySelector('.currentRank');
        currentRankDisplay.classList.add('currentRankDisplay');
        let currentRankNum = document.createElement('span');
        currentRankNum.classList.add('currentRankNum');
        let currentScoreNum = document.createElement('p');
        currentScoreNum.classList.add('currentScoreNum');
        let currentTotalNum = document.createElement('span');
        currentTotalNum.classList.add('currentTotalNum');
        currentScoreNum.textContent = `Score: ${currentScore}`;
        currentRankNum.textContent = currentRank;
        currentTotalNum.textContent = ` of ${currentTotal}`;
        currentRankDisplay.appendChild(currentRankNum);
        currentRankDisplay.appendChild(currentTotalNum);
        currentRankDisplay.appendChild(currentScoreNum);
    }
    if (seasons[1].rank) {
          let previousRank = seasons[1].rank;
          let previousScore = seasons[1].score;
          let previousTotal = seasons[1].totalScores;
          let previousRankDisplay = document.querySelector('.previousRank');
          previousRankDisplay.classList.add('previousRankDisplay');
          let previousRankNum = document.createElement('span');
          previousRankNum.classList.add('previousRankNum');
          let previousScoreNum = document.createElement('p');
          previousScoreNum.classList.add('previousScoreNum');
          let previousTotalNum = document.createElement('span');
          previousTotalNum.classList.add('previousTotalNum');
          previousScoreNum.textContent = `Score: ${previousScore}`;
          previousRankNum.textContent = previousRank;
          previousTotalNum.textContent = ` of ${previousTotal}`;
          previousRankDisplay.appendChild(previousRankNum);
          previousRankDisplay.appendChild(previousTotalNum);
          previousRankDisplay.appendChild(previousScoreNum);
    }
  }
}

function updateMedals(player) {
  for (badge in player.badges_all) {
    badgeImage = document.createElement('img');
    badgeImage.classList.add('badgeImage');
    badgeImage.src = player.badges_all[badge].iconURL;
    let badgeDisplay = document.querySelector('.badgeDisplay');
    badgeDisplay.appendChild(badgeImage);
  }
}

function updateLastMatch(player) {
  fetch(player.matches)
    .then((response) => response.json())
    .then((json) => displayLastMatch(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function displayLastMatch(json) {
    match = json.body[0];
    players = [match.playerLeft, match.playerRight];
    for (let i = 0; i<2; i++) {
      if (players[i].currentUser && players[i].result == 'win') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'WIN';
        matchDisplay.classList.add('win');
      } else if (players[i].currentUser && players[i].result == 'lose') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'LOSE';
        matchDisplay.classList.add('lose');
      } else if (players[i].currentUser && players[i].result == 'draw') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'DRAW';
        matchDisplay.classList.add('draw');
      }
    }
  }
}
window.onload = function () {
  // Call the fetchResults() function when the page loads
  fetchResults();
}
