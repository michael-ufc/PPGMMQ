// js/main.js

import {
    loadIncludes
} from './includes.js';
import {
    initializeSection1
} from './section1.js';
import {
    initializePopovers
} from './popovers.js';
import {
    generateAndMergePDF
} from './generatePdf.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Step 1: Load includes
    await loadIncludes();

    // Step 2: Initialize dependent scripts
    initializeSection1();
    initializePopovers();

    // Step 2.1: Setup modalidade selector (Mestrado/Doutorado)
    setupModalidadeSwitcher();

    // Step 3: Add form validation before PDF generation
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Ensure modality-dependent required flags are synced
        const modalidadeSelect = document.getElementById('modalidadeSelect');
        if (modalidadeSelect) applyModalidade(modalidadeSelect.value);

        // Step 4: Validate form before PDF generation
        const form = document.getElementById('applicationForm'); // Assuming form ID
        const validationResult = validateForm(form);
        if (!validationResult.isValid) {
            // Exibe a mensagem de erro específica
            alert(validationResult.message);
            // Rola a tela até o elemento com erro e o foca
            if (validationResult.element) {
                validationResult.element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                // Tenta focar no elemento para melhor UX
                if (typeof validationResult.element.focus === 'function') {
                    validationResult.element.focus();
                }
            }
            return;
        }

        // Step 5: Generate PDF
        try {
            await generateAndMergePDF('applicationForm');
            alert('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
            alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
        }
    });
});


/**
 * Encontra o texto do label associado a um campo de input.
 * @param {HTMLElement} inputElement O elemento de input.
 * @returns {string} O texto do label.
 */
function getLabelForInput(inputElement) {
    if (inputElement.id) {
        const label = document.querySelector(`label[for="${inputElement.id}"]`);
        if (label) {
            // Pega o texto do label principal, ignorando spans internos
            return label.cloneNode(true).querySelector('span.text-danger')?.remove() && label.innerText.trim();
        }
    }
    // Fallback para encontrar o label/legend mais próximo dentro do container
    const parent = inputElement.closest('.mb-3, .card-body');
    if (parent) {
        const label = parent.querySelector('label.form-label, legend.form-label');
        if (label) return label.innerText.trim().split('\n')[0]; // Pega a primeira linha
    }
    return 'Campo sem nome'; // Fallback
}


/**
 * Valida o formulário e retorna um objeto indicando o status e a mensagem de erro.
 * @param {HTMLFormElement} form O formulário a ser validado.
 * @returns {{isValid: boolean, message?: string, element?: HTMLElement}}
 */
