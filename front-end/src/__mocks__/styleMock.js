/*
 * Mock required to prevent errors when importing CSS files in tests.
 * Jest doesn’t process CSS, so this mock allows components to import styles
 * without causing issues, keeping the focus on JavaScript functionality.
 */
module.exports = {};