import * as windows1251 from 'windows-1251';
import fs from 'node:fs';

var text = fs.readFileSync('magma_substitution_table.txt', 'utf8');
var table = text.split('\n');

var outTable = [];
for (let i = 0; i < table.length; i++) {
    if (i % 8 == 0){
        outTable.push([]);
    }
    outTable[parseInt(i / 8)].push(table[i]);
}

function gostCipher(type, str, key){
    key = keygen(key);
    switch (type){
        case '-s':
            cipher(str, key);
            break;
        case '-r':
            break;
    }
}

function toBytesArray(str) {
    return windows1251.encode(str);
}

function keygen(key){
    if (key.length < 32) {
        key += ' '.repeat(32 - key.length);
    } else {
        key = key.slice(0, 32);
    }

    key = toBytesArray(key);
    var subkey = [];
    for (let i = 0; i < key.length; i += 4) {
        subkey.push(key.slice(i, i + 4));
    }

    return subkey;
}

function stringFormat(str){
    if (str.length % 8 != 0){
        str += ' '.repeat(8 - str.length % 8);
    }
    return str
}

function toTetrad(A){
    var tetrads = new Uint16Array(A.length * 2);
    for (let i = 0; i < A.length * 2; i+=2) {
        tetrads[i] = parseInt(A[i/2].toString(2).slice(0, 4), 2);
        tetrads[i+1] = parseInt(A[i/2].toString(2).slice(4, 8), 2);
    }

    return tetrads;
}

function xor(A, X){
    var AnX = new Uint16Array(A.length * 2);
    A = toTetrad(A);
    X = toTetrad(X);

    for (let i = 0; i < A.length; i++) {
        AnX[i] = A[i]^ X[i];
    }
    return AnX
}

function cyclicShift(num){
    var binNum = new Uint16Array(num.length / 2);
    var strNum = '';

    for (let i = 0; i < num.length; i++) {
        var numBytes = num[i].toString(2);
        if (numBytes.length % 4 != 0) {
            strNum += '0'.repeat(4 - numBytes.length % 4);
        }
        strNum += numBytes;
    }

    for (let i = 0; i < 11; i++) {
        strNum = strNum.slice(1) + strNum[0];
    }

    for (let i = 0; i < strNum.length; i+=8) {
        binNum[i/8] = parseInt(strNum.slice(i, i + 8), 2); 
    }

    return binNum
}

function F(r, key){
    var Fi = xor(r, key);
    for (let i = Fi.length - 1; i >= 0; i--) {
        Fi[i] = outTable[Fi[i]][i];
    }

    return cyclicShift(Fi)
}


function round(l, r, key, i = 0){
    var n;
    if (i < 24) {
        n = i % 8;
    } else {
        n = 7 - i % 8;
    }

    var r1 = F(r, key[n]);
    l = r;

    if (i == 31) {
        return [r1, l];
    }

    return round(l, r1, key, (i + 1));
}

function cipher(str, key){
    str = toBytesArray(stringFormat(str));
    var lSubstring = [];
    var rSubstring = [];
    for (let i = 0; i < str.length; i += 8) {
        lSubstring.push(str.slice(i, i + 4));
        rSubstring.push(str.slice(i + 4, i + 8));
    }

    console.log('string:');
    console.log(str);

    var ciphered = new Uint16Array(str.length);
    for (let i = 0; i < lSubstring.length; i++) {
        var cipheredSubstrings = round(lSubstring[i], rSubstring[i], key);
        for (let j = 0; j < 4; j++) {
            ciphered[i * 8 + j] = cipheredSubstrings[0][j];
            ciphered[i * 8 + j + 4] = cipheredSubstrings[1][j];
        }
    }

    console.log('ciphered string:');
    console.log(ciphered);
}

function decipher(){
// TODO расшифровка
}

gostCipher('-s', 'одиндватричетырепятьшестьсемьвос', 'абвгдежзийклмноп');