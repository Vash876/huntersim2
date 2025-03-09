/**
 * Base58 encoding/decoding utility
 * Based on Bitcoin's implementation
 */

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP = {};

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

const BASE = ALPHABET.length;

export const Base58 = {
  encode(buffer) {
    if (typeof buffer === 'string') {
      buffer = new TextEncoder().encode(buffer);
    }
    
    let i, j, digits = [0];
    
    for (i = 0; i < buffer.length; i++) {
      for (j = 0; j < digits.length; j++) {
        digits[j] <<= 8;
      }
      
      digits[0] += buffer[i];
      let carry = 0;
      
      for (j = 0; j < digits.length; j++) {
        digits[j] += carry;
        carry = (digits[j] / BASE) | 0;
        digits[j] %= BASE;
      }
      
      while (carry) {
        digits.push(carry % BASE);
        carry = (carry / BASE) | 0;
      }
    }
    
    // Deal with leading zeros
    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0);
    }
    
    return digits.reverse().map(digit => ALPHABET[digit]).join('');
  },
  
  decode(string) {
    if (typeof string !== 'string') {
      throw new Error('Base58.decode input is not a string');
    }
    
    if (string.length === 0) return new Uint8Array(0);
    
    let i, j, bytes = [0];
    
    for (i = 0; i < string.length; i++) {
      const c = string[i];
      if (!(c in ALPHABET_MAP)) {
        throw new Error(`Base58.decode invalid character: ${c}`);
      }
      
      for (j = 0; j < bytes.length; j++) {
        bytes[j] *= BASE;
      }
      
      bytes[0] += ALPHABET_MAP[c];
      let carry = 0;
      
      for (j = 0; j < bytes.length; j++) {
        bytes[j] += carry;
        carry = bytes[j] >> 8;
        bytes[j] &= 0xff;
      }
      
      while (carry) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }
    
    // Deal with leading zeros
    for (i = 0; string[i] === '1' && i < string.length - 1; i++) {
      bytes.push(0);
    }
    
    return new TextDecoder().decode(new Uint8Array(bytes.reverse()));
  }
};