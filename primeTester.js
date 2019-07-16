'use strict';

const request = require('request');

const primeNthLocations = [
  1000000, // millionth prime number -> should NOT come back first
  10000,
  1000,
  100,
  10,
  1,
];

// non-blocking way
// primeNthLocations.forEach((val, i) => {
//   request.get(`http://localhost:3000/nthprimeasync/${val}`, function (error, response, body) {
//     if (error || (!response)) {
//       process.stdout.write(error || 'error happened');
//     } else {
//       process.stdout.write(body);
//       process.stdout.write('\n');
//     }
//   });
// });

// blocking way
primeNthLocations.forEach((val, i) => {
  request.get(`http://localhost:3000/nthprime/${val}`, function (error, response, body) {
    if (error || (!response)) {
      process.stdout.write(error || 'error happened');
    } else {
      process.stdout.write(body);
      process.stdout.write('\n');
    }
  });
});