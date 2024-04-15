import keygen from "./knapsack_keys.js";
import { encode, decode } from 'windows-1251';
import { invmod } from 'mathjs';

function strToBin(str){
    let numsArray = [];
    encode(str).map(x => 
        numsArray.push(x.toString(2).padStart(8, '0'))
    );

    return numsArray;
}

function encryptRound(bin, key){
    let sum = 0;
    for (let i = 0; i < bin.length; i++) {
        if (bin[i] == 1) sum += key[i];
    }

    return sum;
}

function encrypt(str, key) {
    let binArr = strToBin(str);
    for (let i = 0; i < binArr.length; i++) {
        binArr[i] = encryptRound(binArr[i], key);
    }

    return binArr;
}

function decryptRound(num, key) {
    let str = '';

    for (let i = 7; i >= 0; i--) {
        if (num - key[i] >= 0) {
            str += '1';
            num -= key[i];
        } else if (num - key[i] < 0) {
            str += '0';
        } else {
            break;
        }
    }

    return parseInt(
        str.padStart(8, '0')
        .split('')
        .reverse()
        .join(''), 2
    );
}

function decrypt(str, key) {
    let decArr = [];
    let n1 = invmod(key.n, key.m)
    for (let i = 0; i < str.length; i++) {
        decArr.push(
            decryptRound(str[i] * n1 % key.m, key.key)
        );
    }

    return decode(decArr);
}
export { encrypt, decrypt };
/* 
let msg = 'привет';
let key = keygen(8);
let crypted = encrypt(msg, key.openKey);
let encrypted = decrypt(crypted, key.privateKey);

console.log(msg, crypted, encrypted, '\n'); */
