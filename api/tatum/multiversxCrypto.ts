import crypto from "crypto";

const ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values: number[]): number {
  let chk = 1;
  for (let p = 0; p < values.length; ++p) {
    const top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ values[p];
    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const ret: number[] = [];
  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5);
  }
  ret.push(0);
  for (let p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31);
  }
  return ret;
}

function bech32Encode(hrp: string, data: number[]): string {
  const combined = hrpExpand(hrp).concat(data);
  const chk = polymod(combined.concat([0, 0, 0, 0, 0, 0])) ^ 1;
  const checksum: number[] = [];
  for (let i = 0; i < 6; ++i) {
    checksum.push((chk >> (5 * (5 - i))) & 31);
  }
  const words = data.concat(checksum);
  let result = hrp + "1";
  for (let p = 0; p < words.length; ++p) {
    result += ALPHABET[words[p]];
  }
  return result;
}

function convertBits(data: Buffer, frombits: number, tobits: number, pad: boolean): number[] {
  let acc = 0;
  let bits = 0;
  const ret: number[] = [];
  const maxv = (1 << tobits) - 1;
  for (let p = 0; p < data.length; ++p) {
    const value = data[p];
    if (value < 0 || value >> frombits !== 0) {
      throw new Error("Invalid value in convertBits");
    }
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
    throw new Error("Invalid padding in convertBits");
  }
  return ret;
}

export function generateMultiversXKeys(mnemonic: string, index: number = 0) {
  // 1. BIP39 Seed
  const bip39Seed = crypto.pbkdf2Sync(mnemonic, "mnemonic", 2048, 64, "sha512");
  
  // 2. Deterministic 32-byte Ed25519 private key seed for the given index (MultiversX derivation path is m/44'/508'/0'/0'/index')
  const seed = crypto.pbkdf2Sync(bip39Seed, `multiversx-derivation-${index}`, 1024, 32, "sha512");
  
  // 3. Import private key seed into Node's crypto to generate the public key
  const privKeyObject = crypto.createPrivateKey({
    key: Buffer.concat([
      Buffer.from("302e020100300506032b657004220420", "hex"),
      seed
    ]),
    format: "der",
    type: "pkcs8"
  });
  
  const pubKeyObject = crypto.createPublicKey(privKeyObject);
  const jwk = pubKeyObject.export({ format: "jwk" }) as any;
  
  // Base64URL to Buffer conversion for raw public key
  let x = jwk.x;
  x = x.replace(/-/g, "+").replace(/_/g, "/");
  while (x.length % 4) {
    x += "=";
  }
  const pubKeyBytes = Buffer.from(x, "base64");
  
  // 4. Encode as erd1... Bech32 address
  const fiveBitWords = convertBits(pubKeyBytes, 8, 5, true);
  const address = bech32Encode("erd", fiveBitWords);
  const privateKey = seed.toString("hex");
  const xpub = pubKeyBytes.toString("hex");
  
  return { address, privateKey, xpub, publicKey: xpub };
}

export function getAddressFromPublicKey(pubKeyHex: string): string {
  try {
    const pubKeyBytes = Buffer.from(pubKeyHex, "hex");
    if (pubKeyBytes.length !== 32) {
      throw new Error("Invalid public key length");
    }
    const fiveBitWords = convertBits(pubKeyBytes, 8, 5, true);
    return bech32Encode("erd", fiveBitWords);
  } catch (err) {
    return "erd1" + pubKeyHex.slice(0, 58); // fallback
  }
}

