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
    initializeSection1();
    initializeCourseSelection();

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

    // Verificar inputs regulares, emails e arquivos
    form.querySelectorAll('input, select, textarea').forEach((input) => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else if (input.type === 'email' && !input.value.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) {
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

    // Verificar se pelo menos uma opção de "cotas" foi selecionada
    const cotasGroup = document.getElementById('groupCotas').parentNode; // Container principal
    const cotasCheckboxes = document.querySelectorAll('input[name="cotas"]');
    const cotasChecked = Array.from(cotasCheckboxes).some(checkbox => checkbox.checked);

    if (!cotasChecked) {
        // Adicionar classe de erro e exibir mensagem
        cotasGroup.classList.add('is-invalid');
        cotasGroup.querySelector('.invalid-feedback').style.display = 'block';
        isValid = false;
    } else {
        // Remover classe de erro e ocultar mensagem
        cotasGroup.classList.remove('is-invalid');
        cotasGroup.querySelector('.invalid-feedback').style.display = 'none';
    }

    return isValid;
}

function initializeSection1() {
    const checkboxes = document.querySelectorAll('input[name="cotas"]');
    const cotaNaoSeAplica = document.getElementById('cotaNaoSeAplica');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Se "Não se aplica" for marcado, desmarcar os outros checkboxes
            if (cotaNaoSeAplica.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== cotaNaoSeAplica) cb.checked = false;
                });
                document.getElementById('pcdInput').style.display = 'none';
                document.getElementById('outrosInput').style.display = 'none';
            } else {
                // Desmarcar "Não se aplica" se qualquer outro for marcado
                cotaNaoSeAplica.checked = false;
            }
        });
    });

    // Mostrar campos adicionais apenas se os checkboxes específicos forem selecionados
    document.getElementById('cotaPcd').addEventListener('change', function() {
        document.getElementById('pcdInput').style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('cotaOutros').addEventListener('change', function() {
        document.getElementById('outrosInput').style.display = this.checked ? 'block' : 'none';
    });
}