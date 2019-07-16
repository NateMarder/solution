function nextPrime(val) {
  if (val <= 2) {
    return val === 2 ? 3 : 2;
  }
  let i;
  let q;
  do {
    i = 3;
    val += 2;
    q = Math.floor(Math.sqrt(val));
    while (i <= q && val % i) {
      i += 2;
    }
  } while (i <= q);
  return val;
}

/**
 * @description Finds a prime number in the nth location within the
 * the series of all of prime numbers.
 * @param {number} val - Represents the location of the the prime
 * number value we are looking for. If the val is 10 that means
 * we are looking for the 10th prime number.
 */
function getNthPrime(n) {
  let value = 0;
  let result = [];

  for (let i = 0; i < n; i += 1) {
    value = nextPrime(value);
    result.push(value);
  }

  // since 1 isn't a prime we do this little
  // subtraction to make our algorithm work
  return result[n - 1];
}

module.exports = { getNthPrime };
