import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { ProfileInfo, ApiError } from "@/types/interface";
import { useRouter } from "next/router";
import { useToast } from "@/context/ToastContext";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { textFieldStyles } from "@/utils/muiStyles";
import AppHeader from "@/components/AppHeader";

const App = () => {
  // const [token, setToken] = useState<string | undefined>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<ProfileInfo>();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken) {
      router.push("/home");
      return;
    }

    // setToken(accessToken);
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
        const { name, email } = response?.data?.user;
        reset({
          name,
          email,
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

  const onSubmit: SubmitHandler<ProfileInfo> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {};
    if (dirtyFields.name) {
      payload.name = data.name;
    }

    if (data.currentPassword && data.newPassword) {
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      console.log("No changes to submit");
      return;
    }
    try {
      const response = await axios.patch("/profile", payload);
      if (response.status === 200) {
        showToast(response?.data?.message, "success");
      }
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<ApiError>;
      if (err?.response?.status === 400) {
        const data = err.response.data;
        showToast(data.message, "error");
      }
    }
  };

  return (
    <>
      <div className="main">
        <AppHeader
          onBack={() => router.back()}
          onLogoClick={() => router.push("/home")}
        />
        <div className="profile__main glossy_container p-5! sm:p-8!">
          <div className="user__avatar__container">
            <Image
              src="/default_profile_picture.png"
              alt="A default profile picture"
              width={100}
              height={100}
              className="user__avatar"
            />
          </div>
          <form className="form__profile" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              required
              id="outlined-required"
              label="Name"
              defaultValue=" "
              variant="outlined"
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
              sx={textFieldStyles}
              disabled={!isEdit}
            />
            {errors.name && <p className="alert__err">{errors.name.message}</p>}

            <TextField
              required
              id="outlined-required"
              label="Email"
              defaultValue=" "
              variant="outlined"
              sx={textFieldStyles}
              {...register("email", {
                required: "Email is required field.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              disabled={true}
            />
            {errors.email && (
              <p className="alert__err">{errors.email.message}</p>
            )}
            {isEdit && (
              <>
                <TextField
                  required
                  id="outlined-required"
                  label="Current Password"
                  defaultValue=" "
                  variant="outlined"
                  sx={textFieldStyles}
                  {...register("currentPassword", {
                    required: "Current Password is required field.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.currentPassword && (
                  <p className="alert__err">{errors.currentPassword.message}</p>
                )}

                <TextField
                  required
                  id="outlined-required"
                  label="New Password"
                  defaultValue=" "
                  variant="outlined"
                  sx={textFieldStyles}
                  {...register("newPassword", {
                    required: "New Password is required field.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.newPassword && (
                  <p className="alert__err">{errors.newPassword.message}</p>
                )}
              </>
            )}

            {!isEdit ? (
              <div className="profile__action__btn__sec">
                <button
                  id="edit"
                  className="action__btn"
                  type="button"
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="profile__action__btn__sec">
                <button
                  id="cancel"
                  className="action__btn"
                  type="button"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
                <button
                  id="save"
                  className="action__btn save"
                  type="submit"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
