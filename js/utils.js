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

export function collectFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};

    // Iterate over each key/value pair in FormData
    for (let [key, value] of formData.entries()) {
        // Handle multiple selections (e.g., checkboxes)
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Handle file uploads separately
    const fileInputs = form.querySelectorAll('input[type="file"]');
    data.uploadedFiles = {};

    fileInputs.forEach(input => {
        const files = input.files;
        if (files.length > 0) {
            data.uploadedFiles[input.name] = Array.from(files);
        }
    });

    return data;
}