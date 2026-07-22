import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { clearAuthSession, isTokenValid } from "@/utils/auth";
import { isVaultLocked } from "@/hooks/useVaultSessionLock";
import { clearVaultKey, getVaultKey } from "@/utils/vaultKeyStore";

const useProtectedRoute = () => {
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isVaultLocked() || !getVaultKey()) {
      clearVaultKey();
      clearAuthSession();
      router.push("/home");
      setIsChecking(false);
      return;
    }

    if (isTokenValid()) {
      setAllowRender(true);
    } else {
      clearAuthSession();
      clearVaultKey();
      router.push("/home");
    }
    setIsChecking(false);
  }, [router]);

  return { allowRender, isChecking };
};

export default useProtectedRoute;
