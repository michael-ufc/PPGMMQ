// js/generatePdf.js

import {
    collectFormData
} from './utils.js';

export async function generateAndMergePDF(formId) {
    const formData = collectFormData(formId);

    // Step 1: Generate initial PDF with form data
    const initialPdfBytes = await createInitialPdf(formData);

    // Step 2: Merge uploaded PDFs with the generated PDF
    const mergedPdfBytes = await mergeUploadedPdfs(initialPdfBytes, formData.uploadedFiles);

    // Step 3: Trigger download of the merged PDF
    downloadPdf(mergedPdfBytes, 'Formulario_PPGMMQ_2025.1_Merged.pdf');
}

async function createInitialPdf(formData) {
    const {
        jsPDF
    } = window.jspdf;
    const doc = new jsPDF();

    let yPosition = 20;
    doc.setFontSize(16);
    doc.text('PPGMMQ Processo Seletivo 2025.1', 10, yPosition);
    yPosition += 10;

    doc.setFontSize(12);

    // Iterate over formData to add text fields
    for (const [key, value] of Object.entries(formData)) {
        if (key !== 'uploadedFiles') { // Exclude file uploads
            let displayValue = '';

            if (Array.isArray(value)) {
                displayValue = value.join(', ');
            } else {
                displayValue = value;
            }

            // Handle different types of data
            switch (key) {
                case 'cotas':
                    displayValue = value.join(', ');
                    break;
                    // Add more cases if specific formatting is needed
                default:
                    break;
            }

            doc.text(`${formatFieldName(key)}: ${displayValue}`, 10, yPosition);
            yPosition += 10;

            // Add a new page if yPosition exceeds limit
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        }
    }

    // Convert the PDF to bytes for merging
    const initialPdfBytes = doc.output('arraybuffer');
    return initialPdfBytes;
}

function formatFieldName(fieldName) {
    // Convert camelCase or snake_case to Title Case with spaces
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letters
}

async function mergeUploadedPdfs(initialPdfBytes, uploadedFiles) {
    const {
        PDFDocument
    } = PDFLib;

    // Load the generated PDF
    const pdfDoc = await PDFDocument.load(initialPdfBytes);

    // Iterate over each file input and merge PDFs
    for (const [inputName, files] of Object.entries(uploadedFiles)) {
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
                pdfDoc.addPage([imgDims.width, imgDims.height]);
                const lastPage = pdfDoc.getPages().pop();
                lastPage.drawImage(img, {
                    x: 0,
                    y: 0,
                    width: imgDims.width,
                    height: imgDims.height,
                });
            }
            // Handle other file types if necessary
        }
    }

    const mergedPdfBytes = await pdfDoc.save();
    return mergedPdfBytes;
}

function downloadPdf(pdfBytes, fileName) {
    const blob = new Blob([pdfBytes], {
        type: 'application/pdf'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
}