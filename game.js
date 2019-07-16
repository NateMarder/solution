const storage = require('node-persist');
const generator = require('node-uuid-generator');
const { recursiveWar } = require('./recursiveWar');
const deckUtils = require('./deck');

async function startGame() {
  const id = generator.generate();
  const { handA, handB } = deckUtils.dealCards();

  await storage.setItem(id, {
    recentPot: null,
    battleWinner: null,
    playerOne: {
      deck: handA.length,
      hand: handA,
    },
    playerTwo: {
      deck: handB.length,
      hand: handB,
    },
  });

  return id;
}

function catchGameWinner(handA, handB) {
  if (handA.length === 0) {
    return 'playerTwo';
  } if (handB.length === 0) {
    return 'playerOne';
  }

  return null;
}

async function battle(id) {
  const gameContext = await storage.getItem(id);
  let handA = gameContext.playerOne.hand;
  let handB = gameContext.playerTwo.hand;
  const cardA = handA.splice(0, 1)[0];
  const cardB = handB.splice(0, 1)[0];
  const pot = [];
  let winner = null;

  // basically a coin flip to simulate human-style randomness
  if (Math.random() > .5) {
    pot.push(...[cardA, cardB]);
  } else {
    pot.push(...[cardB, cardA]);
  }

  if (deckUtils.cardVal(cardA) > deckUtils.cardVal(cardB)) {
    handA.push(...pot);
    winner = 'playerOne';
  } else if (deckUtils.cardVal(cardA) < deckUtils.cardVal(cardB)) {
    handB.push(...pot);
    winner = 'playerTwo';
  } else {
    try {
      const warResult = recursiveWar(handA, handB, pot, null);
      winner = warResult.winner;
      handA = warResult.handA;
      handB = warResult.handB;
    } catch (error) {
      console.error(error);
    }
  }

  const gameWinner = catchGameWinner(handA, handB);

  await storage.updateItem(id, {
    winner,
    gameWinner,
    playerOne: {
      deck: handA.length,
      hand: handA,
    },
    playerTwo: {
      deck: handB.length,
      hand: handB,
    },
  });
}

module.exports = {
  startGame,
  battle,
};
