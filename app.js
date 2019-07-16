const storage = require('node-persist');
const express = require('express');
const path = require('path');
const wargame = require('./game');

const app = express();

app.use(express.static(__dirname));
app.use('/public', express.static('public'));
const WARPORT = 3000;

app.listen(WARPORT, '127.0.0.1', async () => {
  console.log(`node server listening on port ${WARPORT}`);
  await storage.init({
    dir: path.join(__dirname.concat('/datastore/')),
    expiredInterval: 2 * 60 * 1000, // 2 min
  });
});

/**
 * @description Starts a new game of war and returns the game's id.
 */
app.put('/game', async (req, res) => {
  const id = await wargame.startGame();
  res.send({ id });
});

/**
 * @description Gets the status of the identified game, returning the
 * number of cards each player has in their deck.
 */
app.get('/game/:id', async (req, res) => {
  const pathArray = req.path.split('/');
  const id = pathArray[pathArray.length - 1];
  const data = await storage.getItem(id);
  res.send({
    playerOne: data.playerOne.hand.length,
    playerTwo: data.playerTwo.hand.length,
  });
});

/**
 * @description Runs a battle and resolves any ties. The response should
 * identify the winner, and show the cards each player played as well as
 * their new deck sizes.
 */
app.post('/game/:id/play', async (req, res) => {
  const pathArray = req.path.split('/');
  const id = pathArray[pathArray.length - 2];

  await wargame.battle(id);
  const data = await storage.getItem(id);
  res.send({
    winner: data.winner,
    gameWinner: data.gameWinner,
    playerOne: {
      deck: data.playerOne.hand.length,
      cards: Object.keys(data.playerOne.hand),
    },
    playerTwo: {
      deck: data.playerTwo.hand.length,
      cards: Object.keys(data.playerTwo.hand),
    },
  });
});
