const storage = require('node-persist');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn, Thread, Worker } = require('threads');

const wargame = require('./game');
const prime = require('./nthPrime');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
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

/**
 * @description for TESTS
 */
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname.concat('/testrunner.html')));
});

/**
 * @description Method for exploring cpu intensive request strategies.
 * Don't do it this way as the event loop will be certainly be blocked.
 */
app.get('/nthprime/:n', (req, res) => {
  try {
    const pathArray = req.path.split('/');
    const n = pathArray[pathArray.length - 1];
    const p = prime.getNthPrime(parseInt(n));
    res.send({
      n,
      output: p,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

/**
 * @description for NON-BLOCKING cpu intensive requests
 * this strategy exposes a single function that lives within
 * a distinct thread which executes the the thread and returns
 * the result asynchronously. See 
 * https://threads.js.org/usage#function-thread for more info.
 */
app.get('/nthprimeasync/:n', async (req, res) => {
  try {
    const pathArray = req.path.split('/');
    const n = pathArray[pathArray.length - 1];
    const fetchPrimeValue = await spawn(new Worker(path.join('/workers/findPrime')));
    const primeVal = await fetchPrimeValue(parseInt(n));
    res.send({
      n,
      output: primeVal,
    });

    setTimeout(() => {
      if (fetchPrimeValue) {
        Thread.terminate(fetchPrimeValue);
      } else {
        throw new Error('fetchPrimeValue doesnt exist');
      };
    }, 0);

  } catch (err) {
    console.error('a fetchPrime error happened:', err);
    res.sendStatus(500);
  } 
});
