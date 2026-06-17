import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addPassword, AddPasswordProps } from "@/types/interface";
import {
  dialogStyle,
  dialogCancelButton,
  dialogPrimaryButton,
  glassInput,
} from "@/utils/muiStyles";

const AddPassword: React.FC<AddPasswordProps> = ({
  open,
  handleClose,
  submitHandler,
  selectedCredential,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<addPassword>({
    defaultValues: {
      name: selectedCredential?.name || "",
      url: selectedCredential?.url || "",
      userName: selectedCredential?.userName || "",
      password: selectedCredential?.password || "",
    },
  });

  useEffect(() => {
    reset({
      name: selectedCredential?.name || "",
      url: selectedCredential?.url || "",
      userName: selectedCredential?.userName || "",
      password: selectedCredential?.password || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} sx={dialogStyle}>
      <DialogTitle>
        {selectedCredential ? "Edit Password" : "Add Password"}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0, px: { xs: 2, sm: 3 }, pt: 1 }}>
        <form className="vault-form" onSubmit={handleSubmit(submitHandler)}>
          <div className="vault-form__fields">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="App Name *"
            type="text"
            fullWidth
            variant="filled"
            {...register("name", {
              required: "App Name is required",
              minLength: {
                value: 1,
                message: "At least one character is required.",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={glassInput}
          />

          <TextField
            margin="dense"
            id="url"
            label="URL *"
            type="text"
            fullWidth
            variant="filled"
            {...register("url", {
              required: "URL is required",
            })}
            error={!!errors.url}
            helperText={errors.url?.message}
            sx={glassInput}
          />

          <TextField
            margin="dense"
            id="userName"
            label="Username or Email *"
            type="text"
            fullWidth
            variant="filled"
            {...register("userName", {
              required: "Username or Email is required",
              validate: (value) => {
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isUsername = /^[a-zA-Z0-9._]{3,}$/.test(value);
                return (
                  isEmail ||
                  isUsername ||
                  "Enter a valid email or username (min 3 characters, no spaces)"
                );
              },
            })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            sx={glassInput}
          />

          <TextField
            margin="dense"
            id="password"
            label="Password *"
            type="password"
            fullWidth
            variant="filled"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={glassInput}
          />
          </div>

          <DialogActions
            className="vault-form__actions"
            sx={{
              paddingX: 0,
              paddingTop: 1,
              paddingBottom: 2,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button onClick={handleClose} sx={dialogCancelButton}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              sx={dialogPrimaryButton}
            >
              {isSubmitting
                ? "Saving..."
                : selectedCredential
                  ? "Update"
                  : "Add"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPassword;
