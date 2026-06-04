import React, { useEffect, useState, useMemo } from "react";
import { SubmitHandler } from "react-hook-form";
import PasswordCard from "@/components/PasswordCard";
import AddPassword from "@/components/AddPassword";
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
import Papa from "papaparse";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Head from "next/head";
import AppHeader from "@/components/AppHeader";

const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<UserPasswords[] | null>(null);
  const [selectedCredential, setSelectedCredential] =
    useState<addPassword | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { showToast } = useToast();
  const allowRender = useProtectedRoute();

  useEffect(() => {
    const storedCredentials = async () => {
      try {
        const response = await axios.get("/profile/managePasswords");
        const userPasswords = response?.data?.passwords;
        setCredentials(userPasswords);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err?.response?.data?.message || "Something went wrong";
        showToast(message, "error");
      }
    };

    storedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleDeleteButton = async (data: addPassword) => {
    const id = data?.id;
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
  };

  if (!allowRender) return null;

  return (
    <>
      <Head>
        <title>My Vault — Vault</title>
        <meta name="description" content="Manage your saved passwords" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main block!">
        <AppHeader
          onBack={() => router.back()}
          onLogoClick={() => router.push("/home")}
        />
        <div className="min-h-[inherit] flex flex-col w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mx-auto! w-full max-w-7xl">
            <div className="flex flex-col sm:flex-row gap-3 w-full min-w-0 lg:w-auto lg:flex-1 lg:max-w-2xl">
              <div className="flex items-center w-full min-w-0 gap-3 px-4! py-3! rounded-[14px] glossy_container">
                <SearchIcon
                  className="text-white/40 shrink-0"
                  style={{ fontSize: "22px" }}
                />
                <input
                  type="text"
                  placeholder="Search your saved passwords..."
                  className="bg-transparent border-none outline-none text-[#DCD7C9] w-full min-w-0 placeholder:text-white/30"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>
              <div className="my-auto! mx-0!">
                <button
                  className="flex items-center justify-center min-h-11 px-4! py-3! rounded-[14px] text-sm font-medium 
               text-white/80 cursor-pointer border border-white/10 bg-white/5 
               hover:bg-white/10 hover:border-white/20 hover:text-white 
               transition-all duration-150 backdrop-blur-md w-full sm:w-auto"
                  id="add"
                  onClick={() => setOpen(true)}
                >
                  <AddIcon style={{ fontSize: "20px" }} />
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <label className="glossy_container text-1 px-4! sm:px-5! py-3! cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit min-h-11">
                <DownloadIcon style={{ fontSize: "20px" }} />
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
              <label className="glossy_container text-1 px-4! sm:px-5! py-3! cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit min-h-11">
                <FileUploadIcon style={{ fontSize: "20px" }} />
                <button className="cursor-pointer" onClick={exportCSV}>
                  Export CSV
                </button>
              </label>
            </div>
          </div>
          {credentials === null ? (
            // Loading state
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 my-6! sm:my-10! w-full max-w-7xl mx-auto!">
              {[...Array(10)].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height={190}
                  sx={{
                    borderRadius: "20px",
                    bgcolor: "rgba(255,255,255,0.07)",
                  }}
                />
              ))}
            </div>
          ) : credentials.length > 0 ? (
            // Cards
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 my-6! sm:my-10! w-full max-w-7xl mx-auto!">
              {filteredCredentials?.map((creds: UserPasswords) => (
                <PasswordCard
                  key={creds?.id}
                  id={creds?.id}
                  name={creds?.name}
                  url={creds?.url}
                  userName={creds?.userName}
                  password={creds?.password}
                  handleEditButton={() => handleEditButton(creds)}
                  handleDeleteButton={() => handleDeleteButton(creds)}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center text-white/30 mt-20! text-sm">
              No passwords saved yet
            </div>
          )}
        </div>
      </div>
      {/* {open && ( */}
      <AddPassword
        open={open}
        handleClose={handleClose}
        submitHandler={onSubmit}
        selectedCredential={selectedCredential}
      />
      {/* )} */}
    </>
  );
};

export default App;
