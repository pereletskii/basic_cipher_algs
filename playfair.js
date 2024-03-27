#!/usr/bin/env node

var alphabet = 'abcdefghiklmnopqrstuvwxyz';

function playfair(type, str, key) {
    str = stringFormat(str);
    key = keygen(key);

    switch (type){
        case '-s':
            var result = cipher(str, key);
            console.log(`Выходной текст:\n`, result, '\n');
            break;
        case '-r':
            var result = decipher(str, key);
            console.log(`Выходной текст:\n`, result, '\n');
            break;
    }
}

function keygen(key) {
    var matrix = [[],[],[],[], []];
    key = key.toLowerCase();

    var uniqeKey = '';
    for (let i = 0; i < key.length; i++) {
        if (key[i] === 'j') {
            if (uniqeKey.indexOf('i') == -1) {
                uniqeKey += 'i';
            }
        } else if (uniqeKey.indexOf(key[i]) == -1) {
            uniqeKey += key[i];
        }
    }

    for (let i = 0; i < uniqeKey.length; i++) {
        matrix[Math.floor(i/5)].push(uniqeKey[i]);
    }

    var stopPoint = uniqeKey.length;
    var j = 0;
    while (j < 25) {
        if (uniqeKey.indexOf(alphabet[j]) == -1) {
            matrix[Math.floor(stopPoint/5)].push(alphabet[j]);
            j++;
            stopPoint++;
        } else {
            j++;
            continue;
        }
    }
    console.log(`Матрица с ключевым словом '${uniqeKey}:'\n`, matrix, '\n');

    return matrix;
}

function stringFormat(str){
    var newString = str.replace(/\s/g, "").toLowerCase();

    for (let i = 0; i < newString.length; i++) {
        if (newString[i] == 'j') {
            newString = 'i' + newString.slice(i + 1);
        }        
    }

    for (let i = 0; i < newString.length; i+=2) {
        if (newString[i] == newString[i+1]) {
            newString = newString.slice(0, i+1) + 'x' + newString.slice(i+1, newString.length);
        }
    }

    console.log('Исправленный входной текст:\n', newString, '\n');

    return newString;
}

function cipher(str, key) {
    var outStr = '';

    if (str.length % 2 != 0) {
        var charLength = str.length - 1;
    } else {
        var charLength = str.length;
    }

    for (let char = 0; char < charLength; char+=2) {
        var indexChar1 = [,];
        var indexChar2 = [,];

        for (let i = 0; i < 5; i++) {
            if (key[i].indexOf(str[char]) != -1) {
                indexChar1[0] = i;
                indexChar1[1] = key[i].indexOf(str[char]);
            }
            if (key[i].indexOf(str[char+1]) != -1) {
                indexChar2[0] = i;
                indexChar2[1] = key[i].indexOf(str[char+1]);
            }
        }

        if (indexChar1[0] == indexChar2[0]) {
            outStr += key[indexChar1[0]][(indexChar1[1] + 1) % 5];
            outStr += key[indexChar2[0]][(indexChar2[1] + 1) % 5];
        } else if (indexChar1[1] == indexChar2[1]) {
            outStr += key[(indexChar1[0] + 1) % 5][indexChar1[1]];
            outStr += key[(indexChar2[0] + 1) % 5][indexChar2[1]];
        } else {
            outStr += key[indexChar1[0]][indexChar2[1]];
            outStr += key[indexChar2[0]][indexChar1[1]];
        }
    }

    if (str.length % 2 != 0) {
        outStr += str[charLength];
    }
    return outStr;
}

function decipher(str, key){
    var outStr = '';

    if (str.length % 2 != 0) {
        var charLength = str.length - 1;
    } else {
        var charLength = str.length;
    }

    for (let char = 0; char < charLength; char+=2) {
        var indexChar1 = [,];
        var indexChar2 = [,];

        for (let i = 0; i < 5; i++) {
            if (key[i].indexOf(str[char]) != -1) {
                indexChar1[0] = i;
                indexChar1[1] = key[i].indexOf(str[char]);
            }
            if (key[i].indexOf(str[char+1]) != -1) {
                indexChar2[0] = i;
                indexChar2[1] = key[i].indexOf(str[char+1]);
            }
        }

        if (indexChar1[0] == indexChar2[0]) {
            if (indexChar1[1] == 0) {
                outStr += key[indexChar1[0]][4];
            } else {
                outStr += key[indexChar1[0]][indexChar1[1] - 1];
            }
            if (indexChar2[1] == 0) {
                outStr += key[indexChar2[0]][4];
            } else {
                outStr += key[indexChar2[0]][indexChar2[1] - 1];
            }
        } else if (indexChar1[1] == indexChar2[1]) {
            if (indexChar1[0] == 0) {
                outStr += key[4][indexChar1[1]];
            } else {
                outStr += key[indexChar1[0] - 1][indexChar1[1]];
            }
            if (indexChar2[0] == 0) {
                outStr += key[4][indexChar2[1]];
            } else {
                outStr += key[indexChar2[0] - 1][indexChar2[1]];
            }
        } else {
            outStr += key[indexChar1[0]][indexChar2[1]];
            outStr += key[indexChar2[0]][indexChar1[1]];
        }
    }

    if (str.length % 2 != 0) {
        outStr += str[charLength];
    }
    return outStr;
}

// playfair('-s', 'gorelov gleb egorovich', 'chromium');
playfair('-r', 'krcgkmxeefikkromcehr', 'chromium');

// playfair(process.argv[2], process.argv[3], process.argv[4] || 'example');

export default playfair;
