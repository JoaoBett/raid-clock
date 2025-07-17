document.addEventListener('DOMContentLoaded', e => {
    // Variables
    let isRaidActive = false;
    let totalGameTime = 0; 
    let totalWaitingTime = 0;
    let raidInterval = 0;
    let waitingInterval = 0;

    // Elements
    startButton = document.getElementById('start-button');
    resetButton = document.getElementById('reset-button');
    waitingTime = document.getElementById('waiting-time');
    gameTime = document.getElementById('game-time');
    

    function formatTime(totalSeconds){
        const hours = Math.floor(totalSeconds / 3600);             
        const minutes = Math.floor((totalSeconds % 3600) / 60);   
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    }

    // Event Listeners
    function startRaid() {
        if (isRaidActive === false){
            isRaidActive = true;

            //Stop WaitingTimer
            if (totalWaitingTime > 0){                
                clearInterval(waitingInterval);
            }

            startButton.textContent = 'End Raid';
            startButton.classList.add("raid-active");
            
            raidInterval = setInterval(
                function() {
                    totalGameTime += 1;
                    gameTime.textContent = formatTime(totalGameTime);
                }
                ,1000);

        }
        else{
            isRaidActive = false;
            startButton.textContent = 'Start Raid';
            startButton.classList.remove("raid-active");

            // Stop GameTimer
            clearInterval(raidInterval);
            waitingInterval = setInterval(
                function(){
                    totalWaitingTime += 1;
                    waitingTime.textContent = formatTime(totalWaitingTime);
                },1000);
        }
    }

    function resetRaid() {
        isRaidActive = false;
        startButton.textContent = 'Start Raid';
        startButton.classList.remove("raid-active");

        totalGameTime = 0;
        totalWaitingTime = 0;
        gameTime.textContent = '00:00:00';
        waitingTime.textContent = '00:00:00';

        // Stop both timers
        if (raidInterval) {
            clearInterval(raidInterval);
        }

        if (waitingInterval) {
            clearInterval(waitingInterval);
        }
    }

    startButton.addEventListener("click", function(e){
        startRaid();
    });

    resetButton.addEventListener("click", function(e){
        resetRaid();
    });

});
