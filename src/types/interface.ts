import { SubmitHandler } from "react-hook-form";

export interface authInterface {
  email: string;
  password: string;
}

export interface addPassword {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
}

export interface AuthComponentProps {
  mode: string;
  submitHandler: SubmitHandler<authInterface>;
}

export interface AddPasswordProps {
  open: boolean;
  handleClose: () => void;
  submitHandler: SubmitHandler<addPassword>;
  selectedCredential?: addPassword | null;
}

export interface TokenProps {
  email: string;
  exp: number;
  iat: number;
  role: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastInterface {
  showToast: (message: string, severity?: ToastType) => void;
}

export interface User {
  name: string;
  email: string;
  createdAt: string;
}

export interface ProfileInfo {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  vaultSalt?: string;
}

export interface ApiError {
  message: string;
}

export interface UserPasswords {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
  iv?: string;
  handleEditButton?: () => void;
  handleDeleteButton?: () => void;
}

export interface CSVData {
  name: string;
  url: string;
  username: string;
  password: string;
  iv?: string;
}

export interface PasswordCardProps {
  id: string;
  name: string;
  url: string;
  userName: string;
  password: string;
  maskByDefault?: boolean;
  clipboardClearSeconds?: number;
  handleEditButton: () => void;
  handleDeleteButton: () => void;
}

export interface UserSettings {
  autoLockTimeout: number;
  clipboardTimer: number;
  maskSensitiveData: boolean;
  securityReminders: boolean;
  lockOnClose: boolean;
  themePreference: string;
  notifications: boolean;
  generatorLength: number;
  generatorSymbols: boolean;
  generatorNumbers: boolean;
  generatorUppercase: boolean;
  generatorLowercase: boolean;
  language: string;
}

export interface SecurityMetadata {
  lastLoginAt: string | null;
  previousLoginAt: string | null;
  lastPasswordUpdatedAt: string | null;
  loginCount: number;
}

export interface ActivityItem {
  type: string;
  message: string;
  createdAt: string;
}

export interface SecuritySummary {
  accountStatus: string;
  encryptionStatus: string;
  passwordHealthScore: number | null;
  savedPasswordCount: number;
  weakPasswordCount: number;
  reusedPasswordCount: number;
  maskingEnabled: boolean;
}

export interface ProfileResponseUser extends Omit<User, "createdAt"> {
  createdAt?: string | Date;
  settings?: UserSettings;
  securityMetadata?: SecurityMetadata;
  activeSessions?: number;
  activity?: ActivityItem[];
  securitySummary?: SecuritySummary;
}
