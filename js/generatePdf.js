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
    PDFDocument,
    rgb
} = window.pdfLib || window.PDFLib;

// If using jsPDF loaded via a script tag
const {
    jsPDF
} = window.jspdf;

/**
 * Populates the formData object with realistic mock data for testing purposes.
 * Ensures compatibility with mock PDFs stored in the "mock_pdfs" directory.
 * @param {object} formData - The object containing organized form data grouped by sections.
 * @returns {Promise<object>} - The updated formData object with mock data, including File objects.
 */
export async function setMockData(formData) {
    // Base directory for mock PDFs
    const mockPdfDir = "mock_pdfs/";

    // Helper function to create realistic mock File objects
    const createMockFile = async (filePath, name, type) => {
        const response = await fetch(filePath);
        const blob = await response.blob();
        return new File([blob], name, {
            type
        });
    };

    // Seção 1: Dados Pessoais
    formData.section1_form = {
        nomeCompleto: "João da Silva",
        email: "joao.silva@example.com",
        cpf: "123.456.789-10",
        documentoIdentificacao: "RG 12.345.678-9",
        cidade: "São Paulo",
        telefoneCelular: "(11) 91234-5678",
        cotas: "Sim",
        especificacaoPcd: "Deficiência auditiva",
        especificacaoOutros: "Sem outras especificações",
        uploadedFiles: {
            docIdentidadeUpload: [await createMockFile(`${mockPdfDir}documento_identidade_mock.pdf`, "documento_identidade_mock.pdf", "application/pdf")],
            autodeclaracaoUpload: [await createMockFile(`${mockPdfDir}autodeclaracao_mock.pdf`, "autodeclaracao_mock.pdf", "application/pdf")]
        }
    };

    // Seção 2: Dados Acadêmicos
    formData.section2_form = {
        cursoGraduacao: "Engenharia de Computação",
        instituicao: "Universidade de São Paulo",
        igcInstituicao: "9.0",
        ira: "8.5",
        cursoGraduacao2: "Ciência da Computação",
        instituicao2: "Universidade Federal do Rio de Janeiro",
        igcInstituicao2: "8.8",
        ira2: "8.2",
        curriculoLattes: "https://lattes.cnpq.br/1234567890123456",
        uploadedFiles: {
            diplomaGraduacaoUpload: [await createMockFile(`${mockPdfDir}diploma_graduacao_mock.pdf`, "diploma_graduacao_mock.pdf", "application/pdf")],
            historicoDisciplinasGraduacao: [await createMockFile(`${mockPdfDir}historico_graduacao_mock.pdf`, "historico_graduacao_mock.pdf", "application/pdf")],
            diplomaGraduacaoUpload2: [await createMockFile(`${mockPdfDir}diploma_graduacao2_mock.pdf`, "diploma_graduacao2_mock.pdf", "application/pdf")],
            historicoDisciplinasGraduacao2: [await createMockFile(`${mockPdfDir}historico_graduacao2_mock.pdf`, "historico_graduacao2_mock.pdf", "application/pdf")]
        }
    };

    // Seção 3: Avaliação de Histórico
    formData.section3_form = {
        "courses-1": "Matemática Aplicada",
        "courses-1Name": "Cálculo I",
        "courses-1Syllabi[]": [await createMockFile(`${mockPdfDir}calculo1_syllabus.pdf`, "calculo1_syllabus.pdf", "application/pdf")],
        "courses-2": "Física",
        "courses-2Name": "Mecânica Clássica",
        "courses-2Syllabi[]": [await createMockFile(`${mockPdfDir}mecanica_syllabus.pdf`, "mecanica_syllabus.pdf", "application/pdf")],
        "bonusCourses1-1": "Cursos Extracurriculares",
        "bonusCourses1-1Name": "Introdução à Inteligência Artificial",
        "bonusCourses1-1Syllabi[]": [await createMockFile(`${mockPdfDir}ia_syllabus.pdf`, "ia_syllabus.pdf", "application/pdf")]
    };

    // Seção 4: Análise Curricular
    formData.section4_form = {
        projetosComBolsa: "Projeto de Pesquisa em Machine Learning",
        uploadedFiles: {
            projetosComBolsaUpload: [await createMockFile(`${mockPdfDir}projeto_ml_mock.pdf`, "projeto_ml_mock.pdf", "application/pdf")],
            projetosSemBolsaUpload: [await createMockFile(`${mockPdfDir}projeto_web_mock.pdf`, "projeto_web_mock.pdf", "application/pdf")],
            publicacoesA1A2Upload: [await createMockFile(`${mockPdfDir}publicacao_rn_mock.pdf`, "publicacao_rn_mock.pdf", "application/pdf")],
            publicacoesA3A4Upload: [await createMockFile(`${mockPdfDir}publicacao_pi_mock.pdf`, "publicacao_pi_mock.pdf", "application/pdf")],
            publicacoesB1B2Upload: [await createMockFile(`${mockPdfDir}resenha_cq_mock.pdf`, "resenha_cq_mock.pdf", "application/pdf")]
        }
    };

    // Seção 5: Dados Socioeconômicos
    formData.section5_form = {
        identificacaoRacialEtnica: "Parda",
        localCondicaoMoradia: "Própria",
        numeroMoradores: "4",
        localizacaoMoradia: "Zona Norte",
        tipoEscolaFundamental: "Pública",
        tipoEscolaMedio: "Particular",
        escolaridadeFamiliares: "Mãe: Ensino Médio; Pai: Ensino Superior",
        rendaFamiliar: "3 salários mínimos",
        quantidadeLivros: "20",
        motivacaoEstudos: "Desejo de contribuir para a comunidade acadêmica e profissional."
    };

    // Seção 6: Declarações para Bolsa
    formData.section6_form = {
        situacaoAtual: "Empregado",
        estouCienteDasPenalidades: true,
        autorizoAveriguacoes: true
    };

    return formData;
}

