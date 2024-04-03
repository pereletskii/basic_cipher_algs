var alphabet = 'abcdefghijklmnopqrstuvwxyz';
alphabet = alphabetMatrxi(alphabet);

function alphabetMatrxi(){
    var matrix = [];
    for (let i = 0; i < alphabet.length; i++) {
        matrix.push([]);
        for (let j = 0; j < alphabet.length; j++) {
            matrix[i].push(alphabet[(j + i) % alphabet.length]);
        }
    }
    return matrix;
}

function keygen(key, strLength){
    var expandedKey = '';
    for (let i = 0; i < strLength; i++) {
        expandedKey += key[i % key.length];
    }
    return expandedKey;
}

function vigenerCipher(type, str, key){
    key = keygen(key, str.length);
    console.log(`Ключ:\n${key}\n`);

    str = str.replace(/\s/g, "").toLowerCase();
    console.log(`Исправленный входной текст:\n${str}\n`);

    switch (type){
        case '-s':
            var result = cipher(str, key);
            console.log(`Зашифрованный текст:`);
            break;
        case '-r':
            var result = decipher(str, key);
            console.log(`Расшифрованный текст:`);
            break;
    }
    console.log(result);
}

function cipher(str, key){
    var outStr = '';
    for (let i = 0; i < str.length; i++) {
        var row = alphabet[0].indexOf(key[i]);
        var col = alphabet[0].indexOf(str[i]);
        outStr += alphabet[row][col]; 
    }
    return outStr;
}

function decipher(str, key){
    var outStr = '';
    for (let i = 0; i < str.length; i++) {
        var row = alphabet[0].indexOf(key[i]);
        var col = alphabet[row].indexOf(str[i]);
        outStr += alphabet[0][col]; 
    }
    return outStr;
}

// vigenerCipher('-s', 'gorelov gleb egorovich', 'chromium');
// vigenerCipher('-r', 'ivisxwpsnlssswlaxptv', 'chromium');
