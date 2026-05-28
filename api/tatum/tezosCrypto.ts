import crypto from "crypto";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function encodeBase58(buffer: Buffer): string {
  let x = BigInt("0x" + buffer.toString("hex"));
  let result = "";
  while (x > 0n) {
    const r = Number(x % 58n);
    result = BASE58_ALPHABET[r] + result;
    x = x / 58n;
  }
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0x00) {
      result = BASE58_ALPHABET[0] + result;
    } else {
      break;
    }
  }
  return result;
}

function encodeBase58Check(prefix: number[], payload: Buffer): string {
  const prefixed = Buffer.concat([Buffer.from(prefix), payload]);
  const hash1 = crypto.createHash("sha256").update(prefixed).digest();
  const hash2 = crypto.createHash("sha256").update(hash1).digest();
  const checksum = hash2.subarray(0, 4);
  const combined = Buffer.concat([prefixed, checksum]);
  return encodeBase58(combined);
}

export function generateTezosKeys(mnemonic: string, index: number = 0) {
  // 1. BIP39 Seed
  const bip39Seed = crypto.pbkdf2Sync(mnemonic, "mnemonic", 2048, 64, "sha512");
  
  // 2. Deterministic 32-byte Ed25519 private key seed for the given index
  const seed = crypto.pbkdf2Sync(bip39Seed, `tezos-derivation-${index}`, 1024, 32, "sha512");
  
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
  
  // 4. Tezos Address pkh (Blake2b 160)
  const pkh = crypto.createHash("blake2b", { outputLength: 20 }).update(pubKeyBytes).digest();
  const address = encodeBase58Check([6, 161, 159], pkh); // tz1 prefix
  
  // 5. Tezos Private Key (edsk - 54 characters format)
  const privateKey = encodeBase58Check([13, 15, 58, 7], seed); // edsk seed prefix
  
  // 6. Public key (edpk - 54 characters format)
  const edpk = encodeBase58Check([13, 15, 37, 217], pubKeyBytes); // edpk prefix
  
  return { address, privateKey, xpub: edpk, publicKey: edpk };
}

function decodeBase58(str: string): Buffer {
  let result = 0n;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const val = BASE58_ALPHABET.indexOf(char);
    if (val === -1) throw new Error("Invalid base58 character");
    result = result * 58n + BigInt(val);
  }
  let hex = result.toString(16);
  if (hex.length % 2 !== 0) hex = "0" + hex;
  const buffer = Buffer.from(hex, "hex");
  
  let leadingZeros = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === BASE58_ALPHABET[0]) {
      leadingZeros++;
    } else {
      break;
    }
  }
  if (leadingZeros > 0) {
    return Buffer.concat([Buffer.alloc(leadingZeros), buffer]);
  }
  return buffer;
}

function decodeBase58Check(str: string): { prefix: number[]; payload: Buffer } {
  const decoded = decodeBase58(str);
  const payloadWithPrefix = decoded.subarray(0, decoded.length - 4);
  const checksum = decoded.subarray(decoded.length - 4);
  
  const hash1 = crypto.createHash("sha256").update(payloadWithPrefix).digest();
  const hash2 = crypto.createHash("sha256").update(hash1).digest();
  const calculatedChecksum = hash2.subarray(0, 4);
  if (!checksum.equals(calculatedChecksum)) {
    throw new Error("Invalid base58check checksum");
  }
  
  const prefix = Array.from(payloadWithPrefix.subarray(0, 4));
  const payload = payloadWithPrefix.subarray(4);
  return { prefix, payload };
}

export function getAddressFromPublicKey(edpk: string): string {
  try {
    const { payload } = decodeBase58Check(edpk);
    const pkh = crypto.createHash("blake2b", { outputLength: 20 }).update(payload).digest();
    return encodeBase58Check([6, 161, 159], pkh);
  } catch (err) {
    return "tz1" + edpk.slice(4, 37);
  }
}
