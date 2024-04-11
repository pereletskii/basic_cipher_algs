import { getRandomValues } from 'crypto';

function getRandomBigInt(bits) {
  const byteLength = Math.ceil(bits / 8);
  const randomArray = new Uint8Array(byteLength);
  getRandomValues(randomArray);
  return BigInt('0x' + Array.from(randomArray).map(b => b.toString(16).padStart(2, '0')).join(''));
}

function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base %= modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % modulus;
    exponent >>= 1n;
    base = (base * base) % modulus;
  }
  return result;
}

const smallPrimes = [
  2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n
];

function isProbablyPrime(n, k = 5) {
  if (n <= 1n || n === 4n) return false;
  if (n <= 3n) return true;

  // Check for divisibility against the list of small prime numbers
  for (const prime of smallPrimes) {
    if (n === prime) return true;
    if (n % prime === 0n) return false;
  }

  let d = n - 1n;
  while (d % 2n === 0n) d >>= 1n;

  const nMinusOne = n - 1n;
  const nMinusThree = n - 3n;
  const bitLength = n.toString(2).length;

  for (let i = 0; i < k; i++) {
    const a = getRandomBigInt(bitLength) % nMinusThree + 2n;
    let x = modPow(a, d, n);
    if (x === 1n || x === nMinusOne) continue;

    let isComposite = true;
    for (let r = 1n; r < n; r <<= 1n) {
      x = (x * x) % n;
      if (x === nMinusOne) {
        isComposite = false;
        break;
      }
      if (x === 1n) return false;
    }
    if (isComposite) return false;
  }
  return true;
}

function generateLargePrime(numBits) {
  let randomNumber = getRandomBigInt(numBits) | (1n << BigInt(numBits - 1)) | 1n;
  while (!isProbablyPrime(randomNumber)) {
    randomNumber += 2n;
  }
  return randomNumber;
}

export default generateLargePrime;