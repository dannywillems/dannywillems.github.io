/**
 * Theme Switcher
 * Handles theme persistence and switching
 */

(function() {
  'use strict';

  var STORAGE_KEY = 'site-theme';
  var DEFAULT_THEME = 'hacker';
  var VALID_THEMES = ['hacker', 'neon', 'minimal', 'twilight', 'paper'];

  /**
   * Get the saved theme from localStorage
   * @returns {string} The saved theme or default
   */
  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_THEMES.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (e) {
      // localStorage not available
    }
    return DEFAULT_THEME;
  }

  /**
   * Save theme to localStorage
   * @param {string} theme - Theme name to save
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme name to apply
   */
  function applyTheme(theme) {
    // Remove all theme classes
    VALID_THEMES.forEach(function(t) {
      document.documentElement.classList.remove('theme-' + t);
    });
    // Add new theme class
    document.documentElement.classList.add('theme-' + theme);
  }

  /**
   * Set theme and persist
   * @param {string} theme - Theme name
   */
  function setTheme(theme) {
    if (VALID_THEMES.indexOf(theme) === -1) {
      theme = DEFAULT_THEME;
    }
    applyTheme(theme);
    saveTheme(theme);
  }

  /**
   * Initialize theme switcher
   */
  function init() {
    var select = document.getElementById('theme-select');
    if (!select) return;

    // Set select value to current theme
    var currentTheme = getSavedTheme();
    select.value = currentTheme;

    // Listen for changes
    select.addEventListener('change', function(e) {
      setTheme(e.target.value);
    });
  }

  // Expose setTheme globally for inline handlers
  window.setTheme = setTheme;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
