import AuthComponent from "@/components/AuthComponent";
import { SubmitHandler } from "react-hook-form";
import React from "react";
import { authInterface } from "@/types/interface";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import AppLayout from "@/components/layout/AppLayout";
import PageLoader from "@/components/layout/PageLoader";
import { deriveKeys, generateSalt } from "@/utils/vaultCrypto";

const App = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { allowRender, isChecking } = useAuthRedirect();

  const onSubmit: SubmitHandler<authInterface> = async (data) => {
    try {
      const vaultSalt = generateSalt();
      const { authHash } = await deriveKeys(data.password, vaultSalt);
      const response = await axios.post("/register", {
        email: data.email,
        password: authHash,
        vaultSalt,
      });
      if (response.status === 201) {
        showToast("Account created successfully. Please sign in.", "success");
        setTimeout(() => {
          router.push("/auth/login");
        }, 300);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    }
  };

  if (isChecking) {
    return (
      <AppLayout title="Register — Vault" contentVariant="centered" showFooter={false}>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!allowRender) return null;

  return (
    <AppLayout
      title="Register — Vault"
      description="Create your Vault account"
      contentVariant="centered"
      showBack
      onBack={() => router.push("/home")}
    >
      <AuthComponent mode="register" submitHandler={onSubmit} />
    </AppLayout>
  );
};

export default App;
