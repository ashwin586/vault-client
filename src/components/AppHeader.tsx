import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import React from "react";

interface AppHeaderProps {
  onBack?: () => void;
  onLogoClick?: () => void;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onBack,
  onLogoClick,
  rightContent,
}) => {
  return (
    <div className="absolute top-0 left-0 z-10 w-full flex justify-between items-center gap-4 px-4! sm:px-6! md:px-10! pt-5!">
      <div className="flex items-center gap-4 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-11 h-11 shrink-0 rounded-[12px]
             cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10
             hover:border-white/20 text-white/60 hover:text-white transition-all duration-150"
            aria-label="Go back"
          >
            <ArrowBackIcon style={{ fontSize: "20px" }} />
          </button>
        )}
        <div
          className={`flex items-center gap-2 min-w-0 ${
            onLogoClick ? "cursor-pointer" : ""
          }`}
          onClick={onLogoClick}
        >
          <Image src="/vault.svg" alt="Vault" width={28} height={28} />
          <span className="font-bold text-2xl sm:text-3xl text-white truncate">
            Vault
          </span>
        </div>
      </div>
      {rightContent && (
        <div className="text-sm sm:text-base text-right shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default AppHeader;
