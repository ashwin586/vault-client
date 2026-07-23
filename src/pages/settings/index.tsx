import React, { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityItem,
  ApiError,
  ProfileInfo,
  ProfileResponseUser,
  SecurityMetadata,
  SecuritySummary,
} from "@/types/interface";
import { useRouter } from "next/router";
import { useToast } from "@/context/ToastContext";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import AppLayout from "@/components/layout/AppLayout";
import PageLoader from "@/components/layout/PageLoader";
import UserAvatar from "@/components/ui/UserAvatar";
import Skeleton from "@mui/material/Skeleton";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import {
  glassInput,
  linearProgressStyle,
  skeletonStyle,
  sliderStyle,
  switchStyle,
} from "@/utils/muiStyles";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  calculateStrength,
  getStrengthColor,
  getStrengthLabel,
} from "@/utils/passwordStrength";
import { ROUTES } from "@/utils/routes";
import { formatDateTime } from "@/utils/formatDateTime";
import {
  decryptPassword,
  deriveKeys,
  encryptPassword,
  generateSalt,
} from "@/utils/vaultCrypto";
import { clearVaultKey } from "@/utils/vaultKeyStore";
import { logoutSession } from "@/utils/logout";
import { clearAuthSession } from "@/utils/auth";
import { unlockVaultSession } from "@/hooks/useVaultSessionLock";

