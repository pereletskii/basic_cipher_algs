import { encode } from 'windows-1251';

/* function hexTostr(hex) {
    let rawText = hex.toString(16).toUpperCase().split('');
    let text = '';

    if (rawText.length % 2 != 0) {
        rawText = [0].concat(rawText);
    }
    
    for (let i = 0; i < rawText.length; i+=2) {
        text += rawText[i] + rawText[i + 1] + ' ';
    }

    return text
} */

function strToNums(msg) {
    return encode(msg);
}

function hash(msg, p=45427, q=42821, h0=377) {
    let n = p*q;
    let h1;

    msg = strToNums(msg);

    for (let i = 0; i < msg.length; i++) {
        h1 = ((h0 + msg[i]) ** 2) % n;
        h0 = h1;
    }

    return h1;
}

export default hash;
