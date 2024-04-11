import generateLargePrime from "./generate_prime.js";
import { modInv } from "bigint-mod-arith";

function gcd(a, m){
  const s = []
    let b = m
    while(b) {
      [a, b] = [b, a % b]
      s.push({a, b})
  }

  return s[s.length - 1].a
}

/* function modInverse(a, m) {
    a = (a % m + m) % m
    // find the gcd
    const s = []
    let b = m
    while(b) {
      [a, b] = [b, a % b]
      s.push({a, b})
    }
    // find the inverse
    let x = BigInt(1)
    let y = BigInt(0)
    for(let i = s.length - 2; i >= 0; --i) {
      [x, y] = [y,  x - y * (s[i].a / s[i].b)]
    }
    return (y % m + m) % m
} */

function keygen(len=1024) {
    let p = generateLargePrime(len);
    let q = generateLargePrime(len);
    
    while (p == q){
      p = generateLargePrime(len);
      q = generateLargePrime(len);
    }

    let n = BigInt(p * q);
    
    let e, fi, d
    let i = 3;

    while (true){
      fi = (p - BigInt(1)) * (q - BigInt(1));
      e = BigInt(i);
      if (gcd(e, fi) == 1){
        d = modInv(e, fi);
        break;
      }
      i += 1;
    }

    // console.log(e, p, q, fi, n, d, n)
    return { publicKey: [e, n], privateKey: [d, n] };
}

export default keygen;
