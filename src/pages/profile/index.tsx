import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { User } from "@/types/interface";
import Image from "next/image";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import Head from "next/head";
import AppHeader from "@/components/AppHeader";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken) {
      router.push("/home");
      return;
    }

    setToken(accessToken);
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        setUser({
          name: response?.data?.user?.name,
          email: response?.data?.user?.email,
          createdAt: new Date(
            response?.data?.user?.createdAt,
          ).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          const message = error?.response?.data?.message;
          showToast(message, "error");
          router.push("/home");
        }
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    router.push("/home");
  };

  return (
    <>
      <Head>
        <title>Profile — Vault</title>
        <meta name="description" content="Manage your Vault account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main">
        <AppHeader
          onBack={() => router.back()}
          onLogoClick={() => router.push("/home")}
        />
        {token && (
          <div className="glossy_container w-full max-w-md mx-auto! p-5! sm:p-8! flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src="/default_profile_picture.png"
                alt="Profile picture"
                width={90}
                height={90}
                className="rounded-full border-2 border-white/15"
              />
            </div>

            {/* User Info */}
            <div className="text-center flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold capitalize text-1">
                {user?.name}
              </h1>
              <p className="text-sm text-white/50">{user?.email}</p>
              <p className="text-xs text-white/30">
                Member since {user?.createdAt}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => router.push("/profile/managepasswords")}
                className="flex-1 flex items-center justify-center gap-2 min-h-11 py-3! rounded-[12px]
                         bg-white/5 border border-white/10 text-white/70 text-sm font-medium
                         hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-400
                         transition-all duration-150 cursor-pointer"
              >
                <LockIcon style={{ fontSize: "18px" }} />
                Open Vault
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 min-h-11 py-3 rounded-[12px]
                         bg-white/5 border border-white/10 text-white/70 text-sm font-medium
                         hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400
                         transition-all duration-150 cursor-pointer"
              >
                <LogoutIcon style={{ fontSize: "18px" }} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
