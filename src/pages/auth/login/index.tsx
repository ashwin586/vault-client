import { SubmitHandler } from "react-hook-form";
import { authInterface } from "@/types/interface";
import AuthComponent from "@/components/AuthComponent";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { unlockVaultSession } from "@/hooks/useVaultSessionLock";
import AppLayout from "@/components/layout/AppLayout";
import PageLoader from "@/components/layout/PageLoader";
import { deriveKeys } from "@/utils/vaultCrypto";
import { setVaultKey } from "@/utils/vaultKeyStore";

const App = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { allowRender, isChecking } = useAuthRedirect();

  const onSubmit: SubmitHandler<authInterface> = async (data) => {
    try {
      const saltResponse = await axios.get("/auth/salt", {
        params: { email: data.email },
      });
      const salt = saltResponse?.data?.salt;
      if (!salt) {
        showToast("Unable to unlock vault for this account", "error");
        return;
      }

      const { vaultKey, authHash } = await deriveKeys(data.password, salt);
      const response = await axios.post("/login", {
        email: data.email,
        password: authHash,
      });

      if (response.status === 200) {
        const accessToken = response?.data?.token;
        const message: string = response?.data?.message;
        localStorage.setItem("access-token", accessToken);
        setVaultKey(vaultKey);
        unlockVaultSession();
        showToast(message, "success");
        setTimeout(() => {
          router.push("/home");
        }, 200);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    }
  };

  if (isChecking) {
    return (
      <AppLayout title="Login — Vault" contentVariant="centered" showFooter={false}>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!allowRender) return null;

  return (
    <AppLayout
      title="Login — Vault"
      description="Login to your Vault account"
      contentVariant="centered"
      showBack
      onBack={() => router.push("/home")}
    >
      <AuthComponent mode="login" submitHandler={onSubmit} />
    </AppLayout>
  );
};

export default App;
