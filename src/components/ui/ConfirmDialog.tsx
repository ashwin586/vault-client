import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import {
  dialogStyle,
  dialogCancelButton,
  dialogDangerButton,
  dialogPrimaryButton,
} from "@/utils/muiStyles";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}) => {
  return (
    <Dialog open={open} onClose={onCancel} sx={dialogStyle}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "rgba(255,255,255,0.6)" }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ paddingX: 3, paddingBottom: 2, gap: 1 }}>
        <Button onClick={onCancel} sx={dialogCancelButton}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          sx={variant === "danger" ? dialogDangerButton : dialogPrimaryButton}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
