import React, { useEffect, useState, useMemo, useCallback } from "react";
import { SubmitHandler } from "react-hook-form";
import PasswordCard from "@/components/PasswordCard";
import AddPassword from "@/components/AddPassword";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { addPassword, UserPasswords, CSVData } from "@/types/interface";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Skeleton from "@mui/material/Skeleton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Papa from "papaparse";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import useUserSettings from "@/hooks/useUserSettings";
import useVaultSessionLock from "@/hooks/useVaultSessionLock";
import AppLayout from "@/components/layout/AppLayout";
import VaultPageSkeleton from "@/components/layout/VaultPageSkeleton";
import { skeletonStyle } from "@/utils/muiStyles";
import { calculateStrength } from "@/utils/passwordStrength";
import { ROUTES } from "@/utils/routes";

const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<UserPasswords[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCredential, setSelectedCredential] =
    useState<addPassword | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<addPassword | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const { allowRender, isChecking } = useProtectedRoute();
  const { settings } = useUserSettings(allowRender);
  const remindersShownRef = React.useRef(false);

  useVaultSessionLock(settings.lockOnClose, settings.autoLockTimeout);

  const fetchCredentials = useCallback(async () => {
    setFetchError(null);
    try {
      const response = await axios.get("/profile/managePasswords");
      const userPasswords = response?.data?.passwords;
      setCredentials(userPasswords);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      setFetchError(message);
      showToast(message, "error");
    }
  }, [showToast]);

  useEffect(() => {
    if (allowRender) {
      fetchCredentials();
    }
  }, [allowRender, fetchCredentials]);

  useEffect(() => {
    if (!settings.securityReminders || !credentials?.length || remindersShownRef.current) {
      return;
    }

    const weakCount = credentials.filter(
      (credential) => calculateStrength(credential.password) < 40,
    ).length;
    const passwordCounts = credentials.reduce<Record<string, number>>(
      (counts, credential) => {
        counts[credential.password] = (counts[credential.password] || 0) + 1;
        return counts;
      },
      {},
    );
    const reusedCount = Object.values(passwordCounts).filter((count) => count > 1).length;

    if (weakCount > 0) {
      showToast(
        `${weakCount} saved password${weakCount === 1 ? "" : "s"} look weak. Consider updating them.`,
        "warning",
      );
      remindersShownRef.current = true;
      return;
    }

    if (reusedCount > 0) {
      showToast(
        "Some saved passwords are reused across entries. Use unique passwords where possible.",
        "info",
      );
      remindersShownRef.current = true;
    }
  }, [credentials, settings.securityReminders, showToast]);

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedCredential(null);
  };

  const onSubmit: SubmitHandler<addPassword> = async (data) => {
    try {
      if (!isEdit) {
        const response = await axios.post("/profile/managePasswords", data);
        if (response.status === 201) {
          showToast(response?.data?.message, "success");
          setCredentials((prev) => [...(prev ?? []), response.data.newData]);
        }
      } else {
        const response = await axios.patch(
          `/profile/managePasswords/${selectedCredential?.id}`,
          data,
        );
        if (response.status === 200) {
          showToast(response?.data?.message, "success");
          const updatedData = response?.data?.updatedData;
          setCredentials(
            credentials?.map((cred) =>
              cred?.id === updatedData?.id ? updatedData : cred,
            ) ?? [],
          );
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      handleClose();
    }
  };

  const handleEditButton = (data: addPassword) => {
    setOpen(true);
    setSelectedCredential(data);
    setIsEdit(true);
  };

  const handleDeleteButton = (data: addPassword) => {
    setDeleteTarget(data);
  };

  const confirmDelete = async () => {
    const id = deleteTarget?.id;
    if (!id) return;

    try {
      const response = await axios.delete(`/profile/managePasswords/${id}`);
      if (response?.status === 200) {
        const updatedCredentials =
          credentials?.filter((cred) => cred?.id !== id) ?? [];
        setCredentials(updatedCredentials);
        showToast(response?.data?.message, "success");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredCredentials = useMemo(() => {
    if (!searchQuery) return credentials;
    return credentials?.filter(
      (cred) =>
        cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.url.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [credentials, searchQuery]);

  const importCSV = (file: File | null) => {
    if (!file) {
      showToast("No file selected", "error");
      return;
    }
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const csvData = results.data as CSVData[];
        const filtered = csvData.filter(
          (creds) =>
            creds.name || creds.url || creds.username || creds.password,
        );
        try {
          const response = await axios.post("/profile/importCSV", {
            csvData: filtered,
          });
          if (response.status === 200) {
            showToast(response.data.message, "success");
            setCredentials((prev) => [
              ...(prev ?? []),
              ...response.data.newData,
            ]);
          }
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const message =
            err?.response?.data?.message || "Something went wrong";
          showToast(message, "error");
        }
      },
    });
  };

  const exportCSV = () => {
    if (!credentials || credentials.length === 0) {
      showToast("No passwords to export", "error");
      return;
    }

    const csvData = Papa.unparse(
      credentials.map((cred) => ({
        name: cred.name,
        url: cred.url,
        username: cred.userName,
        password: cred.password,
      })),
    );

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vault-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Vault exported successfully", "success");
  };

  if (isChecking || !allowRender) {
    return (
      <AppLayout title="Vault — Vault" contentVariant="wide" showFooter={false}>
        <VaultPageSkeleton />
      </AppLayout>
    );
  }

  const hasFilteredResults =
    filteredCredentials && filteredCredentials.length > 0;
  const isSearching = searchQuery.length > 0;

  return (
    <AppLayout
      title="Vault — Vault"
      description="Manage your saved passwords"
      contentVariant="wide"
      showBack
      onBack={() => router.push(ROUTES.profile)}
    >
      <div className="flex flex-col w-full gap-6">
        <section className="glossy_container vault-toolbar-card flex flex-col gap-5">
          <div className="account-header">
            <div className="account-header__copy">
              <span className="account-kicker">Vault</span>
              <h1 className="account-title">Password Vault</h1>
              <p className="account-description">
                Search, save, import, and export credentials with clear security
                actions.
              </p>
            </div>
            <span className="status-badge status-badge--success">
              Encrypted storage
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0 lg:w-auto lg:flex-1 lg:max-w-2xl">
              <div className="flex items-center w-full min-w-0 gap-3 px-4 py-3 rounded-[14px] bg-white/5 border border-white/10">
                <SearchIcon
                  className="text-white/40 shrink-0"
                  style={{ fontSize: "22px" }}
                />
                <input
                  type="text"
                  placeholder="Search your saved passwords..."
                  value={searchQuery}
                  className="bg-transparent border-none outline-none text-[#DCD7C9] w-full min-w-0 placeholder:text-white/30"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  aria-label="Search passwords"
                />
              </div>
              <button
                type="button"
                className="btn-ghost min-h-11 px-4 py-3 rounded-[14px] w-full sm:w-auto"
                onClick={() => setOpen(true)}
                aria-label="Add password"
              >
                <AddIcon style={{ fontSize: "20px" }} />
                <span className="sm:inline">Add Password</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <label className="btn-ghost px-4 sm:px-5 py-3 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit min-h-11">
                <FileUploadIcon style={{ fontSize: "20px" }} />
                Import CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    importCSV(selectedFile);
                  }}
                />
              </label>
              <button
                type="button"
                className="btn-ghost px-4 sm:px-5 py-3 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit min-h-11"
                onClick={exportCSV}
              >
                <DownloadIcon style={{ fontSize: "20px" }} />
                Export CSV
              </button>
            </div>
          </div>
        </section>

        {credentials === null && !fetchError ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 w-full">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                animation="wave"
                width="100%"
                height={190}
                sx={skeletonStyle}
              />
            ))}
          </div>
        ) : fetchError ? (
          <EmptyState
            title="Failed to load vault"
            description={fetchError}
            action={
              <button
                type="button"
                className="btn-primary"
                onClick={fetchCredentials}
              >
                Try again
              </button>
            }
          />
        ) : hasFilteredResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 w-full">
            {filteredCredentials?.map((creds: UserPasswords) => (
              <PasswordCard
                key={creds?.id}
                id={creds?.id}
                name={creds?.name}
                url={creds?.url}
                userName={creds?.userName}
                password={creds?.password}
                maskByDefault={settings.maskSensitiveData}
                clipboardClearSeconds={settings.clipboardTimer}
                handleEditButton={() => handleEditButton(creds)}
                handleDeleteButton={() => handleDeleteButton(creds)}
              />
            ))}
          </div>
        ) : isSearching ? (
          <EmptyState
            icon={<SearchOffIcon style={{ fontSize: "28px" }} />}
            title="No results found"
            description={`No passwords match "${searchQuery}". Try a different search term.`}
            action={
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<LockOutlinedIcon style={{ fontSize: "28px" }} />}
            title="No passwords saved yet"
            description="Add your first credential or import from a CSV file to get started."
            action={
              <button
                type="button"
                className="btn-primary"
                onClick={() => setOpen(true)}
              >
                Add your first password
              </button>
            }
          />
        )}
      </div>

      <AddPassword
        open={open}
        handleClose={handleClose}
        submitHandler={onSubmit}
        selectedCredential={selectedCredential}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete password?"
        message={`Are you sure you want to delete credentials for "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default App;
