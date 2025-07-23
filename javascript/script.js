document.addEventListener('DOMContentLoaded', e => {
    // Variables
    let isRaidActive = false;

    let raidInterval = 0; // raid timer
    let waitingInterval = 0; // waiting timer
    let gameTimeCounter = 0; 

    let totalWaitingTime = 0;
    let totalGameTime = 0; 

    let raids = []; // raid storage
    let lastRaidDuration = 0; 

    // Buttons and Elements
    let startButton = document.getElementById('start-button');
    let resetButton = document.getElementById('reset-button');
    let logRaidContainer = document.getElementById('log-raid-container');
    let saveRaid = document.getElementById('save-raid-btn');
    let resetHistory = document.querySelector('.reset-history-button');

    // Elements
    let gameTimeElement = document.getElementById('game-time');
    let waitingTimeElement = document.getElementById('waiting-time');
    let historyListElement = document.getElementById('history-raids-list');
    
    
    let totalGameTimeElement = document.getElementById('total-game-time');
    let totalWaitingTimeElement = document.getElementById('total-waiting-time');


    function formatTime(totalSeconds){
        const hours = Math.floor(totalSeconds / 3600);             
        const minutes = Math.floor((totalSeconds % 3600) / 60);   
        const seconds = Math.floor(totalSeconds % 60);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    }

    function startWaitingTimer(){
        waitingTimeCounter = 0;
        waitingInterval = setInterval(
                function(){
                    waitingTimeCounter += 1;
                    totalWaitingTime += 1;
                    waitingTimeElement.textContent = formatTime(waitingTimeCounter);
                    totalWaitingTimeElement.textContent = formatTime(totalWaitingTime);
                },1000);
    }

    // Event Listeners
    function startRaid() {
        if (isRaidActive === false){
            isRaidActive = true;
            gameTimeElement.textContent = '00:00:00';
            waitingTimeElement.textContent = '00:00:00';


            gameTimeCounter = 0;

            clearInterval(waitingInterval);

            startButton.textContent = 'End Raid';
            startButton.classList.add("raid-active");
            
            raidInterval = setInterval(
                function() {
                    gameTimeCounter += 1;
                    totalGameTime += 1
                    gameTimeElement.textContent = formatTime(gameTimeCounter);
                    totalGameTimeElement.textContent = formatTime(totalGameTime);
                }
                ,1000);
            
            
        }
        else{
            isRaidActive = false;
            startButton.textContent = 'Start Raid';
            startButton.classList.remove("raid-active");

            waitingTimeElement.textContent = '00:00:00';

            clearInterval(raidInterval);
            
            lastRaidDuration = gameTimeCounter; 
            //totalGameTime += lastRaidDuration;

            logRaidContainer.classList.remove("hidden");

            startWaitingTimer();
            
        }
    }

    function resetRaid() {
        isRaidActive = false;
        startButton.textContent = 'Start Raid';
        startButton.classList.remove("raid-active");
        logRaidContainer.classList.add("hidden");

        gameTimeCounter = 0;
        waitingTimeCounter = 0;
        totalGameTime = 0;
        totalWaitingTime = 0;
        raids = [];

        gameTimeElement.textContent = '00:00:00';
        waitingTimeElement.textContent = '00:00:00';
        if (totalGameTimeElement){ totalGameTimeElement.textContent = '00:00:00';}
        if (totalWaitingTimeElement) totalWaitingTimeElement.textContent = '00:00:00';

        clearInterval(raidInterval);
        clearInterval(waitingInterval);

        historyRaids(raids);
    }

    function saveRaidDetails(){
        let raidSurvivalElement = document.getElementById('raid-survival');
        let raidMapElement = document.getElementById('raid-map');

        const raidDetails ={
            survival: raidSurvivalElement.checked,
            raidDuration: lastRaidDuration,
            map: raidMapElement.value,
        }

        raids.push(raidDetails);

        logRaidContainer.classList.add("hidden");

        raidSurvivalElement.checked = false;
        raidMapElement.value = "Customs"; 

        historyRaids(raids);
    }

    function historyRaids(raids){
        historyListElement.innerHTML = ''; // Clear previous history

        for (let i = 0; i < raids.length; i++) {
            const raid = raids[i];
            const raidItem = document.createElement('li');
            raidItem.className = raid.survival ? 'survived' : 'dead';
            raidItem.textContent = `Raid ${i + 1}: ${raid.survival ? 'Survived' : 'Died'}, Duration: ${formatTime(raid.raidDuration)}, Map: ${raid.map}`;
            document.getElementById('history-raids-list').appendChild(raidItem);
        }
    }

    function resetHistoryList() {
        for (let i = 0; i< raids.length; i++) {
            const raidItem = document.querySelector(`#history-raids-list li:nth-child(${i + 1})`);
            if (raidItem) {
                raidItem.remove(); // Remove each raid item from the history list
            }
        }
        raids = []; // Reset raids array
    }

    startButton.addEventListener("click", startRaid);

    resetButton.addEventListener("click", resetRaid);

    saveRaid.addEventListener("click", saveRaidDetails);

    resetHistory.addEventListener("click", resetHistoryList);

});
