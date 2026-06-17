import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/auth";

const useAuthRedirect = () => {
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isTokenValid()) {
      router.push("/home");
    } else {
      localStorage.removeItem("access-token");
      setAllowRender(true);
    }
    setIsChecking(false);
  }, [router]);

  return { allowRender, isChecking };
};

export default useAuthRedirect;
