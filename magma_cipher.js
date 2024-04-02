import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import * as bitwise from 'bitwise';
import { mod } from 'mathjs';

var text = fs.readFileSync('magma_substitution_table.txt', 'utf8');
var table = text.split('\n');

var outTable = [];
for (let i = 0; i < table.length; i++) {
    if (i % 8 == 0){
        outTable.push([]);
    }

    var byteNum = bitwise.byte.read(parseInt(table[i])).slice(4, 8);
    outTable[parseInt(i / 8)].push(byteNum);
}

function keygen(key){
    key = strToBits(formatString(key, 256, 256), 32, false);
    return key
}

 function formatString(str, bits, lim = undefined){
    var n = bits / 8;
    if (str.length % n != 0) {
        str += ' '.repeat(n - str.length % n);
    }
    if (lim != undefined) {
        str = str.slice(0, lim / 8);
    }
    return str;
 }

function strToBits(str, lim, reverse=true){
    var buf = Buffer.from(str, 'binary');
    console.log(buf);
    switch (reverse) {
        case true:
            var strBinary = bitwise.buffer.read(buf, 0).reverse();
        case false:
            var strBinary = bitwise.buffer.read(buf, 0);
    }
    var binaries = [];

    for (let i = 0; i < strBinary.length; i+=lim) {
        binaries.push(strBinary.slice(i, i+lim));
    }
    
    return binaries;
}

function sumMod232(l, r){
    var len = l.length;
    var sum = Array(len).fill(0);

    l = parseInt(bitwise.bits.toString(l), 2);
    r = parseInt(bitwise.bits.toString(r), 2);

    sum = bitwise.string.toBits(mod(l + r, 2**32).toString(2));
    if (sum.length > len) {
        sum = sum.slice(sum.length - len);
    } else if (sum.length < len) {
        sum = Array(len - sum.length).fill(0).concat(sum);
    }

    return sum
}

function f(subBytes, key){
    subBytes = sumMod232(subBytes, key);

    for (let i = 0; i < subBytes.length; i+=4) {
        var tmp = subBytes.slice(i, i+4);
        var tmpDecimal = parseInt(bitwise.bits.toString(tmp), 2);

        tmp = outTable[tmpDecimal][i / 4];

        for (let j = 0; j < tmp.length; j++) {
            subBytes[i + j] = tmp[j];            
        }
    }

    return bitwise.bits.circularShiftLeft(subBytes, 11);
}

function round(l, r, key, i=0, j){
    var l1, r1, n;
    if (i < j) {
        n = i % 8;
    } else if (i == 32){
        return l.concat(r);
    }
    else {
        n = 7 - i % 8;
    }

    l1 = bitwise.bits.xor(r, f(r, key[n]));
    r1 = l;

    return round(l1, r1, key, i+1, j);
}

function bitsToStr(bits){
    bits.forEach(x => {
        console.log(x.length);
    });

    var fullBits = [];
    for (let i = 0; i < bits.length; i++) {
        fullBits = fullBits.concat(bits[i]);
    }
    
    fullBits = bitwise.buffer.create(fullBits.reverse());
    console.log(fullBits);
    return fullBits.toString('binary');
}

function encrypt(str, key, j=24){
    str = strToBits(formatString(str, 64), 64);
    for (let i = 0; i < str.length; i++) {
        str[i] = round(str[i].slice(0, 32), str[i].slice(32, 64), key, 0, j);
    }
    return bitsToStr(str);
}
function decrypt(str, key){
    return encrypt(str, key, 8);
}

function gostCipher(type, str, key){
    key = keygen(key);
    switch (type){
        case '-s':
            var out = encrypt(str, key);
            break;
        case '-r':
            var out = decrypt(str, key);
            break;
    }
    return out
}

var key = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
var msg = 'одиндватодиндват';

var encrypted = gostCipher('-s', msg, key);
console.log(`Выходной текст: '${encrypted}'\n`);

var decrypted = gostCipher('-r', encrypted, key);
console.log(`Выходной текст: '${decrypted}'\n`);

console.log(sumMod232([1,1,1,1], [1,1,0,1]))

console.log(Buffer.from('жопа').toString());