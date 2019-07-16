const deckUtils = require('./deck');

function recursiveWar(handA, handB, pot, winner) {
  // base case: stop when there's an actual winner
  if (winner) {
    return { winner, handA, handB };
  }

  // handB is out of cards
  if (handB.length < 2) {
    pot.push(...handB);
    return recursiveWar(handA.concat(pot), [], [], 'playerOne');
  }

  // handA is out of cards
  if (handA.length < 2) {
    pot.push(...handA);
    return recursiveWar([], handB.concat(pot), [], 'playerTwo');
  }

  // everyone has enough cards, lets do this war
  const [faceDownCardA, cardA] = handA.splice(0, 2);
  const [faceDownCardB, cardB] = handB.splice(0, 2);
  pot.push(...[faceDownCardA, faceDownCardB, cardA, cardB]);

  // playerOne wins the war
  if (deckUtils.cardVal(cardA) > deckUtils.cardVal(cardB)) {
    return recursiveWar(handA.concat(pot), handB, [], 'playerOne');
  }

  // playerTwo wins the war
  if (deckUtils.cardVal(cardA) < deckUtils.cardVal(cardB)) {
    return recursiveWar(handA, handB.concat(pot), [], 'playerTwo');
  }

  // another tie so keep going
  if (deckUtils.cardVal(cardA) === deckUtils.cardVal(cardB)) {
    return recursiveWar(handA, handB, pot, null);
  }
}

module.exports = { recursiveWar };
