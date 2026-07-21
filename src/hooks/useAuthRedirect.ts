import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/auth";
import { getVaultKey, clearVaultKey } from "@/utils/vaultKeyStore";

const useAuthRedirect = () => {
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isTokenValid() && getVaultKey()) {
      router.push("/home");
    } else {
      if (!getVaultKey()) {
        clearVaultKey();
        localStorage.removeItem("access-token");
      }
      setAllowRender(true);
    }
    setIsChecking(false);
  }, [router]);

  return { allowRender, isChecking };
};

export default useAuthRedirect;
