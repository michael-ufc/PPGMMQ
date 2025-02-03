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
        if (!validateForm(form)) {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
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

function validateForm(form) {
    let isValid = true;

    // Validação de inputs regulares, emails e arquivos
    form.querySelectorAll('input, select, textarea').forEach((input) => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else if (input.type === 'file' && input.hasAttribute('required') && input.files.length === 0) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    // Validação específica para #section1_form - groupCotas
    const section1Form = document.getElementById('section1_form');
    if (section1Form) {
        const cotasCheckboxes = section1Form.querySelectorAll('input[name="cotas"]');
        const cotasContainer = section1Form.querySelector('[aria-labelledby="groupCotas"]');
        const isCotasChecked = Array.from(cotasCheckboxes).some(checkbox => checkbox.checked);

        if (!isCotasChecked) {
            cotasContainer.classList.add('is-invalid');
            cotasContainer.querySelector('.invalid-feedback').style.display = 'block';
            isValid = false;
        } else {
            cotasContainer.classList.remove('is-invalid');
            cotasContainer.querySelector('.invalid-feedback').style.display = 'none';
        }
    }

    // Validação específica do #section4_form
    const section4Form = document.getElementById('section4_form');
    if (section4Form) {
        section4Form.querySelectorAll('input[type="number"]').forEach(numberInput => {
            const relatedFileInput = document.getElementById(`${numberInput.id}Upload`);

            if (numberInput.value.trim() !== "" && Number(numberInput.value) > 0) {
                // Se quantidade/mês for maior que zero, o arquivo se torna obrigatório
                if (!relatedFileInput || relatedFileInput.files.length === 0) {
                    relatedFileInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    relatedFileInput.classList.remove('is-invalid');
                    relatedFileInput.classList.add('is-valid');
                }
            } else {
                // Se quantidade/mês for zero ou vazio, limpa a validação do arquivo
                if (relatedFileInput) {
                    relatedFileInput.classList.remove('is-invalid', 'is-valid');
                }
            }
        });
    }

    // Validação específica do #section5_form
    const section5Form = document.getElementById('section5_form');
    if (section5Form) {
        const radioGroups = section5Form.querySelectorAll('input[type="radio"][required]');
        const groupNames = new Set();

        // Identificar os grupos únicos baseados no atributo 'name'
        radioGroups.forEach(radio => groupNames.add(radio.name));

        groupNames.forEach(groupName => {
            const groupInputs = section5Form.querySelectorAll(`input[name="${groupName}"]`);
            const isGroupValid = Array.from(groupInputs).some(radio => radio.checked);

            // Encontrar o contêiner pai onde está o grupo e o invalid-feedback
            const groupContainer = groupInputs[0].closest('.mb-3');

            if (!isGroupValid) {
                // Adiciona a classe 'is-invalid' no contêiner principal do grupo
                groupContainer.classList.add('is-invalid');
                groupContainer.querySelector('.invalid-feedback').style.display = 'block';
                isValid = false;
            } else {
                // Remove a classe 'is-invalid' e esconde o feedback
                groupContainer.classList.remove('is-invalid');
                groupContainer.querySelector('.invalid-feedback').style.display = 'none';
            }
        });
    }

    // Validação específica do #section6_form
    if (document.getElementById('section6_form')) {
        const situacaoAtualRadios = document.querySelectorAll('input[name="situacaoAtual"]');
        const situacaoAtualContainer = document.querySelector('label[for="situacaoAtual"]').parentElement;
        const situacaoSelecionada = Array.from(situacaoAtualRadios).some(radio => radio.checked);

        if (!situacaoSelecionada) {
            situacaoAtualContainer.classList.add('is-invalid');
            situacaoAtualContainer.querySelector('.invalid-feedback').style.display = 'block';
            isValid = false;
        } else {
            situacaoAtualContainer.classList.remove('is-invalid');
            situacaoAtualContainer.querySelector('.invalid-feedback').style.display = 'none';
        }

        const checkboxCiente = document.getElementById('estouCienteDasPenalidades');
        const checkboxAutorizo = document.getElementById('autorizoAveriguacoes');
        const declaracoesContainer = document.querySelector('fieldset');

        if (!checkboxCiente.checked || !checkboxAutorizo.checked) {
            declaracoesContainer.classList.add('is-invalid');
            declaracoesContainer.querySelector('.invalid-feedback').style.display = 'block';
            isValid = false;
        } else {
            declaracoesContainer.classList.remove('is-invalid');
            declaracoesContainer.querySelector('.invalid-feedback').style.display = 'none';
        }
    }

    return isValid;
}