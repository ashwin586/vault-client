export const calculateStrength = (password: string): number => {
  let size = 0;

  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 32;

  if (size === 0) return 0;

  const score = password.length * Math.log2(size);
  return Math.min(100, score);
};

export const calculateStrengthFromOptions = (
  password: string,
  options: {
    lowerCase: boolean;
    upperCase: boolean;
    number: boolean;
    specialChar: boolean;
  },
): number => {
  let size = 0;
  if (options.lowerCase) size += 26;
  if (options.upperCase) size += 26;
  if (options.number) size += 10;
  if (options.specialChar) size += 32;
  if (size === 0) return 0;
  const score = password.length * Math.log2(size);
  return Math.min(100, score);
};

export const getStrengthLabel = (score: number): string => {
  if (score < 40) return "Weak";
  if (score < 70) return "Fair";
  return "Strong";
};

export const getStrengthColor = (score: number): string => {
  if (score < 40) return "#ef4444";
  if (score < 70) return "#f59e0b";
  return "#22c55e";
};
