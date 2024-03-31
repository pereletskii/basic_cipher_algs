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
// TODO преборазовать из двоичного в десятичный вид (блоками по 8 бит)
    return strNum
}

function F(r, key){
    var Fi = xor(r, key);
    console.log(Fi);
    for (let i = Fi.length - 1; i >= 0; i--) {
        Fi[i] = outTable[Fi[i]][i];
    }

    cyclicShift(Fi);

    return
}

function cipher(str, key){
    str = toBytesArray(stringFormat(str));
    var lSubstring = [];
    var rSubstring = [];
    for (let i = 0; i < str.length; i += 8) {
        lSubstring.push(str.slice(i, i + 4));
        rSubstring.push(str.slice(i + 4, i + 8));
    }
    console.log(lSubstring[0], rSubstring[0]);
    F(rSubstring[0], key[0]);
// TODO xor для левого подблока
// TODO остальные циклы
}

function decipher(){
// TODO расшифровка
}

gostCipher('-s', 'одиндватричетырепятьшестьсемьвос', 'абвгдежзийклмнопрстуфхцчшщъыьэюя');