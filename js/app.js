/*  
 * The foundation of this JavaScript code was based upon Udacity's "FEND P3 Memory Game with Mike Wales" webinar.
 * 
 */


// Global variables
let moveCounter = document.querySelector('.moves');
let restart = document.querySelector('.restart');
let winner = document.querySelector('.container');
let moves = 0;
let timerFix1 = null;
let timerFix2 = null;
let numStars = document.querySelector('.stars');
let startTimestamp = moment().startOf("day");
let endTimestamp = moment().startOf("day");
let flippedCard = [];
let matchCount = 0;
let clickSnd = new Audio("./audio/click.wav"); // Sound clip from http://www.pachd.com/sounds.html royalty free
let matchSnd = new Audio("./audio/matchSnd.mp3"); // Sound clip from http://soundbible.com licensed under CC

// Card list
let cards = ['fa fa-diamond', 'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
    'fa fa-anchor', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-cube', 'fa fa-leaf', 'fa fa-leaf',
    'fa fa-bicycle', 'fa fa-bicycle', 'fa fa-bomb', 'fa fa-bomb',
];



// Call function to initialize game on page load
initGame();
restart.addEventListener('click', restartGame);


// Generate HTML to populate cards
function populateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa fa ${card}"></i></li>`;
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Initialize new game function
function initGame() {
    let deck = document.querySelector('.deck');
    let cardHTML = shuffle(cards).map(function (card) {
        return populateCard(card);
    });
    moves = 0;
    moveCounter.innerText = moves;

    deck.innerHTML = cardHTML.join('');
}


// Restart game function - reloads page quickly from cache
function restartGame() {
    restart.classList.add('rotate');
    setTimeout(function() {
        location.reload(false);
    }, 400);
}


// Restart from modal screen
function replayGame() {
    location.reload(false);
}


// Define allCards variable after initGame function runs, otherwise the class "card" doesn't exist yet.
let cardDeck = document.querySelectorAll('.card');

cardDeck.forEach(function (card) {
    card.addEventListener('click', function (e) {

        startTimer();

        if (card.classList.contains('open') || card.classList.contains('show') || card.classList.contains('match') || flippedCard.length == 2) {} else {
            playSnd(clickSnd);
            flippedCard.push(card);
            card.classList.add('open', 'show');

            if (flippedCard.length == 2) {

                // If the cards match, set classes to match, open, and show
                if (flippedCard[0].dataset.card == flippedCard[1].dataset.card) {
                    flippedCard[0].classList.add('match', 'open', 'show');
                    flippedCard[1].classList.add('match', 'open', 'show');
                    console.log('Tiles Match');

                    flippedCard = [];
                    matchCount += 1;
                    playSnd(matchSnd);

                    // Check for Win!
                    if (matchCount == 8) {
                        win();
                    }

                } else {
                    // If they don't match hide cards
                    setTimeout(hideCard, 1000);
                    console.log('No Match');
                }

                moves += 1;
                moveCounter.innerText = moves;
                adjustStars(moves);
            }
        }
    });
});


// Hide cards
function hideCard() {
    flippedCard.forEach(function (card) {
        card.classList.remove('open', 'show');
    });

    flippedCard = [];
}


// Play sound on card flip and match
function playSnd(sndFile) {
    sndFile.play();
}


// Adjust number of stars based on move count
function adjustStars(moves) {
    if (moves == 13 || moves == 16) {
        numStars.removeChild(numStars.children[0]);
    }
}


// Timer function using moment.js library from http://momentjs.com/ (under MIT license)
function startTimer() {
    timerFix1 = new Date();
    timer = setInterval(function () {
        timerFix2 = new Date();
        if (((timerFix2 - timerFix1) / 1000) >= 0.7) {
            startTimestamp.add(1, 'second');
            if (matchCount < 8) {
                document.querySelector('.timer').innerHTML = startTimestamp.format('mm:ss');
            }
            endTimestamp = startTimestamp;
            timerFix1 = timerFix2;
        }
    }, 1000);
}

// Display winning modal message
function win() {
    let score = document.createElement('p');
    if (moves < 13) {
        winner.innerHTML = `<div class = 'winner'>\
                            <h1>You Won</h1>\
                            <p>You finished in ${moves} moves in a time of ${endTimestamp.format('mm:ss')}!<p>\
                            <p>Awesome! You're a memory master!</p>\
                            <p><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></p>\
                            <p><button id="replay" onclick="replayGame()">Play Again</button></p>\
                            </div>`;
    } else if (moves < 16) {
        winner.innerHTML = `<div class = 'winner'>\
                            <h1>You Won</h1>\
                            <p>You finished in ${moves} moves in a time of ${endTimestamp.format('mm:ss')}!<p>\
                            <p>Good job!</p>\
                            <p><i class="fa fa-star"></i><i class="fa fa-star"></i></p>\
                            <p><button id="replay" onclick="replayGame()">Play Again</button></p>\
                             </div>`;
    } else {
        winner.innerHTML = `<div class = 'winner'>\
                            <h1>You Won</h1>\
                            <p>You finished in ${moves} moves in a time of ${endTimestamp.format('mm:ss')}!<p>\
                            <p>Keep practicing to improve your memory!</p>\
                            <p><i class="fa fa-star"></i></p>\
                            <p><button id="replay" onclick="replayGame()">Play Again</button></p>\
                             </div>`;
    }

    console.log("You Won!");
    let replay = document.querySelector('#replay');
    replay.addEventListener('click', replayGame);

}