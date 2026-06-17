export const ROUTES = {
  home: "/home",
  profile: "/profile",
  vault: "/vault",
  settings: "/settings",
  login: "/auth/login",
  register: "/auth/register",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
