/**
 * lib.js — A simple utility library.
 * Provides greeting and basic arithmetic operations.
 */

const lib = {
  /**
   * Returns a greeting string for the given name.
   * @param {string} name
   * @returns {string}
   */
  greet(name) {
    return `Hello, ${name}!`;
  },

  /**
   * Adds two numbers.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  add(a, b) {
    return a + b;
  },

  /**
   * Subtracts b from a.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  subtract(a, b) {
    return a - b;
  },

  /**
   * Multiplies two numbers.
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  multiply(a, b) {
    return a * b;
  },

  /**
   * Divides a by b. Returns an error string when b is zero.
   * @param {number} a
   * @param {number} b
   * @returns {number|string}
   */
  divide(a, b) {
    if (b === 0) {
      return 'Error: Division by zero';
    }
    return a / b;
  },
};
