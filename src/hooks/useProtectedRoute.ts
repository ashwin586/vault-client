import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/auth";
import { isVaultLocked } from "@/hooks/useVaultSessionLock";

const useProtectedRoute = () => {
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isVaultLocked()) {
      router.push("/home");
      setIsChecking(false);
      return;
    }

    if (isTokenValid()) {
      setAllowRender(true);
    } else {
      localStorage.removeItem("access-token");
      router.push("/home");
    }
    setIsChecking(false);
  }, [router]);

  return { allowRender, isChecking };
};

export default useProtectedRoute;
