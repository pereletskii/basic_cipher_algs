import test from 'node:test';
import playfair from './playfair.js';
import hillCipher from './hill_cipher.js';

test('playfair -s', t => {
    playfair('-s', 'gorelov gleb egorovich', 'chromium');
})
test('playfair -r', t => {
    playfair('-r', 'krcgkmxeefikkromcehr', 'chromium');
})
 
test('hill_cipher -s', t => {
    hillCipher('-s', 'gorelov gleb egorovichaa', 'jopa jopa');
})
