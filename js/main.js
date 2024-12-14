// js/main.js
import {
    loadIncludes
} from './includes.js';
import {
    initializeCourseSelection
} from './courseSelection.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Step 1: Load includes
    await loadIncludes();

    // Step 2: Initialize dependent scripts
    initializeCourseSelection();

});