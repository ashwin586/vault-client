import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { skeletonStyle } from "@/utils/muiStyles";

const VaultPageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-6" aria-hidden="true">
      <section className="glossy_container vault-toolbar-card flex flex-col gap-5">
        <div className="account-header">
          <div className="account-header__copy flex flex-col gap-2 w-full">
            <Skeleton variant="text" width={80} height={18} sx={skeletonStyle} />
            <Skeleton variant="text" width="55%" height={36} sx={skeletonStyle} />
            <Skeleton variant="text" width="80%" height={20} sx={skeletonStyle} />
          </div>
          <Skeleton
            variant="rounded"
            width={140}
            height={32}
            sx={skeletonStyle}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <Skeleton
            variant="rounded"
            height={52}
            sx={{ ...skeletonStyle, flex: 1, borderRadius: "14px" }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={44}
            sx={{ ...skeletonStyle, maxWidth: 160, borderRadius: "14px" }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 w-full">
        {[...Array(8)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            animation="wave"
            width="100%"
            height={190}
            sx={skeletonStyle}
          />
        ))}
      </div>
    </div>
  );
};

export default VaultPageSkeleton;
