import fs from 'node:fs';
import { encode, decode } from 'windows-1251';
import endianness from 'endianness';
import { mod } from 'mathjs';


const text = fs.readFileSync('symmetric_ciphers/magma_substitution_table.txt', 'utf8');
const table = text.split('\n'); // Считывание таблицы замещения в один массив

var substitutionTable = []; // Таблица замещения в байтах
for (let i = 0; i < table.length; i+=8) { // Запись байтов в таблицу замещения
    substitutionTable.push(Buffer.from(table.slice(i, i+8)));
    // Каждая строка из сырой таблицы переводится в буфер байтов и записывается в строку байтовой таблицы
}

function keygen(key){ // Генерация ключа
    let keyBuff = strToBits(key);
    let subKeys = [];

    for (let i = 0; i < 8; i++) {
        subKeys.push(keyBuff.subarray(i*4, (i+1)*4));
    }

    return subKeys;
}

function strToBits(str){ // Формирование байтов из строки
    let buffStr = Buffer.from(encode(str)); // Перевод строки в байты

    endianness(buffStr, buffStr.length); // Реверс байтов из BE в LE

    return buffStr
}

function sumMod32(A, X){ // Сумма по модулю 2^32
    let num = mod(A.readUInt32BE(0) + X.readUInt32BE(0), 2**32);
    // Подстрока и ключ преобразуются в число, складываются и делятся по модулю 2^32
    let bufNum = Buffer.alloc(4); // Создание буфера под число

    bufNum.writeUInt32BE(num, 0); // Запись числа в буфер
    return bufNum
}

function circularShift(str, n){
    for (let i = 1; i < n; i++) {
        str = str.slice(i) + str.slice(0, i);
    }
    return str
}

function f(A, X){
    let sum = sumMod32(A, X); // Сумма подстроки и подключа по модулю 2^32
    let binNum = ''
    for (let i = 0; i < 4; i++) {
        let num = sum[i].toString(2).padStart(8, '0');
        binNum += (
            substitutionTable[parseInt(num.slice(0, 4), 2)][i*2]
                .toString(2).padStart(4, '0') + 
            substitutionTable[parseInt(num.slice(4, 8), 2)][i*2+1]
                .toString(2).padStart(4, '0')
        );
    }

    let newBuff = new Buffer.alloc(4);
    newBuff.writeUInt32BE(
        parseInt(
            circularShift(binNum, 11), 2
        ), 0
    )
    console.log(newBuff);

    return newBuff
}

function xor() {
    // TODO реализовать XOR
}

function round(str, key, n){
    let l, r, l1, r1;
    // TODO реализовать высчитывание i-го подключа n-ой операции

    l = str.subarray(0, 4);
    r = str.subarray(4, 8);
    // TODO реализовать и протестировать раунд
    // l1 = xor(r, f(l, key[i]));
    // r1 = l;
    
    return
}

var key = keygen('testtesttesttesttesttesttesttest');
var str = strToBits('глебглеб');
round(str, key);
// f(str.subarray(0, 4), key[0]);

// map(key, x => {
//     console.log(decode(x));
// })
// console.log(decode(str));