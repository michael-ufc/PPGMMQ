// scrollSpy.js

import {
    debounce
} from './utils.js';

export function initializeScrollSpy() {
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#sidebar",
        offset: 100,
    });

    // Optionally, add event listeners or additional configurations here
}