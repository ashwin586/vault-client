import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { User } from "@/types/interface";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AppLayout from "@/components/layout/AppLayout";
import PageLoader from "@/components/layout/PageLoader";
import UserAvatar from "@/components/ui/UserAvatar";
import Skeleton from "@mui/material/Skeleton";
import { skeletonStyle } from "@/utils/muiStyles";
import { isTokenValid } from "@/utils/auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isTokenValid()) {
      router.push("/home");
      return;
    }
    setIsAuthenticated(true);

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
        } else {
          showToast("Failed to load profile", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    router.push("/home");
  };

  if (!isAuthenticated) {
    return (
      <AppLayout title="Profile — Vault" contentVariant="centered" showFooter={false}>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Profile — Vault"
      description="Manage your Vault account"
      contentVariant="centered"
      showBack
      onBack={() => router.push("/home")}
    >
      <div className="account-page">
        <section className="glossy_container account-shell flex flex-col gap-6">
          <div className="account-header">
            <div className="account-header__copy">
              <span className="account-kicker">Account Overview</span>
              <h1 className="account-title">Your Vault profile</h1>
              <p className="account-description">
                Review your account status and jump into your vault or security
                settings.
              </p>
            </div>
            <span className="status-badge status-badge--success">
              <VerifiedUserOutlinedIcon style={{ fontSize: "16px" }} />
              Protected
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton variant="circular" width={90} height={90} sx={skeletonStyle} />
              <div className="w-full flex flex-col gap-2 items-center">
                <Skeleton variant="text" width="60%" height={32} sx={skeletonStyle} />
                <Skeleton variant="text" width="80%" height={20} sx={skeletonStyle} />
                <Skeleton variant="text" width="50%" height={16} sx={skeletonStyle} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <UserAvatar name={user?.name} size={92} />

              <div className="text-center sm:text-left flex flex-col gap-2 min-w-0">
                <h2 className="text-2xl font-extrabold capitalize text">
                  {user?.name}
                </h2>
                <p className="text-sm text-white/50 break-all">{user?.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                  <span className="status-badge status-badge--info">
                    Member since {user?.createdAt}
                  </span>
                  <span className="status-badge status-badge--success">
                    Encryption active
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="settings-meta-grid">
            <div className="settings-meta-card">
              <p className="settings-meta-card__label">Account status</p>
              <p className="settings-meta-card__value">Protected</p>
            </div>
            <div className="settings-meta-card">
              <p className="settings-meta-card__label">Security posture</p>
              <p className="settings-meta-card__value">Healthy</p>
            </div>
            <div className="settings-meta-card">
              <p className="settings-meta-card__label">Last activity</p>
              <p className="settings-meta-card__value">Current session</p>
            </div>
          </div>
        </section>

        <section className="settings-grid settings-grid--single">
          <div className="glossy_container settings-card">
            <div className="settings-card__header">
              <div className="settings-card__title-group">
                <h2 className="settings-card__title">Quick actions</h2>
                <p className="settings-card__description">
                  Manage saved credentials, account preferences, and active
                  sessions from one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => router.push("/profile/managepasswords")}
                className="settings-row text-left cursor-pointer"
              >
                <div className="settings-row__content">
                  <span className="settings-row__title flex items-center gap-2">
                    <LockIcon style={{ fontSize: "18px" }} />
                    Open Vault
                  </span>
                  <span className="settings-row__description">
                    View and manage saved credentials.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile/manageaccount")}
                className="settings-row text-left cursor-pointer"
              >
                <div className="settings-row__content">
                  <span className="settings-row__title flex items-center gap-2">
                    <SettingsIcon style={{ fontSize: "18px" }} />
                    Manage Account
                  </span>
                  <span className="settings-row__description">
                    Update profile, privacy, and security preferences.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="settings-row text-left cursor-pointer"
              >
                <div className="settings-row__content">
                  <span className="settings-row__title flex items-center gap-2 text-red-300">
                    <LogoutIcon style={{ fontSize: "18px" }} />
                    Logout
                  </span>
                  <span className="settings-row__description">
                    End this browser session.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="glossy_container settings-card">
          <div className="settings-card__header">
            <div className="settings-card__title-group">
              <h2 className="settings-card__title">Security summary</h2>
              <p className="settings-card__description">
                Vault protects your saved credentials with encrypted transport,
                masked fields, and session-based access.
              </p>
            </div>
            <ShieldOutlinedIcon className="text-white/30" />
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot" />
              <span>Account access is protected by your current sign-in token.</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <span>Sensitive vault entries remain masked until manually revealed.</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <span className="flex items-center gap-2">
                <HistoryOutlinedIcon style={{ fontSize: "16px" }} />
                Last review: today
              </span>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default App;
