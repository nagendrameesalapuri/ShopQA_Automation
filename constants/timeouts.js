/**
 * Centralized timeout constants
 * Improves consistency and maintainability
 */

const TIMEOUTS = {
  // Standard timeouts
  SHORT: 3000,
  DEFAULT: 5000,
  MEDIUM: 10000,
  LONG: 15000,
  EXTRA_LONG: 30000,

  // Specific operation timeouts
  ELEMENT_VISIBILITY: 5000,
  NAVIGATION: 10000,
  API_CALL: 10000,
  FILE_DOWNLOAD: 30000,

  // Wait for animations
  ANIMATION: 500,
  TRANSITION: 1000,
};

module.exports = { TIMEOUTS };
