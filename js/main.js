import {
    loadIncludes
} from './includes.js';
import {
    initializeCourseSelection
} from './courseSelection.js';
import {
    initializeScrollSpy
} from './scrollSpy.js';
import {
    initializeProgressBar
} from './progressBar.js';
import {
    initializePopovers
} from './popovers.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Step 1: Load includes
    await loadIncludes();

    // Step 2: Initialize dependent scripts
    initializeCourseSelection();

    // Step 3: Initialize independent scripts
    initializeScrollSpy();
    initializeProgressBar();
    initializePopovers();
});