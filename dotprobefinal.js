(function() {
    
    var threatStimuli = ["IMAGES/abz2.jpg", "IMAGES/abz3.jpg", "IMAGES/george2.jpg", "IMAGES/george3.jpg", "IMAGES/james2.jpg", "IMAGES/james3.jpg", "IMAGES/loick2.jpg", "IMAGES/loick3.jpg", "IMAGES/martina2.jpg", "IMAGES/martina3.jpg", "IMAGES/mike2.jpg", "IMAGES/mike3.jpg", "IMAGES/oz2.jpg", "IMAGES/oz3.jpg", "IMAGES/sharmila2.jpg", "IMAGES/sharmila3.jpg"];
    var nonThreatStimuli = ["IMAGES/abz1.jpg", "IMAGES/abz4.jpg", "IMAGES/george1.jpg", "IMAGES/george4.jpg", "IMAGES/james1.jpg", "IMAGES/james4.jpg", "IMAGES/loick1.jpg", "IMAGES/loick4.jpg", "IMAGES/martina1.jpg", "IMAGES/martina4.jpg", "IMAGES/mike1.jpg", "IMAGES/mike4.jpg", "IMAGES/oz1.jpg", "IMAGES/oz4.jpg", "IMAGES/sharmila1.jpg", "IMAGES/sharmila4.jpg"];

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
        // End Timer
        var endTime = new Date().getTime();
        //calculate difference 
        var userResponseTimeInMilliseconds = endTime - startTime;
        
        return userResponseTimeInMilliseconds;
    };
    
    function checkTotalNumberOfTrials(typeOfTrial, trialLength, initiateEndOfTrialsFunction) {
        trialCounter++;
        if (trialCounter < trialLength) {
            if (realTrials) {
                typeOfTrial(realTrialsResponse, 500, 1500);
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
        initiateTrial(realTrialsResponse, 500, 1500);
    });
    
}());