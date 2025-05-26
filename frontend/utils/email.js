// Email utility functions

/**
 * Checks if the given email is valid.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  // Basic email regex: checks for text@text.text (with at least 2 chars in TLD)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}
