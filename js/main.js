// js/main.js

import {
    loadIncludes
} from './includes.js';
import {
    initializeCourseSelection
} from './courseSelection.js';
import {
    generateAndMergePDF
} from './generatePdf.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Step 1: Load includes
    await loadIncludes();

    // Step 2: Initialize dependent scripts
    initializeCourseSelection();

    // Step 3: Initialize PDF generation
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            await generateAndMergePDF('applicationForm');
            alert('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
            alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
        }
    });
});