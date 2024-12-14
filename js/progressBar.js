// progressBar.js

import {
    debounce
} from './utils.js';

export function initializeProgressBar() {
    const progressBar = document.getElementById("formProgress");

    // Collect all sections and subsections to monitor
    const sections = [
        document.getElementById("section1"),
        document.getElementById("section2"),
        document.getElementById("section3"),
        document.getElementById("courses"), // 3.1
        document.getElementById("bonusCourses1"), // 3.2
        document.getElementById("bonusCourses2"), // 3.3
        document.getElementById("section4"),
        document.getElementById("section5"),
        document.getElementById("section6"),
    ];

    const updateProgressBar = debounce(() => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let progress = 0;

        // Calculate progress based on each section's position
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            // Check if the scroll position is within this section
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                // Add partial progress for the section
                const sectionProgress = (scrollTop - sectionTop) / sectionHeight;
                progress += index + sectionProgress;
            } else if (scrollTop >= sectionTop + sectionHeight) {
                // Add full progress for completed sections
                progress += 1;
            }
        });

        // Normalize progress to percentage
        progress = (progress / sections.length) * 100;
        progress = progress > 100 ? 100 : progress;

        // Update progress bar
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute("aria-valuenow", progress.toFixed(0));
        progressBar.textContent = `${progress.toFixed(0)}%`;
    }, 100);

    // Attach the scroll event listener and initialize on load
    window.addEventListener("scroll", updateProgressBar);
    updateProgressBar();
}