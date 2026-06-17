import React from "react";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { authInterface, AuthComponentProps } from "@/types/interface";
import Link from "next/link";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { glassInput } from "@/utils/muiStyles";

const AuthComponent: React.FC<AuthComponentProps> = ({
  mode,
  submitHandler,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<authInterface>();

  return (
    <div className="auth__container glossy_container">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="auth__form__container"
      >
        <h1 className="text-3xl font-bold">Welcome to Vault</h1>
        <p className="text-subtle text-sm">
          {mode === "login"
            ? "Sign in to access your encrypted password vault."
            : "Create an account to securely store your passwords."}
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
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          sx={glassInput}
        />
        {errors.password && (
          <p className="alert__err">{errors.password.message}</p>
        )}

        <div className="flex items-center gap-2 text-subtle text-xs text-left">
          <ShieldOutlinedIcon style={{ fontSize: "14px" }} />
          <span>Credentials are encrypted in transit and at rest.</span>
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
