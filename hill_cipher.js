import {create, all} from 'mathjs';
const math = create(all);

function hillCipher(type, str, rawkey) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz,. ';
    console.log('Алфавит:\n', alphabet, "\n");
    var key = keygen(rawkey, alphabet);
    console.log("Ключ:\n", key._data, "\n");
    
    switch (type) {
        case '-s':
            var result = cipher(str, key, alphabet);
            console.log("Шифртекст:\n", result);
            break;
        case '-r':
            var result = decipher(str, key, alphabet);
            console.log("Расшифртекст:\n", result);
            break;
    }
}

function keygen(rawkey, alphabet){
    var key = math.matrix(math.ones(3, 3));

    for (let i = 0; i < key._size[0]; i++) {
        for (let j = 0; j < key._size[1]; j++) {
            var char = rawkey[i*key._size[0] + j];
            key.set([i, j], alphabet.indexOf(char));
        }
    }

    return key
}

function cipher(str, key, alphabet) {
    var outStr = '';
    if (str.length % 3 != 0) {
        str += ' '.repeat(str.length % 3 + 1);
    }
    console.log(`Текст:\n'${str}'\n`);
    console.log("Матрица текста:");
        for (let i = 0; i < str.length; i+=3) {
            console.log(`|${str[i]}|${str[i+1]}|${str[i+2]}|`);
            var vector = math.matrix([alphabet.indexOf(str[i]), alphabet.indexOf(str[i+1]), alphabet.indexOf(str[i+2])]);
            console.log(vector._data, '\n');
            var result = math.multiply(key, vector);
            
            math.forEach(result, x => {
                outStr += alphabet[math.mod(x, alphabet.length)];
            });
        }
    return outStr;
}

function decipher(str, key, alphabet) {
    key = reverseKey(key, alphabet);
    return cipher(str, key, alphabet);
}

function findCofactors(key){
    var cofactors = math.zeros(3, 3);
    for (let i = 0; i < key._size[0]; i++) {
        var a = (i + 1) % key._size[0];
        var b = (i + 2) % key._size[0];
        for (let j = 0; j < key._size[1]; j++) {
            var c = (j + 1) % key._size[1];
            var d = (j + 2) % key._size[1];
            var subset = math.subset(key, math.index([a, b], [c, d]));
            cofactors.set([i, j], math.det(subset));
        }
    }
    return math.transpose(cofactors);;
}

function reverseKey(key, alphabet){
    var determinant = math.det(key);
    var invDet = math.invmod(determinant, alphabet.length);
    var cofactors = findCofactors(key);
    var reverseKey = math.map(cofactors, x => math.mod(x * invDet, alphabet.length));
    console.log("Обратная ключу матрица:\n", reverseKey._data, "\n");
    return reverseKey;
}

// hillCipher('-s', 'gorelov gleb egorovich', 'rrfvsvcct');

// hillCipher('-r', 'tkpgzgw.j fuxderyjksjkvw', 'rrfvsvcct');

export default hillCipher;
