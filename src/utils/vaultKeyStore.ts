import type { VaultCryptoKey } from "@/utils/vaultCrypto";

let vaultKey: VaultCryptoKey | null = null;

export const setVaultKey = (key: VaultCryptoKey) => {
  vaultKey = key;
};

export const getVaultKey = (): VaultCryptoKey | null => vaultKey;

export const requireVaultKey = (): VaultCryptoKey => {
  if (!vaultKey) {
    throw new Error("Vault is locked. Sign in again to unlock.");
  }
  return vaultKey;
};

export const clearVaultKey = () => {
  vaultKey = null;
};