// --- INÍCIO DA ALTERAÇÃO 1: `collectFormData` ---
export function collectFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID '${formId}' not found.`);
        return {};
    }

    const data = {};

    form.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.name) {
            const section = input.closest('[id^="section"]');
            const sectionId = section ? section.id : 'miscellaneous';

            if (!data[sectionId]) {
                data[sectionId] = {};
                data[sectionId].uploadedFiles = {}; // Initialize uploadedFiles
            }

            if (input.type === 'file') {
                data[sectionId].uploadedFiles[input.name] = input.files ? Array.from(input.files) : [];
            } else if (input.type === 'radio') {
                if (input.checked) {
                    // Pega o texto do label associado, em vez do `value`
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    data[sectionId][input.name] = label ? label.innerText.trim() : input.value;
                }
            } else if (input.type === 'checkbox') {
                if (!data[sectionId][input.name]) {
                    data[sectionId][input.name] = [];
                }
                if (input.checked) {
                    // Pega o texto do label associado, em vez do `value`
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    const textValue = label ? label.innerText.trim() : input.value;
                    if (!data[sectionId][input.name].includes(textValue)) {
                        data[sectionId][input.name].push(textValue);
                    }
                }
            } else {
                data[sectionId][input.name] = input.value;
            }
        }
    });

    return data;
}
// --- FIM DA ALTERAÇÃO 1 ---


/**
 * Generates and merges PDFs based on the collected form data and uploaded files.
 * @param {string} formId - The ID of the form to process.
 */
export async function generateAndMergePDF(formId) {
    let formData = collectFormData(formId);

    // Just for testing
    // formData = setMockData(formData);

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

    // Define constantes para layout para facilitar a manutenção
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7; // Altura da linha para fonte tamanho 12
    const fieldSpacing = 5; // Espaçamento extra entre os campos

    let yPosition = 20;

    // Função para adicionar nova página se o conteúdo não couber
    const addNewPageIfNeeded = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }
    };

    // Título
    doc.setFontSize(16);
    doc.text('PPGMMQ Processo Seletivo 2025.1', margin, yPosition);
    yPosition += 15;

    // Itera por cada seção
    for (const [section, fields] of Object.entries(formData)) {
        doc.setFontSize(12);

        // Verifica se o título da seção cabe na página atual
        addNewPageIfNeeded(lineHeight + fieldSpacing);

        // Adiciona cor para os títulos das seções
        doc.setTextColor(0, 102, 204); // Azul
        doc.setFont("helvetica", "bold");
        doc.text(`${formatSectionName(section)}`, margin, yPosition);
        doc.setFont("helvetica", "normal");
        yPosition += lineHeight + fieldSpacing;

        // Reseta a cor para o texto normal
        doc.setTextColor(0, 0, 0); // Preto

        // --- INÍCIO DA ALTERAÇÃO 2: `createInitialPdf` ---
        // Itera por cada campo na seção
        for (const [key, value] of Object.entries(fields)) {
            // Exclui arquivos e valores vazios ou arrays vazios
            if (key !== 'uploadedFiles' && value && (Array.isArray(value) ? value.length > 0 : true)) {
                let fullText;

                // Tratamento especial para os checkboxes de declaração da Seção 6
                if (section === 'section6_form' && (key === 'estouCienteDasPenalidades' || key === 'autorizoAveriguacoes')) {
                    // Para estes campos, o valor já é o texto completo.
                    // Adicionamos um marcador [X] para indicar que foi selecionado.
                    fullText = `[X] ${value.join(', ')}`;
                } else {
                    // Formato padrão "NOME DO CAMPO: Valor" para todos os outros
                    let displayValue = Array.isArray(value) ? value.join(', ') : value.toString();
                    const label = `${formatFieldName(key)}: `;
                    fullText = label + displayValue;
                }

                // Usa splitTextToSize para calcular quantas linhas o texto ocupará
                const lines = doc.splitTextToSize(fullText, maxWidth);
                const requiredHeight = lines.length * lineHeight;

                // Verifica se o bloco de texto cabe na página atual
                addNewPageIfNeeded(requiredHeight + fieldSpacing);

                // Adiciona o texto com quebra de linha automática
                doc.text(fullText, margin, yPosition, {
                    maxWidth: maxWidth
                });

                // Atualiza a posição Y com base na altura do texto renderizado
                yPosition += requiredHeight + fieldSpacing;
            }
        }
        // --- FIM DA ALTERAÇÃO 2 ---
        yPosition += 10; // Adiciona espaço extra após cada seção
    }

    // Converte o PDF em bytes para a mesclagem
    const initialPdfBytes = doc.output('arraybuffer');
    return initialPdfBytes;
}


/**
 * Formats the section ID to a readable section name.
 * @param {string} sectionId - The ID of the section (e.g., 'section1_form').
 * @returns {string} - The formatted section name.
 */
function formatSectionName(sectionId) {
    const sectionTitles = {
        section1_form: "SEÇÃO 1 - DADOS PESSOAIS",
        section2_form: "SEÇÃO 2 - DADOS ACADÊMICOS",
        section4_form: "SEÇÃO 3 - ANÁLISE CURRICULAR",
        section5_form: "SEÇÃO 4 - DADOS SOCIOECONÔMICOS",
        section6_form: "SEÇÃO 5 - DECLARAÇÕES PARA BOLSA",
    };

    return sectionTitles[sectionId] || sectionId.toUpperCase();
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
            // Add a title page for the section attachments
            const titlePage = pdfDoc.addPage();
            titlePage.drawText(`ANEXOS ${formatSectionName(section)}`, {
                x: 50,
                y: 400,
                size: 20,
                color: rgb(0, 0, 0), // Black text
            });

            for (const [inputName, files] of Object.entries(fields.uploadedFiles)) {
                // Validate files
                if (!Array.isArray(files) || files.length === 0) {
                    console.warn(`No valid files for input: ${inputName}`);
                    continue;
                }

                for (let file of files) {
                    if (!(file instanceof File)) {
                        console.error(`Invalid file object for ${inputName}:`, file);
                        continue;
                    }

                    // Handle PDF files
                    if (file.type && file.type.startsWith('application/pdf')) {
                        try {
                            const arrayBuffer = await file.arrayBuffer();
                            const uploadedPdf = await PDFDocument.load(arrayBuffer);
                            const copiedPages = await pdfDoc.copyPages(uploadedPdf, uploadedPdf.getPageIndices());
                            copiedPages.forEach(page => {
                                pdfDoc.addPage(page);
                            });
                        } catch (error) {
                            console.error(`Failed to process PDF: ${file.name}`, error);
                        }
                    }
                    // Handle image files
                    else if (file.type && file.type.startsWith('image/')) {
                        try {
                            const imageBytes = await file.arrayBuffer();
                            let img;
                            if (file.type === 'image/jpeg') {
                                img = await pdfDoc.embedJpg(imageBytes);
                            } else if (file.type === 'image/png') {
                                img = await pdfDoc.embedPng(imageBytes);
                            } else {
                                console.warn(`Unsupported image type: ${file.type}`);
                                continue;
                            }

                            const imgDims = img.scale(0.5);
                            const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
                            page.drawImage(img, {
                                x: 0,
                                y: 0,
                                width: imgDims.width,
                                height: imgDims.height,
                            });
                        } catch (error) {
                            console.error(`Failed to process image: ${file.name}`, error);
                        }
                    }
                    // Unsupported file types
                    else {
                        console.warn(`Skipping unsupported file type: ${file.type}`);
                    }
                }
            }
        } else {
            console.warn(`No uploaded files found in section: ${section}`);
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