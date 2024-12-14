// main.js

import {
    initializeScrollSpy
} from './scrollSpy.js';
import {
    initializeProgressBar
} from './progressBar.js';
import {
    initializePopovers
} from './popovers.js';
import {
    initializeCourseSelection
} from './courseSelection.js';

document.addEventListener("DOMContentLoaded", () => {
    initializeScrollSpy();
    initializeProgressBar();
    initializePopovers();
    initializeCourseSelection();
});