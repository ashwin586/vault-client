const AUTH_SESSION_KEY = "vault-auth-session";

/** Client-side session marker only — JWT lives in an httpOnly cookie. */
export const markAuthenticated = () => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_SESSION_KEY, "1");
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  // Clear legacy localStorage token if present from older builds.
  localStorage.removeItem("access-token");
};

export const isTokenValid = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
};
