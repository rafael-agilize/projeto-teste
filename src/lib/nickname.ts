const STORAGE_KEY = "tetris-nickname";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a nickname: must be 2-12 characters, not empty or whitespace-only.
 * Allows letters, numbers, and spaces.
 */
export function validateNickname(name: string): ValidationResult {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Nickname cannot be empty" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Nickname must be at least 2 characters" };
  }

  if (trimmed.length > 12) {
    return { valid: false, error: "Nickname must be 12 characters or less" };
  }

  // Allow letters, numbers, and spaces only
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
    return { valid: false, error: "Only letters, numbers, and spaces allowed" };
  }

  return { valid: true };
}

/**
 * Saves the nickname to localStorage.
 */
export function saveNickname(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, name.trim());
}

/**
 * Loads the nickname from localStorage.
 * Returns empty string if not found or if running server-side.
 */
export function loadNickname(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}
