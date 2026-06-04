import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addPassword, AddPasswordProps } from "@/types/interface";

const glassInput = {
  mb: 2,
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  "& .MuiFilledInput-root:hover": {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  "& .MuiFilledInput-root:before": {
    borderBottom: "none !important",
  },
  "& .MuiFilledInput-root:after": {
    borderBottom: "none !important",
  },
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#93b4ff",
  },
  "& input": {
    color: "white",
  },
  "& .MuiFormHelperText-root": {
    color: "#f87171",
  },
};

const popupModalStyle = {
  "& .MuiPaper-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    width: "calc(100vw - 32px)",
    maxWidth: "440px",
    margin: "16px",
  },
  "& .MuiDialogTitle-root": {
    color: "#f1f5f9",
    fontWeight: 600,
    paddingBottom: "8px",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
  },
};

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
    formState: { errors },
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
    <Dialog open={open} onClose={handleClose} sx={popupModalStyle}>
      <DialogTitle>
        {selectedCredential ? "Edit Password" : "Add Password"}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0, px: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit(submitHandler)}>

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
                message: "Atleast one character is required.",
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

          <DialogActions
            sx={{
              paddingX: 0,
              paddingTop: 1,
              paddingBottom: 2,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                color: "#94a3b8",
                textTransform: "none",
                minHeight: 44,
                "&:hover": { color: "#f1f5f9", backgroundColor: "rgba(255,255,255,0.06)" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                backgroundColor: "rgba(99,149,255,0.2)",
                color: "#6395ff",
                textTransform: "none",
                borderRadius: "8px",
                border: "1px solid rgba(99,149,255,0.3)",
                paddingX: 3,
                minHeight: 44,
                "&:hover": {
                  backgroundColor: "rgba(99,149,255,0.3)",
                },
              }}
            >
              {selectedCredential ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPassword;