import axios from "@/lib/axios";
import { clearAuthSession } from "@/utils/auth";
import { clearVaultKey } from "@/utils/vaultKeyStore";

/** Clears server auth cookie and local session markers. */
export const logoutSession = async () => {
  try {
    await axios.post("/logout");
  } catch {
    // Cookie may already be expired; still clear local state.
  } finally {
    clearAuthSession();
    clearVaultKey();
  }
};
