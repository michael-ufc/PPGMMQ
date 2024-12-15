// js/generatePdf.js

/**
 * This module is responsible for collecting form data, organizing it by sections,
 * generating a PDF from the collected data, merging any uploaded files,
 * and facilitating the download of the final PDF.
 */

// Import necessary libraries
// Ensure that PDFLib is available in the global scope or import it appropriately
// If using modules, you might need to adjust the import based on your setup
// For example, if using ES modules:
// import { PDFDocument } from 'pdf-lib';

// Assuming PDFLib is loaded via a script tag and available globally
const {
    PDFDocument
} = window.pdfLib || window.PDFLib;

// If using jsPDF loaded via a script tag
const {
    jsPDF
} = window.jspdf;

/**
 * Collects and organizes form data by sections.
 * @param {string} formId - The ID of the form to collect data from.
 * @returns {object} - An object containing organized form data grouped by sections.
 */
export function collectFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return {};
    }

    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]'); // Find all tabs
    const formData = new FormData(form);
    const data = {};

    // Temporarily activate each tab to ensure visibility
    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tab.click(); // Switch to tab
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name) {
                const section = input.closest('[id^="section"]');
                const sectionId = section ? section.id : 'miscellaneous';

                if (!data[sectionId]) data[sectionId] = {};
                data[sectionId][input.name] = input.type === 'checkbox' || input.type === 'radio' ?
                    input.checked ? input.value : null :
                    input.value;
            }
        });
    }

    console.log('Collected Form Data:', data);
    return data;
}

/**
 * Generates and merges PDFs based on the collected form data and uploaded files.
 * @param {string} formId - The ID of the form to process.
 */
export async function generateAndMergePDF(formId) {
    const formData = collectFormData(formId);

    // Step 1: Generate initial PDF with form data
    const initialPdfBytes = await createInitialPdf(formData);

    // Step 2: Merge uploaded PDFs with the generated PDF
    const mergedPdfBytes = await mergeUploadedPdfs(initialPdfBytes, formData);

    // Step 3: Trigger download of the merged PDF
    downloadPdf(mergedPdfBytes, 'Formulario_PPGMMQ_2025.1_Merged.pdf');
}

/** 
 * Creates the initial PDF document using the collected form data.
 * @param {object} formData - The organized form data grouped by sections.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the bytes of the generated PDF.
 */
async function createInitialPdf(formData) {
    const doc = new jsPDF();

    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text('PPGMMQ Processo Seletivo 2025.1', 10, yPosition);
    yPosition += 10;

    doc.setFontSize(12);

    // Iterate through each section
    for (const [section, fields] of Object.entries(formData)) {
        console.log("Processing section:", section);

        // Add color for section titles
        doc.setTextColor(0, 102, 204); // Set to a blue color (RGB: 0, 102, 204)
        doc.setFontSize(14);
        doc.text(`${formatSectionName(section)}`, 10, yPosition);
        yPosition += 10;

        // Reset color for regular text
        doc.setTextColor(0, 0, 0); // Black text
        doc.setFontSize(12);

        // Iterate through each field in the section
        for (const [key, value] of Object.entries(fields)) {
            if (key !== 'uploadedFiles') { // Exclude file uploads from text content
                let displayValue = '';

                if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                } else {
                    displayValue = value;
                }

                doc.text(`${formatFieldName(key)}: ${displayValue}`, 10, yPosition);
                yPosition += 10;

                // Add a new page if yPosition exceeds the limit
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
            }
        }

        yPosition += 10; // Add extra space after each section
    }

    // Convert the PDF to bytes for merging
    const initialPdfBytes = doc.output('arraybuffer');
    return initialPdfBytes;
}


/**
 * Formats the section ID to a readable section name.
 * @param {string} sectionId - The ID of the section (e.g., 'section1').
 * @returns {string} - The formatted section name.
 */
function formatSectionName(sectionId) {
    // Define mapping from section IDs to readable names
    const sectionTitles = {
        section1_form: "1) DADOS PESSOAIS",
        section2_form: "2) DADOS ACADÊMICOS",
        section3_form: "3) AVALIAÇÃO DE HISTÓRICO",
        section4_form: "4) ANÁLISE CURRICULAR",
        section5_form: "5) DADOS SOCIOECONÔMICOS",
        section6_form: "6) DECLARAÇÕES PARA BOLSA"
    };

    return sectionTitles[sectionId] || sectionId;
}

/**
 * Formats field names from camelCase or snake_case to Title Case with spaces and converts to upper case.
 * @param {string} fieldName - The original field name.
 * @returns {string} - The formatted field name in upper case.
 */
function formatFieldName(fieldName) {
    // Convert camelCase or snake_case to Upper Case with spaces
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces        
        .toUpperCase(); // Convert entire string to upper case
}


/**
 * Merges uploaded PDF and image files into the initial PDF document.
 * @param {Uint8Array} initialPdfBytes - The bytes of the initial PDF.
 * @param {object} formData - The organized form data containing uploaded files.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the bytes of the merged PDF.
 */
async function mergeUploadedPdfs(initialPdfBytes, formData) {
    // Load the initial PDF document
    const pdfDoc = await PDFDocument.load(initialPdfBytes);

    // Iterate over each section's uploaded files
    for (const [section, fields] of Object.entries(formData)) {
        if (fields.uploadedFiles) {
            for (const [inputName, files] of Object.entries(fields.uploadedFiles)) {
                for (let file of files) {
                    if (file.type === 'application/pdf') {
                        const arrayBuffer = await file.arrayBuffer();
                        const uploadedPdf = await PDFDocument.load(arrayBuffer);
                        const copiedPages = await pdfDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
                        copiedPages.forEach(page => {
                            pdfDoc.addPage(page);
                        });
                    } else if (file.type.startsWith('image/')) {
                        // Handle image files by adding them as images in the PDF
                        const imageBytes = await file.arrayBuffer();
                        let img;
                        if (file.type === 'image/jpeg') {
                            img = await pdfDoc.embedJpg(imageBytes);
                        } else if (file.type === 'image/png') {
                            img = await pdfDoc.embedPng(imageBytes);
                        } else {
                            console.warn(`Unsupported image type: ${file.type}`);
                            continue; // Skip unsupported image types
                        }

                        const imgDims = img.scale(0.5); // Adjust scale as needed
                        const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
                        page.drawImage(img, {
                            x: 0,
                            y: 0,
                            width: imgDims.width,
                            height: imgDims.height,
                        });
                    }
                    // Handle other file types if necessary
                }
            }
        }
    }

    const mergedPdfBytes = await pdfDoc.save();
    return mergedPdfBytes;
}

/**
 * Triggers the download of the generated PDF.
 * @param {Uint8Array} pdfBytes - The bytes of the PDF to download.
 * @param {string} fileName - The desired name for the downloaded PDF file.
 */
function downloadPdf(pdfBytes, fileName) {
    const blob = new Blob([pdfBytes], {
        type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    // Clean up the object URL after download
    URL.revokeObjectURL(url);
}