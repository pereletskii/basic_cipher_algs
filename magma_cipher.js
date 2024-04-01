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

function keygen(key){
    return
}

function encrypt(str, key){
    return
}
function decrypt(str, key){
    return
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
var msg = 'одиндватричетырепятьшесемьвосемь';

var encrypted = gostCipher('-s', msg, key);
console.log(`Выходной текст: '${encrypted}'\n`);

var decrypted = gostCipher('-r', encrypted, key);
console.log(`Выходной текст: '${decrypted}'\n`);