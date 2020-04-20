//nested array containing goals for 1, 2, 3 and backs (at index 0)
var allGoals = [
  [],
  [],
  [],
  []
];
var allGoalsText = [];

//stores goals for this game
var goal1;
var goal2;
var goal3;

//decks for this game
var deck1 = [];
var deck2 = [];
var deck3 = [];
var thisDeck1 = [];
var thisDeck2 = [];
var thisDeck3 = [];

//var canTogglePirateAsteroid = true;
//var pirateStatus = false;
//var asteroidStatus = false;

//ensures that decks are not re-selected mid-game
var selector = [0, 1, 2];
var deck1Status = false;
var deck2Status = false;
var deck3Status = false;
var readyToPlay = false;

//dictionary containing all system cards,
//labeled by their initials
//asteroid and pirates are separate
var allSystems = {};
var systemBack;
var asteroid;
//var asteroidIcon; //for the button
var pirate;
//var pirateIcon; //for the button

//scaling and decorations
var padding = 10;
var logo;
var cardX = [];
var cardY = [];
var cardLong;
var cardShort;
var deckNumSize;
var goalNumSize;
//var buttonSize;
//var buttonY;

// preload all assets for quicker gameplay
function preload() {
  logo = loadImage('assets/logo_small.png');
  asteroidIcon = loadImage('assets/asteroid-icon.png');
  pirateIcon = loadImage('assets/pirate-icon.png');
  loadGoalCards();
  loadSystemCards();
}
function loadGoalCards() {
  // Load goal cards and backs. Backs are at index 0
  for (let i = 1; i < 4; i++) {
    allGoals[0].push(loadImage('assets/goals/backs/' + i + '-back.png'));
    allGoals[1].push(loadImage('assets/goals/cards/1-' + i + '.png'));
    allGoals[2].push(loadImage('assets/goals/cards/2-' + i + '.png'));
    allGoals[3].push(loadImage('assets/goals/cards/3-' + i + '.png'));
  }
  allGoalsText.push(
    ['+1 starship multiplier',
     '+1 free starship upgrade',
     '+1 free starship upgrade']);
  allGoalsText.push(
    ['+1 credits from piracy',
     '-1 upgrade cost for one good',
     '-1 upgrade cost for two goods']);
  allGoalsText.push(
    ['+1 starship upgrade space',
     '-1 upgrade cost for starship',
     '+1 upgrade space on two goods']);
}
function loadSystemCards() {
  // load system cards
  systemBack = loadImage('assets/systems/back.png');
  asteroid = loadImage('assets/systems/asteroid.png');
  pirate = loadImage('assets/systems/pirates.png');
  allSystems = {
    'AO': loadImage('assets/systems/AO.png'),
    'AR': loadImage('assets/systems/AR.png'),
    'CH': loadImage('assets/systems/CH.png'),
    'CO': loadImage('assets/systems/CO.png'),
    'FC': loadImage('assets/systems/FC.png'),
    'FP': loadImage('assets/systems/FP.png'),
    'GW': loadImage('assets/systems/GW.png'),
    'LA': loadImage('assets/systems/LA.png'),
    'LM': loadImage('assets/systems/LM.png'),
    'MB': loadImage('assets/systems/MB.png'),
    'MS': loadImage('assets/systems/MS.png'),
    'OP': loadImage('assets/systems/OP.png'),
    'SB': loadImage('assets/systems/SB.png'),
    'SS': loadImage('assets/systems/SS.png'),
    'SD': loadImage('assets/systems/SD.png'),
    'SY': loadImage('assets/systems/SY.png'),
    'WG': loadImage('assets/systems/WG.png'),
    'DS': loadImage('assets/systems/DS.png'),
  };
}

// set sizing of everything based on screen size
//add decorations.
function scaling() {
  cardShort = (height - 5 * padding) / 4.7;
  cardLong = 1.4 * cardShort;
  var x = width / 2 - (cardShort + cardLong) / 2 - 4 * padding;
  var y = 2 * padding + cardShort;
  for (let i = 0; i < 3; i++) {
    cardX.push(x);
    x += 4 * padding + (cardLong + cardShort) / 2;
    cardY.push(y);
    y += padding + cardLong;
  }
  deckNumSize = cardLong / 6;
  goalTextSize = deckNumSize/2;
  //buttonSize = height - cardY[2] - cardShort/2 - 2*padding;
  //buttonY = height/2 + cardY[2]/2 + cardShort/4 - padding/2;
}
function decorate() {
  //set up tabletop
  background(242);
  fill(15, 17, 30);
  rect(width / 2, height / 2,
    width - 2 * padding, height - 2 * padding, padding);
  var logoHeight = cardShort / 2;
  var logoWidth = 3.45 * logoHeight;
  image(logo, cardX[0] - logoWidth / 2, padding,
    logoWidth, logoHeight);

  //goal card backs
  for (let i = 0; i < 3; i++) {
    image(allGoals[0][i],
      cardX[0] - cardLong / 2, cardY[i] - cardShort / 2,
      cardLong, cardShort);
  }
}

