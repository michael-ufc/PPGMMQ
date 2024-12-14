// utils.js

/**
 * Utility function to create and append HTML elements.
 * @param {HTMLElement} parent - The parent element to append to.
 * @param {string} html - The HTML string to append.
 */
export function appendHTML(parent, html) {
    parent.insertAdjacentHTML('beforeend', html);
}

/**
 * Utility function to debounce rapid function calls.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The debounce interval in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}