import { SubmitHandler } from "react-hook-form";
import { authInterface } from "@/types/interface";
import AuthComponent from "@/components/AuthComponent";
import axios from "@/lib/axios";
import Head from "next/head";
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
      const response = await axios.post("/login", data);
      if (response.status === 200) {
        const accessToken = response?.data?.token;
        const message: string = response?.data?.message;
        localStorage.setItem("access-token", accessToken);
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

  return (
    <>
      <Head>
        <title>Login - Valut</title>
        <meta name="description" content="Login to your Vault account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {allowRender && (
        <div className="main">
          <AppHeader onLogoClick={() => router.push("/home")} />
          <AuthComponent mode="login" submitHandler={onSubmit} />
        </div>
      )}
    </>
  );
};

export default App;