function validateForm(form) {
    // Limpa a validação anterior de todos os campos
    form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
        const feedback = el.closest('.mb-3, .card-body')?.querySelector('.invalid-feedback');
        if (feedback) feedback.style.display = 'none';
    });

    // Validação de inputs regulares (texto, email, etc.) e textareas com 'required'
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    for (const input of inputs) {
        // Pula radios e checkboxes, que são validados em grupo
        if (input.type === 'radio' || input.type === 'checkbox') {
            continue;
        }

        let isFieldValid = true;
        let errorMessage = '';

        if (input.type === 'file') {
            if (input.files.length === 0) {
                isFieldValid = false;
                errorMessage = `Por favor, anexe o arquivo para "${getLabelForInput(input)}".`;
            }
        } else if (!input.value.trim()) {
            isFieldValid = false;
            errorMessage = `Por favor, preencha o campo "${getLabelForInput(input)}".`;
        }

        if (!isFieldValid) {
            input.classList.add('is-invalid');
            return {
                isValid: false,
                message: errorMessage,
                element: input
            };
        } else {
            input.classList.add('is-valid');
        }
    }

    // Validação de grupos de checkboxes (ex: cotas)
    const cotasCheckboxes = form.querySelectorAll('input[name="cotas"]');
    if (cotasCheckboxes.length > 0) {
        const cotasContainer = form.querySelector('[aria-labelledby="groupCotas"]');
        const isCotasChecked = Array.from(cotasCheckboxes).some(checkbox => checkbox.checked);

        if (!isCotasChecked) {
            cotasContainer.classList.add('is-invalid');
            cotasContainer.querySelector('.invalid-feedback').style.display = 'block';
            return {
                isValid: false,
                message: 'Por favor, selecione pelo menos uma opção no campo "Enquadramento para cotas".',
                element: cotasContainer
            };
        }
    }

    // Validação genérica para TODOS os grupos de radio 'required' no formulário
    const radioGroups = new Set(Array.from(form.querySelectorAll('input[type="radio"][required]')).map(r => r.name));

    for (const groupName of radioGroups) {
        const groupInputs = form.querySelectorAll(`input[name="${groupName}"]`);
        const isGroupValid = Array.from(groupInputs).some(radio => radio.checked);

        if (!isGroupValid) {
            // Encontra o container mais próximo que agrupa a pergunta
            const groupContainer = groupInputs[0].closest('.mb-3, .card-body');
            if (groupContainer) {
                groupContainer.classList.add('is-invalid');
                const feedback = groupContainer.querySelector('.invalid-feedback');
                if (feedback) feedback.style.display = 'block';
            }

            const questionText = getLabelForInput(groupInputs[0]);
            return {
                isValid: false,
                message: `Por favor, selecione uma opção para a pergunta: "${questionText}"`,
                element: groupContainer || groupInputs[0]
            };
        }
    }

    // Validação específica para os checkboxes de declaração da Seção 6
    const section6Form = document.getElementById('section6_form');
    if (section6Form) {
        const checkboxCiente = document.getElementById('estouCienteDasPenalidades');
        const checkboxAutorizo = document.getElementById('autorizoAveriguacoes');
        if (!checkboxCiente.checked || !checkboxAutorizo.checked) {
            const container = checkboxCiente.closest('fieldset');
            container.classList.add('is-invalid');
            container.querySelector('.invalid-feedback').style.display = 'block';
            return {
                isValid: false,
                message: 'Você deve marcar as duas caixas de declaração para prosseguir.',
                element: container
            };
        }
    }

    return {
        isValid: true
    };
}

// --- Modalidade handling (Mestrado/Doutorado) ---
function setupModalidadeSwitcher() {
    const select = document.getElementById('modalidadeSelect');
    if (!select) return;
    // Apply initial state
    applyModalidade(select.value);
    // Listen to changes
    select.addEventListener('change', () => applyModalidade(select.value));
}

function applyModalidade(modalidade) {
    const isDoutorado = (modalidade === 'Doutorado');

    // Toggle doutorado-only blocks
    document.querySelectorAll('[data-modalidade="doutorado"]').forEach(container => {
        container.style.display = isDoutorado ? '' : 'none';
        // Toggle required for inputs inside the container
        container.querySelectorAll('input, select, textarea').forEach(input => {
            if (['diplomaMestradoUpload','historicoMestradoUpload','projetoPesquisaUpload'].includes(input.id)) {
                if (isDoutorado) {
                    input.setAttribute('required', 'required');
                } else {
                    input.removeAttribute('required');
                    input.classList.remove('is-invalid','is-valid');
                }
            }
        });
    });

    // Update motivation label (mestrado/doutorado)
    const nivelSpan = document.getElementById('nivelPrograma');
    if (nivelSpan) nivelSpan.textContent = isDoutorado ? 'doutorado' : 'mestrado';

    // Update header title text
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) {
        headerTitle.textContent = isDoutorado
            ? 'PPGMMQ Seleção 2026/1 - DOUTORADO'
            : 'PPGMMQ Seleção 2026/1 - MESTRADO';
    }

    // Sync hidden input for PDF and data collection
    const hiddenModalidade = document.getElementById('modalidade');
    if (hiddenModalidade) hiddenModalidade.value = isDoutorado ? 'Doutorado' : 'Mestrado';
}