function setup() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();
  if (windowHeight < windowWidth) {
    createCanvas(windowHeight, windowHeight);
  } else {
    createCanvas(windowWidth, windowWidth);
  }
  scaling();
  decorate();
}

function mousePressed() {
  // logic for making the decks at the start of the game
  if (!deck1Status &&
    mouseX < cardX[0] + cardLong / 2 && mouseX > cardX[0] - cardLong / 2 &&
    mouseY < cardY[0] + cardShort / 2 && mouseY > cardY[0] - cardShort / 2) {
    makeDeck1();
  }
  if (!deck2Status &&
    mouseX < cardX[0] + cardLong / 2 && mouseX > cardX[0] - cardLong / 2 &&
    mouseY < cardY[1] + cardShort / 2 && mouseY > cardY[1] - cardShort / 2) {
    makeDeck2();

  }
  if (!deck3Status &&
    mouseX < cardX[0] + cardLong / 2 && mouseX > cardX[0] - cardLong / 2 &&
    mouseY < cardY[2] + cardShort / 2 && mouseY > cardY[2] - cardShort / 2) {
    makeDeck3();

  }
  //once all three goal cards are selected,
  //make a deck of event cards to shuffle into the piles
  if (!readyToPlay && deck1Status && deck2Status && deck3Status) {
    makeEventDeck();
  }

  //logic for revealing top card from each pile
  //will also reshuffle when the piles are empty
  if (readyToPlay) {
    if (mouseX > cardX[1] - cardShort / 2 &&
      mouseX < cardX[1] + cardShort / 2 &&
      mouseY > cardY[0] - cardLong / 2 &&
      mouseY < cardY[0] + cardLong / 2) {
      if (thisDeck1.length > 0) {
        let thisCard1 = thisDeck1.pop()
        image(thisCard1,
          cardX[2] - cardShort / 2, cardY[0] - cardLong / 2,
          cardShort, cardLong);
      } else {
        thisDeck1 = shuffleTheDeck(deck1);
        fill(15, 17, 30);
        rect(cardX[2], cardY[0], cardShort+2, cardLong+2);
      }
      updateCardNum(0, thisDeck1.length);
    }
  }

  if (readyToPlay) {
    if (mouseX > cardX[1] - cardShort / 2 &&
      mouseX < cardX[1] + cardShort / 2 &&
      mouseY > cardY[1] - cardLong / 2 &&
      mouseY < cardY[1] + cardLong / 2) {
      if (thisDeck2.length > 0) {
        let thisCard2 = thisDeck2.pop()
        image(thisCard2,
          cardX[2] - cardShort / 2, cardY[1] - cardLong / 2,
          cardShort, cardLong);
      } else {
        thisDeck2 = shuffleTheDeck(deck2);
        fill(15, 17, 30);
        rect(cardX[2], cardY[1], cardShort+2, cardLong+2);
      }
      updateCardNum(1, thisDeck2.length);
    }
  }
  
  if (readyToPlay) {
    if (mouseX > cardX[1] - cardShort / 2 &&
      mouseX < cardX[1] + cardShort / 2 &&
      mouseY > cardY[2] - cardLong / 2 &&
      mouseY < cardY[2] + cardLong / 2) {
      if (thisDeck3.length > 0) {
        let thisCard3 = thisDeck3.pop()
        image(thisCard3,
          cardX[2] - cardShort / 2, cardY[2] - cardLong / 2,
          cardShort, cardLong);
      } else {
        thisDeck3 = shuffleTheDeck(deck3);
        fill(15, 17, 30);
        rect(cardX[2], cardY[2], cardShort+2, cardLong+2);
      }
      updateCardNum(2, thisDeck3.length);
    }
  }

  /*
  // logic for toggling pirates and asteroids on and off
  if (canTogglePirateAsteroid) {
    if (mouseX > cardX[0] - (3/2)*buttonSize &&
        mouseX < cardX[0] - buttonSize/2 &&
        mouseY > buttonY - buttonSize/2 &&
        mouseY < buttonY + buttonSize/2) {
      pirateStatus = !pirateStatus
    }
    if (mouseX > cardX[0] + buttonSize/2 &&
        mouseX < cardX[0] + (3/2)*buttonSize &&
        mouseY > buttonY - buttonSize/2 &&
        mouseY < buttonY + buttonSize/2) {
      asteroidStatus = !asteroidStatus
    }
  }
  */
}

//buttons for toggling pirates and asteroids
/*
function draw() {
  //pirates
  if (!pirateStatus) {
    fill(255);
  } else {
    fill(217, 21, 21);
  }
  rect(cardX[0] - buttonSize, buttonY,
       buttonSize, buttonSize, padding);
  image(pirateIcon,
        cardX[0] - (3/2)*buttonSize, buttonY - buttonSize/2,
        buttonSize, buttonSize);
  //asteroids
  if (!asteroidStatus) {
    fill(255);
  } else {
    fill(217, 21, 21);
  }
  rect(cardX[0] + buttonSize, buttonY,
       buttonSize, buttonSize, padding);
  image(asteroidIcon,
        cardX[0] + buttonSize/2, buttonY - buttonSize/2,
        buttonSize, buttonSize);
}
*/

