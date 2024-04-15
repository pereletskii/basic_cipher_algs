import keygen from "./elgamal_keys.js";
import powerMod from "../power_mod.js";
import { encode, decode } from "windows-1251";

function encrypt(key, msg) {
    let binText = encode(msg);
    let k = Math.floor(Math.random() * (key.p - 1) + 1);
    let a = powerMod(key.g, k, key.p);
    let crypted = { a: a, b: []};
    
    for (let T = 0; T < binText.length; T++) {
        crypted.b.push(
            Number(
                (BigInt(key.y) ** BigInt(k) * BigInt(binText[T])) % BigInt(key.p)
            )
        );
    }

    return crypted;
}

function decrypt(crypted, key) {
    let [a, b, x, p] = [crypted.a, crypted.b, key.privateKey, key.publicKey.p];
    let text = [];

    for (let T = 0; T < b.length; T++) {
        text.push(
            Number(
                (BigInt(b[T]) * BigInt(a) ** BigInt(p - 1 - x)) % BigInt(p)
            )
        );
    }

    return decode(text);
}

export { encrypt, decrypt };

let msg = 'привет блин компот блин';
let key = keygen(16);
let crypted = encrypt(key.publicKey, msg);
let encrypted = decrypt(crypted, key);

console.log(msg);
console.log(crypted)
console.log(encrypted);