const App = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [securityMetadata, setSecurityMetadata] =
    useState<SecurityMetadata | null>(null);
  const [activeSessions, setActiveSessions] = useState(1);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [securitySummary, setSecuritySummary] =
    useState<SecuritySummary | null>(null);
  const [autoLockTimeout, setAutoLockTimeout] = useState(15);
  const [clipboardTimer, setClipboardTimer] = useState(30);
  const [maskSensitiveData, setMaskSensitiveData] = useState(true);
  const [securityReminders, setSecurityReminders] = useState(true);
  const [lockOnClose, setLockOnClose] = useState(true);
  const [generatorLength, setGeneratorLength] = useState(18);
  const [generatorSymbols, setGeneratorSymbols] = useState(true);
  const [generatorNumbers, setGeneratorNumbers] = useState(true);
  const [generatorUppercase, setGeneratorUppercase] = useState(true);
  const [generatorLowercase, setGeneratorLowercase] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const { allowRender, isChecking } = useProtectedRoute();

  const {
    register,
    formState: { errors, dirtyFields, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<ProfileInfo>();

  const newPasswordValue = watch("newPassword") || "";
  const currentPasswordValue = watch("currentPassword") || "";
  const passwordStrength = useMemo(
    () => calculateStrength(newPasswordValue),
    [newPasswordValue],
  );
  const passwordStrengthColor = getStrengthColor(passwordStrength);
  const passwordStrengthLabel = getStrengthLabel(passwordStrength);
  const lastLogin = useMemo(
    () => formatDateTime(securityMetadata?.lastLoginAt),
    [securityMetadata],
  );
  const lastPasswordUpdated = useMemo(
    () => formatDateTime(securityMetadata?.lastPasswordUpdatedAt),
    [securityMetadata],
  );

  useEffect(() => {
    if (!allowRender) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        const profile: ProfileResponseUser = response?.data?.user;
        const { name, email, settings, securityMetadata, activeSessions, activity, securitySummary } =
          profile;
        setUserName(name);
        reset({ name, email });
        setSecurityMetadata(securityMetadata || null);
        setActiveSessions(activeSessions || 1);
        setActivity(activity || []);
        setSecuritySummary(securitySummary || null);
        if (settings) {
          setAutoLockTimeout(settings.autoLockTimeout ?? 15);
          setClipboardTimer(settings.clipboardTimer ?? 30);
          setMaskSensitiveData(settings.maskSensitiveData ?? true);
          setSecurityReminders(settings.securityReminders ?? true);
          setLockOnClose(settings.lockOnClose ?? true);
          setGeneratorLength(settings.generatorLength ?? 18);
          setGeneratorSymbols(settings.generatorSymbols ?? true);
          setGeneratorNumbers(settings.generatorNumbers ?? true);
          setGeneratorUppercase(settings.generatorUppercase ?? true);
          setGeneratorLowercase(settings.generatorLowercase ?? true);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          const message = error?.response?.data?.message;
          showToast(message, "error");
          router.push("/home");
        } else {
          showToast("Failed to load account details", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowRender]);

  const onSubmit: SubmitHandler<ProfileInfo> = async (data) => {
    const payload: Partial<ProfileInfo> = {};
    if (dirtyFields.name) {
      payload.name = data.name;
    }

    if (
      (data.currentPassword && !data.newPassword) ||
      (!data.currentPassword && data.newPassword)
    ) {
      showToast(
        "Both current password and new password are required for password update",
        "warning",
      );
      return;
    }

    try {
      if (data.currentPassword && data.newPassword) {
        const saltResponse = await axios.get("/auth/salt", {
          params: { email: data.email },
        });
        const currentSalt = saltResponse?.data?.salt;
        if (!currentSalt) {
          showToast("Unable to verify current password", "error");
          return;
        }

        const currentKeys = await deriveKeys(
          data.currentPassword,
          currentSalt,
        );
        const newSalt = generateSalt();
        const newKeys = await deriveKeys(data.newPassword, newSalt);

        const vaultResponse = await axios.get("/profile/managePasswords");
        const encryptedEntries = (vaultResponse?.data?.passwords || []) as Array<{
          id: string;
          name: string;
          url: string;
          userName: string;
          password: string;
          iv: string;
        }>;

        const reencryptedEntries = await Promise.all(
          encryptedEntries.map(async (entry) => {
            const plaintext = await decryptPassword(
              entry.password,
              entry.iv,
              currentKeys.vaultKey,
            );
            const { ciphertext, iv } = await encryptPassword(
              plaintext,
              newKeys.vaultKey,
            );
            return {
              id: entry.id,
              name: entry.name,
              url: entry.url,
              userName: entry.userName,
              password: ciphertext,
              iv,
            };
          }),
        );

        // Re-encrypt vault while the current session is still valid.
        for (const entry of reencryptedEntries) {
          await axios.patch(`/profile/managePasswords/${entry.id}`, {
            name: entry.name,
            url: entry.url,
            userName: entry.userName,
            password: entry.password,
            iv: entry.iv,
          });
        }

        payload.currentPassword = currentKeys.authHash;
        payload.newPassword = newKeys.authHash;
        payload.vaultSalt = newSalt;

        // Password change revokes all sessions server-side.
        const response = await axios.patch("/profile", {
          ...payload,
          ...(dirtyFields.name ? { name: data.name } : {}),
        });
        if (response.status !== 200) {
          return;
        }

        clearVaultKey();
        clearAuthSession();
        unlockVaultSession();
        showToast(
          response?.data?.message ||
            "Password updated. Please sign in with your new master password.",
          "success",
        );
        router.push("/auth/login");
        return;
      }

      if (Object.keys(payload).length === 0) {
        showToast("No changes to save", "info");
        return;
      }

      const response = await axios.patch("/profile", payload);
      if (response.status === 200) {
        showToast(response?.data?.message, "success");
        if (data.name) {
          setUserName(data.name);
        }
        setIsEdit(false);
        reset({
          ...data,
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      if (err?.response?.status === 400) {
        const data = err.response.data;
        showToast(data.message, "error");
      } else {
        showToast("Failed to update profile", "error");
      }
    }
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const settingsPayload = {
        autoLockTimeout,
        clipboardTimer,
        maskSensitiveData,
        securityReminders,
        lockOnClose,
        generatorLength,
        generatorSymbols,
        generatorNumbers,
        generatorUppercase,
        generatorLowercase,
        language: "English",
      };
      const response = await axios.patch("/profile/settings", settingsPayload);
      localStorage.setItem("vault-settings", JSON.stringify(settingsPayload));
      showToast(response?.data?.message || "Settings updated", "success");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      showToast(err?.response?.data?.message || "Failed to save settings", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const updateGeneratorRule = (
    nextValue: boolean,
    setter: (value: boolean) => void,
  ) => {
    const enabledCount = [
      generatorSymbols,
      generatorNumbers,
      generatorUppercase,
      generatorLowercase,
    ].filter(Boolean).length;

    if (!nextValue && enabledCount === 1) {
      showToast(
        "At least one password generation rule must remain enabled.",
        "warning",
      );
      return;
    }

    setter(nextValue);
  };

  const logoutAllDevices = async () => {
    try {
      const response = await axios.delete("/profile/sessions");
      showToast(response?.data?.message || "Signed out from all devices", "success");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      showToast(
        err?.response?.data?.message || "Failed to sign out all devices",
        "error",
      );
    } finally {
      await logoutSession();
      router.push("/home");
    }
  };

  if (isChecking || !allowRender) {
    return (
      <AppLayout title="Settings — Vault" contentVariant="centered" showFooter={false}>
        <PageLoader label="Loading settings" />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Settings — Vault"
      description="Manage your account settings"
      contentVariant="wide"
      showBack
      onBack={() => router.push(ROUTES.profile)}
    >
      <div className="account-page">
        <section className="glossy_container account-shell flex flex-col gap-6">
          <div className="account-header">
            <div className="account-header__copy">
              <span className="account-kicker">Settings</span>
              <h1 className="account-title">Account security center</h1>
              <p className="account-description">
                Manage your profile, password, privacy defaults, and vault
                behavior from one trusted place.
              </p>
            </div>
            <span className="status-badge status-badge--success">
              <VerifiedUserOutlinedIcon style={{ fontSize: "16px" }} />
              Account protected
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {isLoading ? (
              <Skeleton
                variant="circular"
                width={96}
                height={96}
                sx={{ ...skeletonStyle, margin: "0 auto" }}
              />
            ) : (
              <UserAvatar name={userName} size={96} className="user__avatar" />
            )}
            <div className="text-center sm:text-left flex flex-col gap-2 min-w-0">
              <h2 className="text-xl font-bold text-white">
                {isLoading ? "Loading account..." : userName || "Vault user"}
              </h2>
              <p className="text-sm text-white/45">
                Profile details and sensitive changes are saved only when you
                confirm them.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="status-badge status-badge--success">
                  Encryption active
                </span>
                <span className="status-badge status-badge--info">
                  Last login {lastLogin}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="settings-grid">
          <section className="glossy_container settings-card">
            <div className="settings-card__header">
              <div className="settings-card__title-group">
                <h2 className="settings-card__title">Profile details</h2>
                <p className="settings-card__description">
                  Keep your account identity current. Email is locked for
                  security.
                </p>
              </div>
              <span className="status-badge status-badge--info">
                Verified
              </span>
            </div>

            <form className="form__profile" onSubmit={handleSubmit(onSubmit)}>
              <div className="settings-form-section">
                <div className="settings-form-section__header">
                  <span className="settings-form-section__eyebrow">
                    Personal Information
                  </span>
                  <p className="settings-form-section__description">
                    These details identify your Vault account across the app.
                  </p>
                </div>

                <div className="settings-form-grid">
                  <TextField
                    required
                    id="name"
                    label="Name"
                    variant="filled"
                    fullWidth
                    {...register("name", {
                      required: "Name is required field.",
                      minLength: {
                        value: 4,
                        message: "Name must be at least 4 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z][A-Za-z\s]*$/,
                        message:
                          "Name must start with a letter and contain only alphabets and spaces.",
                      },
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message || " "}
                    className={
                      dirtyFields.name && !errors.name
                        ? "settings-field--success"
                        : undefined
                    }
                    sx={glassInput}
                    disabled={!isEdit || isLoading}
                  />

                  <TextField
                    required
                    id="email"
                    label="Email"
                    variant="filled"
                    fullWidth
                    sx={glassInput}
                    {...register("email", {
                      required: "Email is required field.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message || "Verified email address"}
                    disabled
                  />
                </div>
              </div>

              {isEdit && (
                <div className="settings-form-section">
                  <div className="settings-form-section__header">
                    <span className="settings-form-section__eyebrow">
                      Account Credentials
                    </span>
                    <p className="settings-form-section__description">
                      Choose a strong master password and keep it safe. It
                      cannot be recovered if forgotten.
                    </p>
                  </div>

                  <div className="settings-form-grid">
                    <TextField
                      id="currentPassword"
                      label="Current Password"
                      variant="filled"
                      fullWidth
                      sx={glassInput}
                      type="password"
                      {...register("currentPassword", {
                        validate: (value) =>
                          newPasswordValue && !value
                            ? "Current Password is required to change password."
                            : true,
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message || " "}
                      className={
                        currentPasswordValue && !errors.currentPassword
                          ? "settings-field--success"
                          : undefined
                      }
                    />

                    <div className="settings-password-field">
                      <TextField
                        id="newPassword"
                        label="New Password"
                        variant="filled"
                        fullWidth
                        sx={glassInput}
                        type="password"
                        {...register("newPassword", {
                          validate: (value) =>
                            currentPasswordValue && !value
                              ? "New Password is required to change password."
                              : true,
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message || " "}
                        className={
                          newPasswordValue && !errors.newPassword
                            ? "settings-field--success"
                            : undefined
                        }
                      />
                      <div className="settings-password-meter">
                        <span className="text-xs text-white/35">
                          Password strength
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: passwordStrengthColor }}
                        >
                          {newPasswordValue ? passwordStrengthLabel : "Not entered"}
                        </span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={newPasswordValue ? passwordStrength : 0}
                        sx={linearProgressStyle(passwordStrengthColor)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isEdit ? (
                <div className="profile__action__btn__sec">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsEdit(true)}
                    disabled={isLoading}
                  >
                    Edit profile or password
                  </button>
                </div>
              ) : (
                <div className="profile__action__btn__sec">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setIsEdit(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className="glossy_container settings-card">
            <div className="settings-card__header">
              <div className="settings-card__title-group">
                <h2 className="settings-card__title">Account Security</h2>
                <p className="settings-card__description">
                  A quick health snapshot for your vault and account.
                </p>
              </div>
              <ShieldOutlinedIcon className="text-white/30" />
            </div>

            <div className="settings-stack">
              <div className="settings-meta-card">
                <p className="settings-meta-card__label">Account status</p>
                <p className="settings-meta-card__value">
                  {securitySummary?.accountStatus || "Protected"}
                </p>
              </div>
              <div className="settings-meta-card">
                <p className="settings-meta-card__label">Encryption status</p>
                <p className="settings-meta-card__value">
                  {securitySummary?.encryptionStatus || "Ready"}
                </p>
                <p className="settings-meta-card__hint">
                  Vault secrets are encrypted on your device. The server never
                  receives plaintext passwords or your vault key.
                </p>
              </div>
              <div className="settings-meta-card">
                <p className="settings-meta-card__label">Password health score</p>
                {securitySummary?.passwordHealthScore != null ? (
                  <div className="flex items-center gap-3">
                    <div className="health-meter">
                      <div
                        className="health-meter__bar"
                        style={{
                          width: `${securitySummary.passwordHealthScore}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-white/70 font-bold">
                      {securitySummary.passwordHealthScore}%
                    </span>
                  </div>
                ) : (
                  <p className="settings-meta-card__value">
                    Checked locally in your vault
                  </p>
                )}
                {securitySummary && securitySummary.savedPasswordCount > 0 && (
                  <p className="settings-meta-card__hint">
                    {securitySummary.savedPasswordCount} encrypted credential
                    {securitySummary.savedPasswordCount === 1 ? "" : "s"} stored.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {securitySummary?.maskingEnabled ? (
                  <span className="status-badge status-badge--info">
                    Vault masking on
                  </span>
                ) : (
                  <span className="status-badge">Vault masking off</span>
                )}
                <span className="status-badge status-badge--success">
                  Zero-knowledge vault
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="glossy_container settings-card">
          <div className="settings-card__header">
            <div className="settings-card__title-group">
              <h2 className="settings-card__title">
                Master password &amp; zero-knowledge
              </h2>
              <p className="settings-card__description">
                Why your vault stays private—and why we cannot recover your
                password.
              </p>
            </div>
            <LockClockOutlinedIcon className="text-white/30" />
          </div>

          <div className="settings-stack">
            <div className="settings-meta-card">
              <p className="settings-meta-card__label">How encryption works</p>
              <p className="settings-meta-card__hint" style={{ marginTop: 6 }}>
                Your vault is encrypted on this device with a key derived from
                your master password. Only ciphertext is stored on the server.
                We never receive your master password or vault key.
              </p>
            </div>
            <div className="settings-meta-card">
              <p className="settings-meta-card__label">No password recovery</p>
              <p className="settings-meta-card__hint" style={{ marginTop: 6 }}>
                Because the encryption key comes from your master password,
                there is no reset or recovery path. If you forget it, your
                encrypted vault cannot be unlocked—not by you, and not by us.
                Store your master password safely.
              </p>
            </div>
          </div>
        </section>

        <div className="settings-grid">
          <section className="glossy_container settings-card">
            <div className="settings-card__header">
              <div className="settings-card__title-group">
                <h2 className="settings-card__title">Security settings</h2>
                <p className="settings-card__description">
                  Session and password controls that make the vault feel
                  deliberate and safe.
                </p>
              </div>
              <PasswordOutlinedIcon className="text-white/30" />
            </div>

            <div className="settings-stack">
              <div className="settings-row">
                <div className="settings-row__content">
                  <span className="settings-row__title">Last password updated</span>
                  <span className="settings-row__description">
                      Updated whenever your account password is changed.
                  </span>
                </div>
                  <span className="status-badge">{lastPasswordUpdated}</span>
              </div>
              <div className="settings-row">
                <div className="settings-row__content">
                  <span className="settings-row__title flex items-center gap-2">
                    <DevicesOutlinedIcon style={{ fontSize: "18px" }} />
                    Logged in devices
                  </span>
                  <span className="settings-row__description">
                    Current browser session on this device.
                  </span>
                </div>
                <span className="status-badge status-badge--success">
                  {activeSessions} active
                </span>
              </div>
              <div className="settings-row">
                <div className="settings-row__content">
                  <span className="settings-row__title">Logout from all devices</span>
                  <span className="settings-row__description">
                    Revoke all active sessions, then sign out from this device.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={logoutAllDevices}
                >
                  <LogoutIcon style={{ fontSize: "16px" }} />
                  Logout
                </button>
              </div>
            </div>
          </section>

          <section className="glossy_container settings-card">
            <div className="settings-card__header">
              <div className="settings-card__title-group">
                <h2 className="settings-card__title">Recent account activity</h2>
                <p className="settings-card__description">
                  Basic local activity indicators for clarity and confidence.
                </p>
              </div>
              <HistoryOutlinedIcon className="text-white/30" />
            </div>

            <div className="activity-list">
              {activity.length > 0 ? (
                activity.slice(0, 5).map((item, index) => (
                  <div className="activity-item" key={`${item.type}-${index}`}>
                    <span className="activity-dot" />
                    <span>
                      {item.message} at {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <span className="activity-dot" />
                  <span>Successful login from this browser at {lastLogin}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="glossy_container settings-card">
          <div className="settings-card__header">
            <div className="settings-card__title-group">
              <h2 className="settings-card__title">Privacy & vault behavior</h2>
              <p className="settings-card__description">
                These local preferences define how cautious Vault should feel
                while you work.
              </p>
            </div>
            <LockClockOutlinedIcon className="text-white/30" />
          </div>

          <div className="settings-stack">
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title flex items-center gap-2">
                  <LockClockOutlinedIcon style={{ fontSize: "18px" }} />
                  Auto-lock vault timeout
                </span>
                <span className="settings-row__description">
                  Lock vault after {autoLockTimeout} minutes of inactivity.
                </span>
              </div>
              <div className="w-full sm:w-56">
                <Slider
                  value={autoLockTimeout}
                  min={5}
                  max={60}
                  step={5}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => setAutoLockTimeout(value as number)}
                  sx={sliderStyle}
                />
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title flex items-center gap-2">
                  <ContentCopyOutlinedIcon style={{ fontSize: "18px" }} />
                  Clipboard auto-clear timer
                </span>
                <span className="settings-row__description">
                  Clear copied passwords after {clipboardTimer} seconds.
                </span>
              </div>
              <div className="w-full sm:w-56">
                <Slider
                  value={clipboardTimer}
                  min={10}
                  max={120}
                  step={10}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => setClipboardTimer(value as number)}
                  sx={sliderStyle}
                />
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title flex items-center gap-2">
                  <VisibilityOffOutlinedIcon style={{ fontSize: "18px" }} />
                  Mask sensitive data by default
                </span>
                <span className="settings-row__description">
                  Keep passwords hidden until you explicitly reveal them.
                </span>
              </div>
              <Switch
                checked={maskSensitiveData}
                onChange={(event) => setMaskSensitiveData(event.target.checked)}
                sx={switchStyle}
              />
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title flex items-center gap-2">
                  <NotificationsActiveOutlinedIcon style={{ fontSize: "18px" }} />
                  Security reminders
                </span>
                <span className="settings-row__description">
                  Show reminders for weak, reused, or aging passwords.
                </span>
              </div>
              <Switch
                checked={securityReminders}
                onChange={(event) => setSecurityReminders(event.target.checked)}
                sx={switchStyle}
              />
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title">Lock vault when leaving</span>
                <span className="settings-row__description">
                  Require a fresh session when returning after closing the app.
                </span>
              </div>
              <Switch
                checked={lockOnClose}
                onChange={(event) => setLockOnClose(event.target.checked)}
                sx={switchStyle}
              />
            </div>
          </div>
        </section>

        <section className="glossy_container settings-card">
          <div className="settings-card__header">
            <div className="settings-card__title-group">
              <h2 className="settings-card__title">Preferences</h2>
              <p className="settings-card__description">
                Defaults for the password generator and interface appearance.
              </p>
            </div>
            <PaletteOutlinedIcon className="text-white/30" />
          </div>

          <div className="settings-stack">
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title">Appearance</span>
                <span className="settings-row__description">
                  Vault currently uses the default dark theme.
                </span>
              </div>
              <span className="status-badge">Dark theme</span>
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title">Default generator length</span>
                <span className="settings-row__description">
                  New passwords default to {generatorLength} characters.
                </span>
              </div>
              <div className="w-full sm:w-56">
                <Slider
                  value={generatorLength}
                  min={8}
                  max={50}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => setGeneratorLength(value as number)}
                  sx={sliderStyle}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Symbols",
                  checked: generatorSymbols,
                  onChange: setGeneratorSymbols,
                },
                {
                  label: "Numbers",
                  checked: generatorNumbers,
                  onChange: setGeneratorNumbers,
                },
                {
                  label: "Uppercase",
                  checked: generatorUppercase,
                  onChange: setGeneratorUppercase,
                },
                {
                  label: "Lowercase",
                  checked: generatorLowercase,
                  onChange: setGeneratorLowercase,
                },
              ].map((item) => (
                <div className="settings-row" key={item.label}>
                  <div className="settings-row__content">
                    <span className="settings-row__title">{item.label}</span>
                  </div>
                  <Switch
                    checked={item.checked}
                    onChange={(event) =>
                      updateGeneratorRule(event.target.checked, item.onChange)
                    }
                    sx={switchStyle}
                  />
                </div>
              ))}
            </div>
            <div className="settings-row">
              <div className="settings-row__content">
                <span className="settings-row__title flex items-center gap-2">
                  <LanguageOutlinedIcon style={{ fontSize: "18px" }} />
                  Language
                </span>
                <span className="settings-row__description">
                  More languages can be added later.
                </span>
              </div>
              <span className="status-badge">English</span>
            </div>
            <div className="profile__action__btn__sec">
              <button
                type="button"
                className="btn-primary"
                onClick={saveSettings}
                disabled={isSavingSettings}
              >
                {isSavingSettings ? "Saving..." : "Save preferences"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default App;
