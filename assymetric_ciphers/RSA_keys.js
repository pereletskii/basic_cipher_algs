import generateLargePrime from "./generate_prime.js";

function modInverse(a, m) {
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
}

function keygen(len=1024) {
    let p = BigInt(generateLargePrime(Math.floor(len / 2)));
    let q = BigInt(generateLargePrime(Math.floor(len / 2)));
    let e = BigInt(65537);
    let n = BigInt(p * q);

    let fi = (p - BigInt(1)) * (q - BigInt(1));
    let d = modInverse(e, fi);

    return { publicKey: [e.toString(36), n.toString(36)], privateKey: [d.toString(36), n.toString(36)] };
}

export default keygen;
