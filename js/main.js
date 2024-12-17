// js/main.js

import {
    loadIncludes
} from './includes.js';
import {
    initializeSection1
} from './section1.js';
import {
    initializeSection3
} from './section3.js';
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
    initializeSection3();
    initializePopovers();
    // Step 3: Add form validation before PDF generation
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = document.getElementById('applicationForm'); // Assuming form ID
        if (!validateForm(form)) {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }

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

    // Validação - Situação Atual (pelo menos um rádio selecionado)
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

    // Validação - Declarações (ambas checkboxes obrigatórias)
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

    return isValid;
}