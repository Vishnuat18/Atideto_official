import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PasswordValidationState {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  isValid: boolean;
  errorMessage: string | null;
}

export function checkPasswordRequirements(password: string): PasswordValidationState {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let errorMessage: string | null = null;
  if (!password) {
    errorMessage = "Please enter a password.";
  } else if (!hasMinLength) {
    errorMessage = "Password must be at least 8 characters long.";
  } else if (!hasUppercase) {
    errorMessage = "Password must contain at least one uppercase letter (A-Z).";
  } else if (!hasNumber) {
    errorMessage = "Password must contain at least one numeric digit (0-9).";
  } else if (!hasSymbol) {
    errorMessage = "Password must contain at least one special symbol (e.g. !@#$%^&*).";
  }

  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSymbol,
    isValid: hasMinLength && hasUppercase && hasNumber && hasSymbol,
    errorMessage,
  };
}

