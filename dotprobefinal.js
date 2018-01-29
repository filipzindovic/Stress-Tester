(function() {
    
    var threatStimuli = ["IMAGES/abz2.webp", "IMAGES/abz3.webp", "IMAGES/george2.webp", "IMAGES/george3.webp", "IMAGES/james2.webp", "IMAGES/james3.webp", "IMAGES/loick2.webp", "IMAGES/loick3.webp", "IMAGES/martina2.webp", "IMAGES/martina3.webp", "IMAGES/mike2.webp", "IMAGES/mike3.webp", "IMAGES/oz2.webp", "IMAGES/oz3.webp", "IMAGES/sharmila2.webp", "IMAGES/sharmila3.webp"];
    var nonThreatStimuli = ["IMAGES/abz1.webp", "IMAGES/abz4.webp", "IMAGES/george1.webp", "IMAGES/george4.webp", "IMAGES/james1.webp", "IMAGES/james4.webp", "IMAGES/loick1.webp", "IMAGES/loick4.webp", "IMAGES/martina1.webp", "IMAGES/martina4.webp", "IMAGES/mike1.webp", "IMAGES/mike4.webp", "IMAGES/oz1.webp", "IMAGES/oz4.webp", "IMAGES/sharmila1.webp", "IMAGES/sharmila4.webp"];

    var imgX = document.getElementById("imgX");
    var img0 = document.getElementById("img0");
    var img1 = document.getElementById("img1");
    var trialCounter = 0;
    var arrowArray = ["IMAGES/arrow0.png", "IMAGES/arrow1.png"];
    var startTime;
    var incorrectResponses = [];
    var threatResponses = [];
    var nonThreatResponses = [];
    var randomNumber;
    var totalRealTrials = 16;
    var totalPracticeTrials = 6;
    var realTrials = false;

    function initiateTrial(trialResponse, timeout1, timeout2) {
        changeVisibilityOfX("visible");
            setTimeout(() => {
                randomNumber = new generateRandomNumbers();
                changeVisibilityOfX("hidden");
                if (realTrials) {
                displayRandomImage(randomNumber.stimuliType, randomNumber.stimuliPosition);
                }
                setTimeout(() => {
                    resetAllImages();            
                    displayArrow(randomNumber.arrowPosition, randomNumber.arrowType);
                    if (realTrials) {
                    startTime = new Date().getTime();
                    }
                    listenForUserResponse(trialResponse);
            }, timeout1);
        }, timeout2);
    };
    
    function changeVisibilityOfX(xStyle) {
        imgX.style.visibility = xStyle;
    };
    
    function generateRandomNumbers() {
        var stimuliPosition = Math.round(Math.random());
        var stimuliType = Math.floor(Math.random() * threatStimuli.length);
        var arrowPosition = Math.round(Math.random());
        var arrowType = Math.round(Math.random());
        
        return {
            stimuliPosition, 
            stimuliType, 
            arrowPosition, 
            arrowType
        }
    };

    function displayRandomImage(stimuliType, stimuliPosition) {
        //sets position of threatStimuli Image.
        document.getElementById("img" + stimuliPosition).src = threatStimuli[stimuliType];
        
        //Based on the position of the threatStimuli, the nonThreatStimuli is placed on the other side.
        (stimuliPosition === 1) ? document.getElementById("img0").src = nonThreatStimuli[stimuliType] : document.getElementById("img1").src = nonThreatStimuli[stimuliType];
        
        //Removes the random images that was selected from the arrays.
        threatStimuli.splice(stimuliType, 1);
        nonThreatStimuli.splice(stimuliType, 1);
    };
    
    function resetAllImages() {
        img0.src = "";
        img1.src = "";
    };
    
    function displayArrow(arrowPosition, arrowType) {
        document.getElementById("img" + arrowPosition).src = arrowArray[arrowType];
    };
    
    function listenForUserResponse(trialResponse) {
        
        document.addEventListener("keydown", function arrowPress(e) {
            switch (e.keyCode) {
                case 38:
                    document.removeEventListener("keydown", arrowPress);
                    trialResponse(1);  
                    break;
                case 40:
                    document.removeEventListener("keydown", arrowPress);
                    trialResponse(0); 
                    break;       
            }  
        })
    };
    
    function realTrialsResponse(arrowPressed) {
        //push calculated value into correct array
        pushUserResponseTimeIntoArray(randomNumber.arrowPosition, randomNumber.stimuliPosition, randomNumber.arrowType, arrowPressed);
        //resetArrow
        resetAllImages();
        //checks if total trials has been reached, if not restarts function.
        checkTotalNumberOfTrials(initiateTrial, totalRealTrials, calculateScore);
    };
    
    function pushUserResponseTimeIntoArray(arrowPosition, threatPosition, arrowType, arrowPressed) {
        if (arrowType === arrowPressed) {
            if (arrowPosition === threatPosition) {
                //push response to threat array
                threatResponses.push(calculateUserReactionTime());
            } else {  
                //push to non-threat array
                nonThreatResponses.push(calculateUserReactionTime());
                }
        } else {
            //push response to incorrectArray.
            incorrectResponses.push(calculateUserReactionTime());
        }
    };
    
    function calculateUserReactionTime() {
        
        var endTime = new Date().getTime();
        
        var userResponseTimeInMilliseconds = endTime - startTime;
        
        return userResponseTimeInMilliseconds;
    };
    
    function checkTotalNumberOfTrials(typeOfTrial, trialLength, initiateEndOfTrialsFunction) {
        trialCounter++;
        if (trialCounter < trialLength) {
            if (realTrials) {
                typeOfTrial(realTrialsResponse, 1500, 1500);
            } else {
                typeOfTrial(practiceTrialsResponse, 100, 500);
            }
            return;
        } else {
            trialCounter = 0;
            (threatResponses == false) ? initiateEndOfTrialsFunction() : initiateEndOfTrialsFunction(threatResponses, nonThreatResponses);
        }    
    };
    
    function calculateScore(threatResponse, nonThreatResponse) {
        var sum = [];
        var average = [];
        var responseArray = [threatResponse, nonThreatResponse];
        
        for (var i = 0; i < responseArray.length; i++) {
            sum[i] = responseArray[i].reduce((a, b) => {return a + b})
            average[i] = sum[i]/responseArray[i].length;  
        };
        
        var userScore = average[0] - average[1];
        displayScoreToUser(userScore.toFixed(0));
        
    };
    
    function displayScoreToUser(userScore) {
        document.getElementById("text2").innerHTML = `Your score is ${userScore} <br><br> A positive score indicates an attentional bias toward positive social cues. Conversely a negative score implies a bias toward negative cues, suggesting that you possibly might be stressed or anxious.<br> It is important to keep in mind that scores over -100 or +100 truly reflect a bias whereas scores closer to zero are less meaningful.<br> To learn more about the science behind the stress tester, click on the info button below!<br> <a href="info.html"><button id="info-button">INFO</button></a>`
    };
    
    function practiceTrialsResponse(arrowPressed) {
        //if the arrow randomly selected is equal to the arrow pressed, correct image is shown otherwise incorrect image is displayed.
        (randomNumber.arrowType === arrowPressed) ? document.getElementById("img" + randomNumber.arrowPosition).src = "IMAGES/correct.png" : document.getElementById("img" + randomNumber.arrowPosition).src = "IMAGES/incorrect.png";
        
        //checks if total trials has been reached, if not, initiates another trial.
        checkTotalNumberOfTrials(initiateTrial, totalPracticeTrials, practiceTrialEnd);
    };
    
    function practiceTrialEnd() {
        document.getElementById("text").innerHTML = "<br>You will now begin the real trials. A pair of faces will flash between the disappearance of the x and the presentation of the arrow. Your objective is still to focus on the x and respond as quickly as possible when the arrow appears. Try your best to ignore the faces.<br><br> Click Start to begin the real trials.";
        document.getElementById("start-real").style.visibility = "visible";
        realTrials = true;
    };
    
    document.getElementById("practice").addEventListener("click", () => {
        document.getElementById("inner-container").style.display = "none";
        document.getElementById("task-table").style.display = "table";
        initiateTrial(practiceTrialsResponse, 100, 500);
    });
    
    document.getElementById("start-real").addEventListener("click", () => {
        resetAllImages();
        document.getElementById("text").style.display = "none";
        document.getElementById("start-real").style.display = "none";
        initiateTrial(realTrialsResponse, 1500, 1500);
    });
    
}());