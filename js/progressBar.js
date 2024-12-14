// progressBar.js

import {
    debounce
} from './utils.js';

export function initializeProgressBar() {
    const progressBar = document.getElementById("formProgress");

    const updateProgressBar = debounce(() => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let docHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrolled = (scrollTop / docHeight) * 100;
        scrolled = scrolled > 100 ? 100 : scrolled;
        progressBar.style.width = `${scrolled}%`;
        progressBar.setAttribute("aria-valuenow", scrolled.toFixed(0));
        progressBar.textContent = `${scrolled.toFixed(0)}%`;
    }, 100); // Debounce to improve performance

    window.addEventListener("scroll", updateProgressBar);
    updateProgressBar(); // Initialize on page load
}