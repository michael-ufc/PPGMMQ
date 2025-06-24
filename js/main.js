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

    // Step 3: Add form validation before PDF generation
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();

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
            return label.innerText.trim();
        }
    }
    // Fallback para encontrar o label mais próximo
    const parent = inputElement.closest('div');
    if (parent) {
        const label = parent.querySelector('label');
        if (label) return label.innerText.trim();
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
        const feedback = el.querySelector('.invalid-feedback');
        if (feedback) feedback.style.display = 'none';
    });


    // Validação de inputs regulares, emails e arquivos com 'required'
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    for (const input of inputs) {
        let isFieldValid = true;
        let errorMessage = '';

        if (input.type === 'file') {
            if (input.files.length === 0) {
                isFieldValid = false;
                errorMessage = `Por favor, anexe o arquivo para "${getLabelForInput(input)}".`;
            }
        } else if (input.type === 'radio' || input.type === 'checkbox') {
            // Radios e checkboxes são validados em seus grupos específicos abaixo
            continue;
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

    // Validação específica para #section1_form - groupCotas
    const section1Form = document.getElementById('section1_form');
    if (section1Form) {
        const cotasCheckboxes = section1Form.querySelectorAll('input[name="cotas"]');
        const cotasContainer = section1Form.querySelector('[aria-labelledby="groupCotas"]');
        const isCotasChecked = Array.from(cotasCheckboxes).some(checkbox => checkbox.checked);

        if (!isCotasChecked) {
            cotasContainer.classList.add('is-invalid');
            cotasContainer.querySelector('.invalid-feedback').style.display = 'block';
            return {
                isValid: false,
                message: 'Por favor, selecione pelo menos uma opção no campo "Concorrer às cotas?".',
                element: cotasContainer
            };
        } else {
            cotasContainer.classList.remove('is-invalid');
        }
    }

    // Validação específica do #section5_form (grupos de radio)
    const section5Form = document.getElementById('section5_form');
    if (section5Form) {
        const radioGroups = new Set(Array.from(section5Form.querySelectorAll('input[type="radio"][required]')).map(r => r.name));

        for (const groupName of radioGroups) {
            const groupInputs = section5Form.querySelectorAll(`input[name="${groupName}"]`);
            const isGroupValid = Array.from(groupInputs).some(radio => radio.checked);
            const groupContainer = groupInputs[0].closest('.mb-3'); // Container do grupo

            if (!isGroupValid) {
                groupContainer.classList.add('is-invalid');
                const feedback = groupContainer.querySelector('.invalid-feedback');
                if (feedback) feedback.style.display = 'block';
                return {
                    isValid: false,
                    message: `Por favor, selecione uma opção para a pergunta: "${groupContainer.querySelector('h6, p').innerText.trim()}"`,
                    element: groupContainer
                };
            }
        }
    }

    // Validação específica do #section6_form (declarações)
    const section6Form = document.getElementById('section6_form');
    if (section6Form) {
        const situacaoAtualRadios = section6Form.querySelectorAll('input[name="situacaoAtual"]');
        const situacaoSelecionada = Array.from(situacaoAtualRadios).some(radio => radio.checked);

        if (!situacaoSelecionada) {
            const container = document.querySelector('label[for="situacaoAtual"]').parentElement;
            container.classList.add('is-invalid');
            container.querySelector('.invalid-feedback').style.display = 'block';
            return {
                isValid: false,
                message: 'Por favor, selecione sua situação profissional atual.',
                element: container
            };
        }

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