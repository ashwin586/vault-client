import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { isTokenValid } from "@/utils/auth";
import { UserSettings } from "@/types/interface";

export const DEFAULT_USER_SETTINGS: UserSettings = {
  autoLockTimeout: 15,
  clipboardTimer: 30,
  maskSensitiveData: true,
  securityReminders: true,
  lockOnClose: true,
  themePreference: "System default",
  notifications: true,
  generatorLength: 18,
  generatorSymbols: true,
  generatorNumbers: true,
  generatorUppercase: true,
  generatorLowercase: true,
  language: "English",
};

const mergeSettings = (partial?: Partial<UserSettings>): UserSettings => ({
  ...DEFAULT_USER_SETTINGS,
  ...(partial || {}),
});

const readCachedSettings = (): UserSettings | null => {
  if (typeof window === "undefined") return null;

  const cachedSettings = localStorage.getItem("vault-settings");
  if (!cachedSettings) return null;

  try {
    return mergeSettings(JSON.parse(cachedSettings));
  } catch {
    localStorage.removeItem("vault-settings");
    return null;
  }
};

const useUserSettings = (enabled = true) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const loadSettings = async () => {
      if (isTokenValid()) {
        try {
          const response = await axios.get("/profile");
          const profileSettings = response?.data?.user?.settings;
          if (profileSettings) {
            const merged = mergeSettings(profileSettings);
            setSettings(merged);
            localStorage.setItem("vault-settings", JSON.stringify(merged));
            setIsLoaded(true);
            return;
          }
        } catch {
          const cached = readCachedSettings();
          if (cached) {
            setSettings(cached);
          }
          setIsLoaded(true);
          return;
        }
      }

      setIsLoaded(true);
    };

    loadSettings();
  }, [enabled]);

  return { settings, isLoaded, setSettings };
};

export default useUserSettings;
