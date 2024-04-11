import { sum } from "mathjs";

function randNum(min, max) {
    return Math.floor(Math.random() * max + min);
}

function isPrime(n) {
    if (n === 2) return true;
    if (n % 2 === 0 || n <= 1) return false;
 
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
       if (n % i === 0) return false;
    }
 
    return true;
 }

function coprime(num) {
    let i = 3;
    while (true) {
        if (!isPrime(i)) {
            i++;
        } else if (num % i != 0) {
            break;
        } else {
            i++;
        }
    }
    return i;
}

function keygen(len = 8) {
    let privateKey = [];
    for (let i = 0; i < len; i++) {
        privateKey.push(sum(privateKey) + randNum(1, 5));
    }

    let m, n;
    m = sum(privateKey) + randNum(1, 5);
    n = coprime(m);
    let openKey = [];
    privateKey.map(x => {
        openKey.push((x*n) % m);
    })

    return { openKey: openKey, privateKey: {m: m, n: n, key: privateKey} };
}

export default keygen;
