// S-Box Generation using Affine Transformation
export function generateAffineSBox(): { sbox: number[], matrix: number[][], vector: number[] } {
  // Generate random 8x8 invertible matrix over GF(2)
  const matrix = generateInvertibleMatrix();
  
  // Generate random 8-bit vector
  const vector = Array.from({ length: 8 }, () => Math.floor(Math.random() * 2));
  
  // Generate S-Box using affine transformation
  const sbox: number[] = [];
  for (let x = 0; x < 256; x++) {
    // Get multiplicative inverse in GF(2^8)
    const inv = x === 0 ? 0 : gf256Inverse(x);
    
    // Apply affine transformation: Ax + b
    const transformed = affineTransform(inv, matrix, vector);
    sbox.push(transformed);
  }
  
  return { sbox, matrix, vector };
}

// Generate invertible 8x8 binary matrix
function generateInvertibleMatrix(): number[][] {
  let matrix: number[][];
  let attempts = 0;
  
  do {
    matrix = Array.from({ length: 8 }, () => 
      Array.from({ length: 8 }, () => Math.floor(Math.random() * 2))
    );
    attempts++;
  } while (!isInvertibleGF2(matrix) && attempts < 100);
  
  if (attempts >= 100) {
    // Fallback to identity matrix with some randomization
    matrix = Array.from({ length: 8 }, (_, i) => 
      Array.from({ length: 8 }, (_, j) => i === j ? 1 : Math.floor(Math.random() * 2))
    );
  }
  
  return matrix;
}

// Check if matrix is invertible over GF(2)
function isInvertibleGF2(matrix: number[][]): boolean {
  const n = matrix.length;
  const temp = matrix.map(row => [...row]);
  
  for (let i = 0; i < n; i++) {
    // Find pivot
    let pivot = i;
    while (pivot < n && temp[pivot][i] === 0) pivot++;
    if (pivot === n) return false;
    
    // Swap rows
    if (pivot !== i) {
      [temp[i], temp[pivot]] = [temp[pivot], temp[i]];
    }
    
    // Eliminate
    for (let j = i + 1; j < n; j++) {
      if (temp[j][i] === 1) {
        for (let k = 0; k < n; k++) {
          temp[j][k] ^= temp[i][k];
        }
      }
    }
  }
  
  return true;
}

// Affine transformation in GF(2^8)
function affineTransform(x: number, matrix: number[][], vector: number[]): number {
  const bits: number[] = [];
  for (let i = 0; i < 8; i++) {
    bits.push((x >> i) & 1);
  }
  
  const result: number[] = [];
  for (let i = 0; i < 8; i++) {
    let bit = vector[i];
    for (let j = 0; j < 8; j++) {
      bit ^= (matrix[i][j] & bits[j]);
    }
    result.push(bit);
  }
  
  let output = 0;
  for (let i = 0; i < 8; i++) {
    output |= (result[i] << i);
  }
  
  return output;
}

// Multiplicative inverse in GF(2^8) with AES polynomial
function gf256Inverse(x: number): number {
  if (x === 0) return 0;
  
  let r0 = 0x11B; // AES irreducible polynomial
  let r1 = x;
  let t0 = 0;
  let t1 = 1;
  
  while (r1 !== 0) {
    const q = gf256Divide(r0, r1);
    const r = r0 ^ gf256Multiply(q, r1);
    const t = t0 ^ gf256Multiply(q, t1);
    
    r0 = r1;
    r1 = r;
    t0 = t1;
    t1 = t;
  }
  
  return t0;
}

function gf256Multiply(a: number, b: number): number {
  let result = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) === 1) {
      result ^= a;
    }
    const hiBitSet = (a & 0x80) !== 0;
    a <<= 1;
    if (hiBitSet) {
      a ^= 0x11B;
    }
    b >>= 1;
  }
  return result & 0xFF;
}

function gf256Divide(a: number, b: number): number {
  if (b === 0) return 0;
  let quotient = 0;
  let aBits = Math.floor(Math.log2(a)) + 1;
  let bBits = Math.floor(Math.log2(b)) + 1;
  
  for (let i = aBits - bBits; i >= 0; i--) {
    if (a >= (b << i)) {
      a ^= (b << i);
      quotient |= (1 << i);
    }
  }
  
  return quotient;
}

// Validation Functions
export function isBijective(sbox: number[]): boolean {
  const seen = new Set<number>();
  for (const val of sbox) {
    if (val < 0 || val > 255 || seen.has(val)) return false;
    seen.add(val);
  }
  return sbox.length === 256 && seen.size === 256;
}

export function isBalanced(sbox: number[]): boolean {
  for (let bit = 0; bit < 8; bit++) {
    let count = 0;
    for (const val of sbox) {
      if ((val >> bit) & 1) count++;
    }
    if (count !== 128) return false;
  }
  return true;
}

// Nonlinearity calculation
export function calculateNonlinearity(sbox: number[]): number {
  let minNL = 256;
  
  for (let bit = 0; bit < 8; bit++) {
    const boolFunc: number[] = [];
    for (let i = 0; i < 256; i++) {
      boolFunc.push((sbox[i] >> bit) & 1);
    }
    
    const nl = calculateBooleanNL(boolFunc);
    minNL = Math.min(minNL, nl);
  }
  
  return minNL;
}

function calculateBooleanNL(func: number[]): number {
  const n = 8;
  const walshSpectrum = walshTransform(func);
  const maxWalsh = Math.max(...walshSpectrum.map(Math.abs));
  return (1 << (n - 1)) - (maxWalsh / 2);
}

function walshTransform(func: number[]): number[] {
  const n = func.length;
  const result: number[] = [];
  
  for (let w = 0; w < n; w++) {
    let sum = 0;
    for (let x = 0; x < n; x++) {
      const parity = countBits(x & w) % 2;
      sum += parity === 0 ? (func[x] === 0 ? 1 : -1) : (func[x] === 0 ? -1 : 1);
    }
    result.push(sum);
  }
  
  return result;
}

function countBits(n: number): number {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// SAC (Strict Avalanche Criterion) calculation
export function calculateSAC(sbox: number[]): number {
  let totalSum = 0;
  let count = 0;
  
  for (let inputBit = 0; inputBit < 8; inputBit++) {
    for (let outputBit = 0; outputBit < 8; outputBit++) {
      let flips = 0;
      
      for (let x = 0; x < 256; x++) {
        const x_flipped = x ^ (1 << inputBit);
        const y = sbox[x];
        const y_flipped = sbox[x_flipped];
        
        if (((y ^ y_flipped) >> outputBit) & 1) {
          flips++;
        }
      }
      
      const probability = flips / 256;
      totalSum += Math.abs(probability - 0.5);
      count++;
    }
  }
  
  const avgDeviation = totalSum / count;
  return 1 - (avgDeviation * 2); // Convert to 0-1 score (1 is perfect)
}

// DAP (Differential Approximation Probability)
export function calculateDAP(sbox: number[]): number {
  let maxDiff = 0;
  
  for (let dx = 1; dx < 256; dx++) {
    const diffTable: { [key: number]: number } = {};
    
    for (let x = 0; x < 256; x++) {
      const x_prime = x ^ dx;
      const dy = sbox[x] ^ sbox[x_prime];
      diffTable[dy] = (diffTable[dy] || 0) + 1;
    }
    
    for (const count of Object.values(diffTable)) {
      if (count > maxDiff) {
        maxDiff = count;
      }
    }
  }
  
  return maxDiff / 256;
}