function makeDeck1() {
  deck1Status = true;
  goal1 = random(selector);
  image(allGoals[1][goal1],
    cardX[0] - cardLong / 2, cardY[0] - cardShort / 2,
    cardLong, cardShort);
  //make the deck based on the goal card that was drawn
  if (goal1 == 0) {
    deck1.push(allSystems.DS);
    deck1.push(allSystems.DS);
    deck1.push(allSystems.SS);
    deck1.push(allSystems.SS);
    deck1.push(allSystems.SS);
  } else if (goal1 == 1) {
    deck1.push(allSystems.CH);
    deck1.push(allSystems.CH);
    deck1.push(allSystems.WG);
    deck1.push(allSystems.WG);
    deck1.push(allSystems.WG);
  } else {
    deck1.push(allSystems.MB);
    deck1.push(allSystems.MB);
    deck1.push(allSystems.OP);
    deck1.push(allSystems.OP);
    deck1.push(allSystems.OP);
  }
  fill(255);
  textSize(goalTextSize);
  textAlign(CENTER, CENTER);
  text(allGoalsText[0][goal1],
       cardX[0], cardY[0] + cardShort/2 + goalTextSize);
}
function makeDeck2() {
  deck2Status = true;
  goal2 = random(selector);
  image(allGoals[2][goal2],
    cardX[0] - cardLong / 2, cardY[1] - cardShort / 2,
    cardLong, cardShort);
  if (goal2 == 0) {
    deck2.push(allSystems.CO);
    deck2.push(allSystems.CO);
    deck2.push(allSystems.FC);
    deck2.push(allSystems.FC);
    deck2.push(allSystems.FC);
    //special requirement to include pirate card for this goal
    deck2.push(pirate);
  } else if (goal2 == 1) {
    deck2.push(allSystems.LA);
    deck2.push(allSystems.LA);
    deck2.push(allSystems.LA);
    deck2.push(allSystems.LM);
    deck2.push(allSystems.LM);
  } else {
    deck2.push(allSystems.AO);
    deck2.push(allSystems.FP);
    deck2.push(allSystems.FP);
    deck2.push(allSystems.FP);
    deck2.push(allSystems.FP);
  }
  fill(255);
  textSize(goalTextSize);
  textAlign(CENTER, CENTER);
  text(allGoalsText[1][goal1],
       cardX[0], cardY[1] + cardShort/2 + goalTextSize);
}
function makeDeck3() {
  deck3Status = true;
  goal3 = random(selector);
  image(allGoals[3][goal3],
    cardX[0] - cardLong / 2, cardY[2] - cardShort / 2,
    cardLong, cardShort);
  if (goal3 == 0) {
    deck3.push(allSystems.AR);
    deck3.push(allSystems.AR);
    deck3.push(allSystems.AR);
    deck3.push(allSystems.MS);
    deck3.push(allSystems.MS);
  } else if (goal3 == 1) {
    deck3.push(allSystems.GW);
    deck3.push(allSystems.GW);
    deck3.push(allSystems.SB);
    deck3.push(allSystems.SB);
    deck3.push(allSystems.SB);
  } else {
    deck3.push(allSystems.SY);
    deck3.push(allSystems.SY);
    deck3.push(allSystems.SY);
    deck3.push(allSystems.SY);
    deck3.push(allSystems.SD);
  }
  fill(255);
  textSize(goalTextSize);
  textAlign(CENTER, CENTER);
  text(allGoalsText[2][goal1],
       cardX[0], cardY[2] + cardShort/2 + goalTextSize);
}
function makeEventDeck() {
  var eventDeck = [];
  for (let i = 0; i < 3; i++) {
    eventDeck.push(asteroid);
    eventDeck.push(pirate);
  }
  //shuffle event cards and deal one into each deck
  //ignore deck2 for goal card 2-1
  shuffle(eventDeck);
  deck1.push(eventDeck[0]);
  if (goal2 != 0) {
    deck2.push(eventDeck[1]);
  }
  deck3.push(eventDeck[2]);

  thisDeck1 = shuffleTheDeck(deck1);
  thisDeck2 = shuffleTheDeck(deck2);
  thisDeck3 = shuffleTheDeck(deck3);

  //place a facedown systems card to indicate readiness
  for (let i = 0; i < 3; i++) {
    image(systemBack,
      cardX[1] - cardShort / 2, cardY[i] - cardLong / 2,
      cardShort, cardLong);
    updateCardNum(i, '6');
  }
  readyToPlay = true;

}
function shuffleTheDeck(x) {
  //shuffles a deck
  return shuffle(x);
}
function updateCardNum(whichDeck, num) {
  fill(51);
  square(cardX[1], cardY[whichDeck] + (cardLong - deckNumSize) / 2,
    deckNumSize, deckNumSize / 5);
  fill(245, 245, 237);
  textSize(0.9 * deckNumSize);
  text(num, cardX[1], cardY[whichDeck] + (cardLong - deckNumSize) / 2);
}
