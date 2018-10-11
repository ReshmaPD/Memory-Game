/* ---------------------------------------------------------------------------------------------------------------------------------------------------- */
/*------------------------------------------------------DECLARATIONS-----------------------------------------------------------------------------------*/
/* ---------------------------------------------------------------------------------------------------------------------------------------------------- */

// DECK - This refers to the <ul> that holds all the <li> element with the class card
const deck = document.getElementById("card-deck");
const container = document.querySelector("#card-deck");
const matches = container.querySelectorAll("li.card");
let cardDeck = [...matches];
const boxCard = document.getElementsByClassName('card');

//Our clicked cards get stored in this array to check for matching and unmatching only two at a time
let clickedCards = [];

// Our matched cards get stored in this
let matchedCards = [];

// For the moves a player makes
let moves = 0;

//STARTS - Select star content and its icons
const starIcons = document.querySelectorAll(".fa-star");

//For Modal popup
const cancelIcon = document.getElementById("modal_cancel");
const closeButton = document.getElementsByClassName("modal_button modal_replay");
const modal = document.getElementById("popup");

//All time declartions
let time = 0;
let TimerInterval;

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------Functions----------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//When the page is loaded call the function startgame()
document.body.onload = startGame();
/**
 * TODO:function to Shuffle the provided deck of cards
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*- shuffle the list of cards using the provided "shuffle" method above
 * - loop through each card and create its HTML
 * - add each card's HTML to the page
 * -TODO:Shuffle the provided deck of cards and append those cards to the icons of existing card deck which is acheived by first clearing the decks-
 * innerHTML and then appending the shuffledcards to the deck. Also removed the classes of open and show, match and disable-click whenever playagain and
 * restart button is clicked.efore begining of the starGame() ,classes match and disable click are removed from the carddeck array conatining all the cards, this
 * is because, when we click the restart button or replay button, the classes can be triggered when clicked after restart has they have not been
 * reseted only matched cards is cleared.
 */
function shuffleDeckReset() {
    const shuffledCards = shuffle(cardDeck);
    for (let i = 0; i < shuffledCards.length; i++) {
        deck.innerHTML = "";
        cardDeck.forEach.call(shuffledCards, function (item) {
            deck.appendChild(item);

        });
        cardDeck[i].classList.remove("show", "open", "match", "disable-click");
    }
}

/*@description Intialize game -Reset moves, stars, card classes
*this function is needed for whenever the html body loads to call for actions such as shuffling of cards which is called using shuffledeck()
*moves played is reseted to 0 for whenever the restart logo is clicked or if through popup player chooses to play again, that is why we have to
not only reset the moves but also the star rating.- reseting moves is simply obtained by setting it to 0 and then replacing the content using the.innerhtml
*property, the star rating is reset by targeting its icons in the .fa-star class , as we can now choose to display all three stars using for loop and
setting the display property, finally all the matched cards which are contained in an array is also emptied
*/
function startGame() {

    /**TODO: RESET ALL CARDS CLASSES , ARRAYS,MOVES , STAR RATING
    *setting clickedCard[] array to empty array is very important steps to overcome a rather unidentifiable bug. This situation arises when a player on any given time
    clicks on only one card and press the restart button, as the clickedcard array is global variable, not resetting it here cause it to be not empty when the user
    restarts the game, thus the next card clicked is considered the second card in the array and the whole program execution is interrupted and random cards toggle classes
    open and show.
    */
    clickedCards = [];
    shuffleDeckReset();


    // reset moves by selecting the moves class , initialize it zero and put that value using innerHTML
    const movesPlayed = document.querySelector('.moves');
    moves = 0;
    movesPlayed.innerHTML = moves;

    // reset star rating by selecting each star icon and giving it a display property
    for (var i = 0; i < starIcons.length; i++) {
        starIcons[i].style.display = 'block';
    }

    //all the cards that are matched will be emptied out
    matchedCards = [];
}

/*@description -Display time in the scoreboard using template literals(ES6).
 *@param- timer, seconds,minutes
 */
