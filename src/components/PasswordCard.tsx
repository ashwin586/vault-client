import { PasswordCardProps } from "@/types/interface";
import Image from "next/image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useRef, useState } from "react";
import {
  calculateStrength,
  getStrengthColor,
  getStrengthLabel,
} from "@/utils/passwordStrength";
import { useToast } from "@/context/ToastContext";

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
      .hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

const PasswordCard: React.FC<PasswordCardProps> = React.memo(
  ({
    id,
    name,
    url,
    userName,
    password,
    maskByDefault = true,
    clipboardClearSeconds = 30,
    handleEditButton,
    handleDeleteButton,
  }) => {
    const [visibility, setVisibility] = useState<boolean>(() => !maskByDefault);
    const [faviconError, setFaviconError] = useState(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clipboardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { showToast } = useToast();

    const faviconUrl = getFaviconUrl(url);
    const passwordStrength = calculateStrength(password);
    const strengthColor = getStrengthColor(passwordStrength);
    const strengthLabel = getStrengthLabel(passwordStrength);

    useEffect(() => {
      setVisibility(!maskByDefault);
    }, [maskByDefault, id]);

    useEffect(() => {
      return () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
      };
    }, []);

    const scheduleHide = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setVisibility(false);
      }, clipboardClearSeconds * 1000);
    };

    const handleCopy = async (text: string, label: string) => {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, "success");

      if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
      clipboardTimerRef.current = setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === text) {
            await navigator.clipboard.writeText("");
          }
        } catch {
          // Clipboard permissions may block read/clear in some browsers.
        }
      }, clipboardClearSeconds * 1000);
    };

    const revealPassword = () => {
      setVisibility(true);
      scheduleHide();
    };

    const hidePassword = () => {
      setVisibility(false);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };

    return (
      <div className="password-card glossy_container" key={id}>
        <div className="password-card__header">
          {faviconUrl && !faviconError ? (
            <Image
              src={faviconUrl}
              alt={name}
              width={40}
              height={40}
              className="password-card__avatar"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <div className="password-card__avatar password-card__avatar--fallback">
              {name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div className="password-card__title-group">
            <h2 className="password-card__title" title={name}>
              {name}
            </h2>
            <span
              style={{
                color: strengthColor,
                backgroundColor: `${strengthColor}20`,
                borderColor: `${strengthColor}40`,
              }}
              className="password-card__strength"
            >
              {strengthLabel}
            </span>
          </div>
        </div>

        <div className="password-card__divider" />

        <p className="password-card__url" title={url}>
          {url}
        </p>

        <div className="password-card__field">
          <span className="password-card__field-value" title={userName}>
            {userName}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(userName, "Username")}
            className="btn-icon btn-icon-sm password-card__field-action"
            aria-label="Copy username"
          >
            <ContentCopyIcon style={{ fontSize: "16px" }} />
          </button>
        </div>

        <div className="password-card__field">
          <span className="password-card__field-value password-card__field-value--secret">
            {visibility ? password : "••••••••••"}
          </span>
          <div className="password-card__field-actions">
            {!visibility ? (
              <button
                type="button"
                onClick={revealPassword}
                className="btn-icon btn-icon-sm password-card__field-action"
                aria-label="Show password"
              >
                <VisibilityIcon style={{ fontSize: "16px" }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={hidePassword}
                className="btn-icon btn-icon-sm password-card__field-action"
                aria-label="Hide password"
              >
                <VisibilityOffIcon style={{ fontSize: "16px" }} />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCopy(password, "Password")}
              className="btn-icon btn-icon-sm password-card__field-action"
              aria-label="Copy password"
            >
              <ContentCopyIcon style={{ fontSize: "16px" }} />
            </button>
          </div>
        </div>

        <div className="password-card__actions">
          <button
            type="button"
            className="btn-vault-edit"
            onClick={handleEditButton}
          >
            <EditIcon style={{ fontSize: "14px" }} />
            Edit
          </button>
          <button
            type="button"
            className="btn-vault-delete"
            onClick={handleDeleteButton}
          >
            <DeleteIcon style={{ fontSize: "14px" }} />
            Delete
          </button>
        </div>
      </div>
    );
  },
);

PasswordCard.displayName = "PasswordCard";

export default PasswordCard;
