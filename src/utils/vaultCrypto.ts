const PBKDF2_ITERATIONS = 310000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BITS = 256;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type VaultCryptoKey = CryptoKey;

export interface DerivedKeys {
  vaultKey: VaultCryptoKey;
  authHash: string;
}

export interface EncryptedPassword {
  ciphertext: string;
  iv: string;
}

const bufferToHex = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const hexToBytes = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

export const generateSalt = (): string => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  return bufferToHex(salt);
};

const importPasswordKey = async (masterPassword: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    textEncoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

const deriveBits = async (
  masterPassword: string,
  saltHex: string,
  purpose: string,
): Promise<ArrayBuffer> => {
  const baseKey = await importPasswordKey(masterPassword);
  const saltBytes = hexToBytes(saltHex);
  const purposeBytes = textEncoder.encode(purpose);
  const combinedSalt = new Uint8Array(saltBytes.length + purposeBytes.length);
  combinedSalt.set(saltBytes, 0);
  combinedSalt.set(purposeBytes, saltBytes.length);

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: combinedSalt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    KEY_BITS,
  );
};

export const deriveKeys = async (
  masterPassword: string,
  saltHex: string,
): Promise<DerivedKeys> => {
  const [vaultBits, authBits] = await Promise.all([
    deriveBits(masterPassword, saltHex, "vault-key-v1"),
    deriveBits(masterPassword, saltHex, "auth-hash-v1"),
  ]);

  const vaultKey = await crypto.subtle.importKey(
    "raw",
    vaultBits,
    { name: "AES-GCM", length: KEY_BITS },
    false,
    ["encrypt", "decrypt"],
  );

  return {
    vaultKey,
    authHash: bufferToHex(authBits),
  };
};

export const encryptPassword = async (
  plaintext: string,
  vaultKey: VaultCryptoKey,
): Promise<EncryptedPassword> => {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    vaultKey,
    textEncoder.encode(plaintext),
  );

  return {
    ciphertext: bufferToHex(encrypted),
    iv: bufferToHex(iv),
  };
};

export const decryptPassword = async (
  ciphertextHex: string,
  ivHex: string,
  vaultKey: VaultCryptoKey,
): Promise<string> => {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: hexToBytes(ivHex) },
    vaultKey,
    hexToBytes(ciphertextHex),
  );
  return textDecoder.decode(decrypted);
};
