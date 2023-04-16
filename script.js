//grab nodes
const seasonTitle = document.querySelector('.seasonTitle');
const seasonTimeLeft = document.querySelector('.seasonTimeLeft');
const startDate = document.querySelector('.startDate');
const endDate = document.querySelector('.endDate');
const playerCount = document.querySelector('.playerCount');


function updateSeasonInfo() {
    fetch('https://data.ninjakiwi.com/battles2/homs')
        .then((response) => response.json())
        .then((json) => updateText(json))
}

function updateText(json) {
    console.log(json);
    seasonTitle.textContent = json.body[0].name
    timeLeft = getTimeLeft(json);
    seasonTimeLeft.textContent = `Time Left: ${timeLeft.days} Days, ${timeLeft.hours} Hours, ${timeLeft.minutes} Minutes`
    startDate.textContent = new Date(json.body[0].start);
    endDate.textContent = new Date(json.body[0].end);
    playerCount.textContent = json.body[0].totalScores
}

function getTimeLeft(json) {
    const todayDate = new Date()
    console.log(todayDate.toLocaleDateString());
    let endDate = new Date(json.body[0].end);
    console.log(endDate.toLocaleDateString());
    let timeToEnd = (endDate - todayDate) /1000
    timeToEnd/=60 //seconds to minutes
    timeToEnd/=60 //minutes to hours
    daysLeft = timeToEnd / 24 //hours to days
    daysLeft = Math.floor(daysLeft)
    hoursLeft = timeToEnd % 24 //take remainder hours
    minutesLeft = (hoursLeft*60)%60;
    minutesLeft = Math.floor(minutesLeft)
    hoursLeft = Math.floor(hoursLeft)
    console.log(daysLeft, hoursLeft, minutesLeft);
    return {days : daysLeft, hours : hoursLeft, minutes : minutesLeft}
}
updateSeasonInfo();