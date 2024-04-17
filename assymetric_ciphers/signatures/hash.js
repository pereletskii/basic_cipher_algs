import generateLargePrime from '../generate_prime.js';
import { encode } from 'windows-1251';

function hexTostr(hex) {
    let rawText = hex.toString(16).toUpperCase().split('');
    let text = '';

    if (rawText.length % 2 != 0) {
        rawText = [0].concat(rawText);
    }
    
    for (let i = 0; i < rawText.length; i+=2) {
        text += rawText[i] + rawText[i + 1] + ' ';
    }

    return text
}

function strToNums(msg) {
    return encode(msg);
}

function hash(msg, len=16) {
    let p = generateLargePrime(len);
    let q = generateLargePrime(len);
    let n = p*q;

    let h0 = Math.floor(
        Math.random() * 2 ** 10
    );
    let h1;

    msg = strToNums(msg);
    // console.log(`n = ${n}`, `msg = [${msg}]`);

    for (let i = 0; i < msg.length; i++) {
        h1 = ((h0 + msg[i]) ** 2) % Number(n);
        h0 = h1;
    }

    h1 = hexTostr(h1);
    // console.log(`   h1 = ${h1}`);

    return h1;
}

export default hash;

// main();