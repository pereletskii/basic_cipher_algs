function powerMod(base, exponent, modulus) {
    [ base, exponent, modulus ] = [ Number(base), Number(exponent), Number(modulus) ];
    if (modulus === 1) return 0;
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1)  //odd number
            result = (result * base) % modulus;
        exponent = exponent >> 1; //divide by 2
        base = (base * base) % modulus;
    }
    return result;
}

export default powerMod;