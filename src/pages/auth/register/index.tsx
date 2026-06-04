import AuthComponent from "@/components/AuthComponent";
import { SubmitHandler } from "react-hook-form";
import React from "react";
import { authInterface } from "@/types/interface";
import Head from "next/head";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import AppHeader from "@/components/AppHeader";

const App = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const allowRender = useAuthRedirect();

  const onSubmit: SubmitHandler<authInterface> = async (data) => {
    try {
      const response = await axios.post("/register", data);
      if (response.status === 201) {
        router.push("/auth/login");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    }
  };

  return (
    <>
      <Head>
        <title>Register | vault</title>
        <meta name="description" content="Create your Vault account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {allowRender && (
        <div className="main">
          <AppHeader onLogoClick={() => router.push("/home")} />
          <AuthComponent mode="register" submitHandler={onSubmit} />
        </div>
      )}
    </>
  );
};

export default App;
