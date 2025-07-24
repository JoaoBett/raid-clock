document.addEventListener('DOMContentLoaded', e => {
    // Variables
    let isRaidActive = false;

    let raidInterval = 0; // raid timer
    let waitingInterval = 0; // waiting timer
    let gameTimeCounter = 0; //game timer

    let totalWaitingTime = 0;
    let totalGameTime = 0; 

    let raids = []; // raid storage
    let lastRaidDuration = 0; 

    // Statistics
    let survivedRaids = 0;
    let survivalRate = 0;
    let totalRaidDuration = 0;
    let totalSessionTime = 0;
    let efficiency = 0;
    let averageTime = 0;

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

    let survivalRateElement = document.getElementById('stat-survival-rate')
    let avgRaidTimeElement = document.getElementById('stat-avg-time');
    let sessionEfficiencyElement = document.getElementById('stat-efficiency');

    loadSession();

    function saveSession() {
        localStorage.setItem('raidHistory', JSON.stringify(raids)); 
        localStorage.setItem('raidGameTime', JSON.stringify(totalGameTime));
        localStorage.setItem('raidWaitingTime', JSON.stringify(totalWaitingTime));
    }

    function loadSession() {
        const savedRaids = localStorage.getItem('raidHistory');
        raids = JSON.parse(savedRaids) || [];
        historyRaids(); 
        updateStats();

        const savedGameTime = localStorage.getItem('raidGameTime');
        if (savedGameTime) {
            totalGameTime = JSON.parse(localStorage.getItem('raidGameTime'));
            totalGameTimeElement.textContent = formatTime(totalGameTime);
        }
        
        const savedWaitingTime = localStorage.getItem('raidWaitingTime');
        if (savedWaitingTime) {
            totalWaitingTime = JSON.parse(localStorage.getItem('raidWaitingTime'));
            totalWaitingTimeElement.textContent = formatTime(totalWaitingTime);
        }
    }

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

        historyRaids();
        saveSession();
        updateStats();
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

        historyRaids();
        localStorage.setItem('raidHistory', 0);
        localStorage.setItem('raidGameTime', 0);
        localStorage.setItem('raidWaitingTime', 0);   

        saveSession();
        updateStats();
    }

    function historyRaids(){
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

        historyListElement.innerHTML = '';
        raids = []; 
    }


    function updateStats(){

        if (raids.length === 0) {
            survivalRateElement.textContent = '0.0%';
            avgRaidTimeElement.textContent = '00:00:00';
            sessionEfficiencyElement.textContent = '0.0%';
            return;
        }
        
        if (raids.length > 0){
            //survival rate
            survivedRaids = raids.filter(raid => raid.survival === true)
            survivalRate = (survivedRaids.length / raids.length) * 100;
            survivalRateElement.textContent = `${survivalRate.toFixed(1)}%`;

            //average raid time
            totalRaidDuration += raids.reduce((acc, raid) => acc + raid.raidDuration, 0);
            averageTime = totalRaidDuration / raids.length;
            avgRaidTimeElement.textContent = formatTime(averageTime);

            //session efficiency
            totalSessionTime = totalGameTime + totalWaitingTime;
            if (totalSessionTime > 0){
                efficiency = (totalGameTime / totalSessionTime) * 100;
                sessionEfficiencyElement.textContent = `${efficiency.toFixed(1)}%`;
            }
        }
    }

    startButton.addEventListener("click", startRaid);

    resetButton.addEventListener("click", resetRaid);

    saveRaid.addEventListener("click", saveRaidDetails);

    resetHistory.addEventListener("click", resetHistoryList);
});
