import React from "react";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { authInterface, AuthComponentProps } from "@/types/interface";
import Link from "next/link";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { glassInput } from "@/utils/muiStyles";

type AuthFormValues = authInterface & {
  acknowledgeUnrecoverable?: boolean;
};

const AuthComponent: React.FC<AuthComponentProps> = ({
  mode,
  submitHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>();

  const onSubmit = (data: AuthFormValues) => {
    const { email, password } = data;
    return submitHandler({ email, password });
  };

  return (
    <div className="auth__container glossy_container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth__form__container"
      >
        <h1 className="text-3xl font-bold">Welcome to Vault</h1>
        <p className="text-subtle text-sm">
          {mode === "login"
            ? "Sign in to unlock your encrypted password vault."
            : "Create an account and choose a master password for your vault."}
        </p>
        <h2 className="text-xl font-bold">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <TextField
          id="email"
          type="text"
          label="Email"
          variant="filled"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          autoComplete="off"
          sx={glassInput}
        />
        {errors.email && <p className="alert__err">{errors.email.message}</p>}

        <TextField
          id="password"
          label="Master password"
          type="password"
          variant="filled"
          fullWidth
          {...register("password", {
            required: "Master password is required",
            minLength: {
              value: 8,
              message: "Master password must be at least 8 characters",
            },
          })}
          sx={glassInput}
        />
        {errors.password && (
          <p className="alert__err">{errors.password.message}</p>
        )}

        {mode === "register" && (
          <div className="auth__recovery-notice">
            <p className="auth__recovery-notice__title">
              Your master password cannot be recovered
            </p>
            <p className="auth__recovery-notice__body">
              Vault encrypts your data with a key derived from this password.
              If you forget it, you will permanently lose access to your vault.
              We cannot reset it or recover your data for you.
            </p>
            <label className="auth__acknowledge">
              <input
                type="checkbox"
                {...register("acknowledgeUnrecoverable", {
                  required:
                    "You must acknowledge that the master password cannot be recovered",
                })}
              />
              <span>
                I understand that my master password cannot be recovered, and
                forgetting it means permanent loss of vault access.
              </span>
            </label>
            {errors.acknowledgeUnrecoverable && (
              <p className="alert__err">
                {errors.acknowledgeUnrecoverable.message}
              </p>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="auth__recovery-hint text-subtle text-xs text-left">
            <p>
              Forgot your master password? It cannot be reset. Without it, your
              encrypted vault cannot be unlocked not even by us.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-subtle text-xs text-left">
          <ShieldOutlinedIcon style={{ fontSize: "14px" }} />
          <span>
            Your master password stays on this device. Vault secrets are
            encrypted before they leave your browser.
          </span>
        </div>

        <button type="submit" className="auth_btn" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </button>

        <div>
          {mode === "login" ? (
            <p className="text-subtle text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="auth__link">
                Register
              </Link>
            </p>
          ) : (
            <p className="text-subtle text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="auth__link">
                Login
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthComponent;
