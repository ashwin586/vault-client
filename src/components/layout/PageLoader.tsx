import React from "react";
import Image from "next/image";

interface PageLoaderProps {
  label?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ label = "Loading" }) => {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label={label}>
      <Image
        src="/vault.svg"
        alt=""
        width={40}
        height={40}
        className="page-loader__logo"
        aria-hidden
      />
      <div className="page-loader__spinner" />
      <span className="page-loader__text">{label}...</span>
    </div>
  );
};

export default PageLoader;
