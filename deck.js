const shuffle = require('lodash.shuffle');

const ORDEREDCARDS = {
  Two_Clubs: 2,
  Two_Diamonds: 2,
  Two_Hearts: 2,
  Two_Spades: 2,
  Three_Clubs: 3,
  Three_Diamonds: 3,
  Three_Hearts: 3,
  Three_Spades: 3,
  Four_Clubs: 4,
  Four_Diamonds: 4,
  Four_Hearts: 4,
  Four_Spades: 4,
  Five_Clubs: 5,
  Five_Diamonds: 5,
  Five_Hearts: 5,
  Five_Spades: 5,
  Six_Clubs: 6,
  Six_Diamonds: 6,
  Six_Hearts: 6,
  Six_Spades: 6,
  Seven_Clubs: 7,
  Seven_Diamonds: 7,
  Seven_Hearts: 7,
  Seven_Spades: 7,
  Eight_Clubs: 8,
  Eight_Diamonds: 8,
  Eight_Hearts: 8,
  Eight_Spades: 8,
  Nine_Clubs: 9,
  Nine_Diamonds: 9,
  Nine_Hearts: 9,
  Nine_Spades: 9,
  Ten_Clubs: 10,
  Ten_Diamonds: 10,
  Ten_Hearts: 10,
  Ten_Spades: 10,
  Jack_Clubs: 11,
  Jack_Diamonds: 11,
  Jack_Hearts: 11,
  Jack_Spades: 11,
  Queen_Clubs: 12,
  Queen_Diamonds: 12,
  Queen_Hearts: 12,
  Queen_Spades: 12,
  King_Clubs: 13,
  King_Diamonds: 13,
  King_Hearts: 13,
  King_Spades: 13,
  Ace_Clubs: 14,
  Ace_Diamonds: 14,
  Ace_Hearts: 14,
  Ace_Spades: 14,
};

function dealCards() {
  const handA = [];
  const handB = [];
  shuffle(Object.keys(ORDEREDCARDS)).forEach((val, i) => {
    if (i % 2 === 0) {
      handA.push(val);
    } else {
      handB.push(val);
    }
  });
  return { handA, handB };
}

function cardVal(cardKey) {
  return parseInt(ORDEREDCARDS[cardKey]);
}

module.exports = {
  dealCards,
  cardVal,
};
