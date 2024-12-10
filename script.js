// script.js

// Ativar validação de formulário do Bootstrap
(function () {
    'use strict'

    const forms = document.querySelectorAll('#inscricaoForm')

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            // Validação de cotas (pelo menos uma marcada)
            const cotas = form.querySelectorAll('input[name="cotas"]:checked')
            if (cotas.length === 0) {
                const cotaSection = form.querySelector('input[name="cotas"]')
                cotaSection.classList.add('is-invalid')
                event.preventDefault()
                event.stopPropagation()
            } else {
                form.querySelectorAll('input[name="cotas"]').forEach(input => {
                    input.classList.remove('is-invalid')
                })
            }

            // Validação das declarações (ambas as checkboxes devem estar marcadas)
            const declaracao1 = form.querySelector('input[name="declaracoes2"][value="Sim, declaro estar ciente."]')
            const declaracao2 = form.querySelector('input[name="declaracoes2"][value="Sim, autorizo a averiguação das informações."]')
            if (!declaracao1.checked || !declaracao2.checked) {
                const declaracaoSection = form.querySelector('input[name="declaracoes2"]')
                declaracaoSection.classList.add('is-invalid')
                event.preventDefault()
                event.stopPropagation()
            } else {
                form.querySelectorAll('input[name="declaracoes2"]').forEach(input => {
                    input.classList.remove('is-invalid')
                })
            }

            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()
