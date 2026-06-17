import React, { useState } from "react";

interface UserAvatarProps {
  name?: string | null;
  size?: number;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 90,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = name
    ? name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/default_profile_picture.png"
        alt={name ? `${name}'s profile` : "Profile picture"}
        width={size}
        height={size}
        className={`rounded-full border-2 border-white/15 object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`rounded-full border-2 border-white/15 bg-white/10 flex items-center justify-center font-bold text-white/70 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-label={name ? `${name}'s avatar` : "User avatar"}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
