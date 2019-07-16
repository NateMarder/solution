/* eslint-disable */
'use strict';

//const http = require('http');
const request = require('request');

request.get('http://localhost:3000/nthprime/500000', function (error, response, body) {
  if (error || (!response)) {
    process.stdout.write(error || 'error happened');
  } else {
    process.stdout.write(body);
  }
});
