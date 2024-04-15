import findPrimitive from "../primitive_root.js";
import generateLargePrime from "../generate_prime.js";
import powerMod from "../power_mod.js";

function keygen (len=24) {
    let p = Number(generateLargePrime(len));
    let g = findPrimitive(p);
    let x = Math.floor(Math.random() * (p - 1) + 1);
    let y = powerMod(g, x, p);

    // console.table({ publicKey: [y, g, p], privateKey: x });
    return { publicKey: {y: y, g: g, p: p}, privateKey: x };
}

export default keygen;