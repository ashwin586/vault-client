import { useEffect } from "react";
import { useRouter } from "next/router";
import { clearVaultKey } from "@/utils/vaultKeyStore";

export const VAULT_LOCK_KEY = "vault-locked";

export const isVaultLocked = () =>
  typeof window !== "undefined" &&
  sessionStorage.getItem(VAULT_LOCK_KEY) === "1";

export const lockVaultSession = () => {
  clearVaultKey();
  sessionStorage.setItem(VAULT_LOCK_KEY, "1");
};

export const unlockVaultSession = () => {
  sessionStorage.removeItem(VAULT_LOCK_KEY);
};

const useVaultSessionLock = (
  lockOnClose: boolean,
  autoLockTimeoutMinutes: number,
) => {
  const router = useRouter();

  useEffect(() => {
    if (!lockOnClose) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lockVaultSession();
      }
    };

    const handlePageHide = () => {
      lockVaultSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [lockOnClose]);

  useEffect(() => {
    if (!autoLockTimeoutMinutes || autoLockTimeoutMinutes <= 0) return;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        lockVaultSession();
        localStorage.removeItem("access-token");
        clearVaultKey();
        router.push("/home");
      }, autoLockTimeoutMinutes * 60 * 1000);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, resetIdleTimer),
    );
    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, resetIdleTimer),
      );
    };
  }, [autoLockTimeoutMinutes, router]);
};

export default useVaultSessionLock;
