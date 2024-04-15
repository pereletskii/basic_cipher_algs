import keygen from "./RSA_keys.js"
import powerMod from "../power_mod.js";
// import { encode, decode } from "windows-1251"

/* function strToNum(str){
    let numsArray = encode(str);
    let num = '';
    for (let i = 0; i < numsArray.length; i++) {
        num += numsArray[i].toString(2).padStart(8, '0');
    }
    
    return BigInt('0b' + num)
} */

/* function encodeNum(num){
    let str = num.toString(2);
    if (str.length % 8 != 0){
        str = str.padStart(Math.floor(str.length) / 8 + 8, '0');
    }
    let numsArray = [];
    for (let i = 0; i < str.length; i+=8) {
        numsArray.push(parseInt(str.slice(i, i+8).padStart(8, '0'), 2));
    }

    return decode(numsArray)
} */

function encrypt(str, openKey){
    // let strNum = strToNum(str);
    let strNum = BigInt(parseInt(str));
    let c = powerMod(strNum, openKey[0], openKey[1]);

    return c
}

function decrypt(str, privateKey){
    let m = powerMod(str, privateKey[0], privateKey[1]);

    return m;
}

function main(){
    let key = keygen(8);
    let msg = 2**14;
    let crypted = encrypt(msg, key.publicKey);
    let encrypted = decrypt(crypted, key.privateKey);
    console.log(msg, crypted, encrypted, '\n');
    // TODO сделать быстрые вычисления для ключей длиной больше 8 бит
    // TODO разобраться с максимальной длиной шифруемого сообщения (сейчас - 14 бит)
}

export default main