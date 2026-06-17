export const dialogStyle = {
  "& .MuiPaper-root": {
    borderRadius: "16px",
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
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

export const glassInput = {
  mb: 0,
  width: "100%",
  "& .MuiFilledInput-root": {
    minHeight: 58,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.12)",
    transition:
      "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
  },
  "& .MuiFilledInput-root:hover": {
    backgroundColor: "rgba(255,255,255,0.075)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  "& .MuiFilledInput-root.Mui-focused": {
    backgroundColor: "rgba(99,149,255,0.08)",
    borderColor: "rgba(99,149,255,0.55)",
    boxShadow:
      "0 0 0 3px rgba(99,149,255,0.16), inset 0 1px 0 rgba(255,255,255,0.1)",
  },
  "& .MuiFilledInput-root.Mui-error": {
    borderColor: "rgba(248,113,113,0.55)",
    backgroundColor: "rgba(248,113,113,0.07)",
  },
  "& .MuiFilledInput-root.Mui-error.Mui-focused": {
    boxShadow:
      "0 0 0 3px rgba(248,113,113,0.16), inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  "& .MuiFilledInput-root.Mui-disabled": {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.07)",
    boxShadow: "none",
  },
  "& .MuiFilledInput-root.Mui-disabled:hover": {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.07)",
  },
  "& .MuiFilledInput-root:before": {
    borderBottom: "none !important",
  },
  "& .MuiFilledInput-root:after": {
    borderBottom: "none !important",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.52)",
    fontSize: "0.9rem",
    fontWeight: 600,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#93b4ff",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#fca5a5",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "rgba(255,255,255,0.28)",
  },
  "& input": {
    color: "rgba(255,255,255,0.88)",
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    paddingTop: "23px",
    paddingBottom: "8px",
  },
  "& input:-webkit-autofill": {
    WebkitTextFillColor: "rgba(255,255,255,0.88)",
    WebkitBoxShadow: "0 0 0 100px rgba(30,41,59,0.9) inset",
    caretColor: "#fff",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "rgba(255,255,255,0.38)",
  },
  "& .MuiFormHelperText-root": {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.42)",
    fontSize: "0.75rem",
    lineHeight: 1.4,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#fca5a5",
  },
  "&.settings-field--success .MuiFilledInput-root": {
    borderColor: "rgba(34,197,94,0.38)",
    backgroundColor: "rgba(34,197,94,0.055)",
  },
};

export const textFieldStyles = glassInput;

export const dialogCancelButton = {
  color: "#94a3b8",
  textTransform: "none" as const,
  minHeight: 44,
  "&:hover": { color: "#f1f5f9", backgroundColor: "rgba(255,255,255,0.06)" },
};

export const dialogPrimaryButton = {
  backgroundColor: "rgba(99,149,255,0.2)",
  color: "#6395ff",
  textTransform: "none" as const,
  borderRadius: "8px",
  border: "1px solid rgba(99,149,255,0.3)",
  paddingX: 3,
  minHeight: 44,
  "&:hover": {
    backgroundColor: "rgba(99,149,255,0.3)",
  },
};

export const dialogDangerButton = {
  backgroundColor: "rgba(239,68,68,0.15)",
  color: "#f87171",
  textTransform: "none" as const,
  borderRadius: "8px",
  border: "1px solid rgba(239,68,68,0.3)",
  paddingX: 3,
  minHeight: 44,
  "&:hover": {
    backgroundColor: "rgba(239,68,68,0.25)",
  },
};

export const sliderStyle = {
  color: "#6395ff",
  height: 6,
  "& .MuiSlider-thumb": {
    width: 18,
    height: 18,
    backgroundColor: "#6395ff",
    border: "2px solid rgba(255,255,255,0.2)",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: "0 0 0 8px rgba(99,149,255,0.16)",
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.4,
    backgroundColor: "#334155",
  },
  "& .MuiSlider-track": {
    border: "none",
  },
};

export const switchStyle = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#6395ff",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#6395ff",
    opacity: 0.5,
  },
  "& .MuiSwitch-track": {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
};

export const linearProgressStyle = (color: string) => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "#1e293b",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    background: color,
  },
});

export const skeletonStyle = {
  borderRadius: "20px",
  bgcolor: "rgba(255,255,255,0.07)",
};

export const toastAlertStyle = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  "&.MuiAlert-filledSuccess": {
    backgroundColor: "rgba(34,197,94,0.2)",
    color: "#86efac",
    borderColor: "rgba(34,197,94,0.3)",
  },
  "&.MuiAlert-filledError": {
    backgroundColor: "rgba(239,68,68,0.2)",
    color: "#fca5a5",
    borderColor: "rgba(239,68,68,0.3)",
  },
  "&.MuiAlert-filledInfo": {
    backgroundColor: "rgba(99,149,255,0.2)",
    color: "#93c5fd",
    borderColor: "rgba(99,149,255,0.3)",
  },
  "&.MuiAlert-filledWarning": {
    backgroundColor: "rgba(245,158,11,0.2)",
    color: "#fcd34d",
    borderColor: "rgba(245,158,11,0.3)",
  },
};
