import { PasswordCardProps } from "@/types/interface";
import Image from "next/image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import {
  calculateStrength,
  getStrengthColor,
  getStrengthLabel,
} from "@/utils/passwordStrength";

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
    handleEditButton,
    handleDeleteButton,
  }) => {
    const [visibility, setVisibility] = useState<boolean>(false);
    const [faviconError, setFaviconError] = useState(false);

    const faviconUrl = getFaviconUrl(url);
    const passwordStrength = calculateStrength(password);
    const getColor = getStrengthColor(passwordStrength);
    const getLabel = getStrengthLabel(passwordStrength);

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    return (
      <div
        className="glossy_container flex flex-col w-full min-w-0 p-3! sm:p-4! gap-2 sm:gap-3 text-1"
        key={id}
      >
        {/* Header: favicon + name + badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Favicon or initial fallback */}
          {faviconUrl && !faviconError ? (
            <Image
              src={faviconUrl}
              alt={name}
              width={38}
              height={38}
              className="w-8 h-8 sm:w-[38px] sm:h-[38px] shrink-0"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <div
              className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-[10px] border border-white/10 bg-white/10
                   flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
            >
              {name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* Name + strength badge */}
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold truncate">{name}</h2>
            <span
              style={{
                color: getColor,
                backgroundColor: `${getColor}20`,
                borderColor: `${getColor}40`,
              }}
              className="text-[9px] sm:text-[10px] font-medium px-1.5! sm:px-2! py-0.5! rounded-full border w-fit max-w-full truncate"
            >
              {getLabel}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* URL */}
        <p className="text-[11px] sm:text-xs text-white/40 truncate px-1!">
          {url}
        </p>

        {/* Username row */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-[8px] px-2! sm:px-3! py-1.5! sm:py-2! min-w-0">
          <span className="text-xs sm:text-sm truncate flex-1 min-w-0">
            {userName}
          </span>
          <ContentCopyIcon
            onClick={() => handleCopy(userName)}
            className="cursor-pointer text-white/40 hover:text-white/80 transition-colors shrink-0"
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Password row */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-[8px] px-2! sm:px-3! py-1.5! sm:py-2! min-w-0">
          <span className="text-xs sm:text-sm truncate flex-1 min-w-0 tracking-wider sm:tracking-widest">
            {visibility ? password : "••••••••••"}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!visibility ? (
              <VisibilityIcon
                onClick={() => setVisibility(true)}
                className="cursor-pointer text-white/40 hover:text-white/80 transition-colors"
                style={{ fontSize: "16px" }}
              />
            ) : (
              <VisibilityOffIcon
                onClick={() => setVisibility(false)}
                className="cursor-pointer text-white/40 hover:text-white/80 transition-colors"
                style={{ fontSize: "16px" }}
              />
            )}
            <ContentCopyIcon
              onClick={() => handleCopy(password)}
              className="cursor-pointer text-white/40 hover:text-white/80 transition-colors"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-1.5 sm:gap-2 pt-1!">
          <button
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 min-h-9 sm:min-h-10 px-2! sm:px-3! py-1.5! sm:py-2! rounded-md text-xs sm:text-sm text-white/60
                hover:text-blue-400 cursor-pointer border border-white/10
                hover:border-blue-400/30 bg-white/5 hover:bg-blue-400/10
                transition-all duration-150"
            onClick={handleEditButton}
          >
            <EditIcon style={{ fontSize: "13px" }} />
            Edit
          </button>
          <button
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 min-h-9 sm:min-h-10 px-2! sm:px-3! py-1.5! sm:py-2! rounded-md text-xs sm:text-sm text-white/60
                hover:text-red-400 cursor-pointer border border-white/10
                hover:border-red-400/30 bg-white/5 hover:bg-red-400/10
                transition-all duration-150"
            onClick={handleDeleteButton}
          >
            <DeleteIcon style={{ fontSize: "13px" }} />
            Delete
          </button>
        </div>
      </div>
    );
  },
);

PasswordCard.displayName = "PasswordCard";

export default PasswordCard;
