function nextPrime(val) {
  if (val <= 2) {
    return val === 2 ? 3 : 2;
  }

  let i;
  let q;
  do {
    i = 3; // skip numbers 1 and 2
    val += 2; // skip evens
    q = Math.floor(Math.sqrt(val));
    while (i <= q && val % i) {
      i += 2;
    }
  } while (i <= q);
  return val;
}

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

module.exports = {
  getNthPrime
}