import Axios from "axios";
import { clearAuthSession } from "@/utils/auth";
import { clearVaultKey } from "@/utils/vaultKeyStore";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_DEV_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
      clearVaultKey();
    }
    return Promise.reject(error);
  },
);

export default axios;