function displayTime() {
    //selecting the timer class and replacing its content using innerhtml while also displaying time with append to zero secs
    const timer = document.querySelector('.timer');
    const minutes = Math.floor(time / 60); //where the number 60 represents 1minute in seconds
    const seconds = time % 60;
    /*the value 10 is important. if we want to append 0 to seconds value less than 10.default it concatenates the values of seconds and minutes obtained by the timerinterval()
     *which is first calulated to integar value using javascripts inbuilt math.floor method*/
    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

// startTimer Function every one seconds is recorded as we have set the interval to 1sec
function startTimer() {
    TimerInterval = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}
/*- display the card's symbol (put this functionality in another function that you call from this one) */
function cardClick() {
    this.classList.toggle("open");
    this.classList.toggle("show");
}
/*- add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) */
function tempCards() {
    clickedCards.push(this);
    if (clickedCards.length === 1) {
        clickedCards[0].classList.add("disable-click"); //to avoid double clicking the card
    }
    /*- if the list already has another card, check to see if the two cards match */
    else if (clickedCards.length === 2) {
        addMove();
        checkScore();
        clickedCards[0].classList.remove("disable-click"); //to make it avaible to check for matching in the checkmatch function
        checkMatch();
    } else {
        console.log("executed tempcards() function");
    }

}
/*@description check the matching of two cards clicked by the player
*@param clickedcards[], to compare its cards value
*@return matchedcard[]is pushed the vakues if cards matched.
/*+ if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*if(clickedCards[0].innerHTML === clickedCards[1].innerHTML) this can also be used to check the cards for matching but the firstelement child gave me
better specificity in achieving.
* */
function checkMatch() {
    if (clickedCards[0].firstElementChild.className === clickedCards[1].firstElementChild.className) {
        clickedCards[0].classList.add("match", "disable-click"); // if clickedcards array elements are same add a css match class to it and disable clicks on it
        clickedCards[1].classList.add("match", "disable-click");
        matchedCards.push(clickedCards[0]); // if clickedcards match put the cards in a matched array
        matchedCards.push(clickedCards[1]);
        clickedCards = []; // after putting the cards in the matched array clear the clickedcards array
    } else {
        unmatched();
    }
}
/*+ if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) */
function unmatched() {
    disableClick();
    setTimeout(() => {
        clickedCards[0].classList.toggle("open");
        clickedCards[0].classList.toggle("show");
        clickedCards[1].classList.toggle("open");
        clickedCards[1].classList.toggle("show");
        enableClick();
        clickedCards = [];
    }, 750);
}

/*TODO:TOGGLE MOUSE POINTER EVENTS FOR EVENTLISTNER DISABLING
*disableclick and enableclick is used so that while clicking, all the cards are disable when one click is activated
* to avoid opening multiple cards which makes things messy. I did think of and ried to provide a function whuch triggers the removeEventListener while
the cards are unmatched and when the cards match, but utlimately felt that using the CSS mouse pointer property to enable and disable clicks was a much better
*way and have me the desired results to only listen for one clicks and disable them and once matched disable the cards for further click events.
*/

function disableClick() {
    cardDeck.forEach.call(cardDeck, function (boxCard) {
        boxCard.classList.add('disable-click');
    });
}

function enableClick() {
    cardDeck.forEach.call(cardDeck, function (boxCard) {
        boxCard.classList.remove('disable-click');
        for (var i = 0; i < matchedCards.length; i++) {
            matchedCards[i].classList.add("disable-click");
        }
    });
}

/* TODO:+ increment the move counter and display it on the page (put this functionality in another function that you call from this one)*/
/*@description to add moves counter which will trigger the timer function to record the time the player makes to match all cards this is triggered
only if the player makes one complete move and not when clicking one card */
function addMove() {
    moves++;
    const movesPlayed = document.querySelector('.moves');
    movesPlayed.innerHTML = moves;
    //after a player akes a move a timer is started by calling function starttimer()
    if (moves == 1) {
        startTimer();
    }
}

/*TODO:a checkscore function based on number of moves made by player accordingly the stars will be updated
 *@description a checkScore() is introduced to display star according to the moves player had made, since atleast one star has to
 * be displayed out of the three a Switch case is a better fit then if else, the workaround was made such that for each of the star icon if star icon
 *is hidden from right to left.For 8 moves a star[2] is hidden  to display 2 stars, and star[1] is hidden for 16 moves maded by the player to display
 *a rating of one star
 */
function checkScore() {
    switch (moves) {
        case 8:
            for (i = 0; i < 3; i++) {
                if (i > 1) {
                    starIcons[i].style.display = 'none';
                }
            }
            break;
        case 16:
            for (i = 0; i < 3; i++) {
                if (i > 0) {
                    starIcons[i].style.display = 'none';
                }
            }
            break;
    }
}

/*This function is called when the modals x mark is clicked which hides the modal and lets the user see his game */
function closePopup() {
    modal.classList.toggle("hide");
    disableClick(); //so the player can only see the game with all matched cards and can't click on it. the restart button is still accessble to restart the game
}
/*TODO:
 *@description :To store a number of stars visible and show that in the popup
 *@return starcounter to store the star rating
 */
function getStars() {
    stars = document.querySelectorAll('.stars li'); //selects the li elements with the class stars
    starCount = 0;
    for (i = 0; i < 3; i++) {
        if (starIcons[i].style.display !== 'none') {
            starCount++; //for every star icon which has its display show count it and return that value in number which will then be used to display in modal popup
        }
    }
    return starCount;
}

/*function to stop the Timer*/
function stopTimer() {
    clearInterval(TimerInterval);
}

//TODO: Triggered when function clicks the play again button in the modal
function playAgain() {
    modal.classList.toggle("hide");
    stopTimer();
    time = 0;
    displayTime();
    startGame();
}

/*@description This function is called when the refresh symbol is clicked which resets the game */
function restartAgain() {
    stopTimer();
    time = 0;
    displayTime();
    startGame();
}

/*+ if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*matchedcards[] has 16 cards because we are pushing each individual clickedcard[0] & clickedcard[1] value in it insted of directly pushing two cards at
a time, which will then give us 8 arrays containing two cards so the matchcardlength would be 8 in that case.here the length is 16 has we knwo there are 16 cards total.
*/
function gameEnds() {
    if (matchedCards.length === 16) {
        stopTimer();
        // Toggles the modal
        modal.classList.toggle("hide");

        /*TODO: show the modal and display  message with the final score using template literals.(ES6)
        *declaring const values where using document.queryselector we target the classes of modal elements, we then use the template literal and as the default is concatenation
        of the two, we can display the scoreboard in the modal displayed after gameEnds.To store the current timer of the playing game, we select the innerHTML of the timer class
        that stores the timer at a seconds interval, we are able to select it using the queryselector with innerHTML, simialarly moves and stars declare previously is targeted to
        get the current moves and star ratings, the star rating is displayed as a number which is obtained by getstars() function.
        * */
        const timeStat = document.querySelector('.modal_time');
        const gameTimer = document.querySelector('.timer').innerHTML;
        const moveStat = document.querySelector('.modal_moves');
        const starStat = document.querySelector('.modal_stars');
        const stars = getStars();

        timeStat.innerHTML = `Time = ${gameTimer}`;
        moveStat.innerHTML = `Moves = ${moves}`;
        starStat.innerHTML = `Stars = ${stars}`;
    };
}

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------Function Ends--------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------------------------------------DOM,EVENT-listener-----------------------------------------------------------------------*/
/*
 *TODO: Set up the event listener for a card. If a card is clicked: Display the cards on the page
 * For Each clicks on a Card, the evenlistener will call functions below
 * so the eventlistener listens for click for every cards clicked,so we can say for the array boxcards which has every card class icons,which is targeted till
 * the boxcard length, that eventlistener only listens if the clickedcards array(which is when we click,that card is stored in that array which in the global scope
 * is set to zero),length is less than 2, this is so that only two cards are clicked and pushed and compared for matching which is triggered by cardclick(),tempcards().
 * event listener is also added to listens to the clicks made on the restart icon on the page; play again and close icon in the modal by selecting each of their classes.
 * ----------------------------------------------------------------------------------------------------------------------------------------------------*/

for (var i = 0; i < boxCard.length; i++) {
    if (clickedCards.length < 2) {
        boxCard[i].addEventListener('click', cardClick, false);
        boxCard[i].addEventListener('click', tempCards, false);
        boxCard[i].addEventListener("click", gameEnds, false);
    }
}

document.querySelector('.restart').addEventListener('click', restartAgain, false);
document.querySelector('.modal_replay').addEventListener('click', playAgain, false);
document.querySelector('.modal_cancel').addEventListener('click', closePopup, false);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/