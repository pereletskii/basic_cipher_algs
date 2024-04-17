import { modPow } from 'bigint-mod-arith';

function createSignature(msg, privateKey, hashFunc) {
    msg = hashFunc(msg);
    return modPow(BigInt(msg), privateKey[0], privateKey[1])
        .toString(16);
}

function checkSignature(msg, signature, publicKey, hashFunc) {
    msg = hashFunc(msg);
    let r = modPow(BigInt(parseInt(signature, 16)), publicKey[0], publicKey[1]);
    if (Number(r) != msg) return false;
    return true;
}

export { createSignature, checkSignature };
