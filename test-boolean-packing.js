// Corrected boolean packing functions for 33 bits using BigInt
function packBooleans(boostData) {
  let packed = 0n;  // Use BigInt for 33 bits
  for (const [id, value] of Object.entries(boostData)) {
    if (typeof value === 'boolean' && value === true) {
      const bitPosition = parseInt(id) - 1; // IDs start at 1, bits at 0
      if (bitPosition >= 0 && bitPosition < 33) { // Max 33 booleans (IDs 1-33)
        packed |= (1n << BigInt(bitPosition));
      }
    }
  }
  return packed > 0n ? Number(packed) : null;  // Convert back to Number if possible
}

function unpackBooleans(packedValue) {
  const result = {};
  if (packedValue) {
    const packed = BigInt(packedValue);  // Convert to BigInt for operations
    for (let i = 0; i < 33; i++) { // Support 33 bits (IDs 1-33)
      if (packed & (1n << BigInt(i))) {
        result[i + 1] = true; // IDs start at 1
      }
    }
  }
  return result;
}

// Test mit allen Void Badges gesetzt (IDs 29-33)
const testBoosts = {
  29: true,  // vb1
  30: true,  // vb2  
  31: true,  // vb3
  32: true,  // vb4
  33: true   // vb5
};

console.log('Original boosts:', testBoosts);

const packed = packBooleans(testBoosts);
console.log('Packed value:', packed);
console.log('Packed value (binary):', packed ? packed.toString(2) : 'null');

const unpacked = unpackBooleans(packed);
console.log('Unpacked boosts:', unpacked);

// Vergleiche
console.log('Test results:');
for (let id = 29; id <= 33; id++) {
  const original = testBoosts[id];
  const restored = unpacked[id];
  console.log(`ID ${id}: ${original} -> ${restored} [${original === restored ? 'PASS' : 'FAIL'}]`);
}
