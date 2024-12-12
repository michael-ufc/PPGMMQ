// script.js

// Ativar validação de formulário do Bootstrap
(function() {
    'use strict'

    const forms = document.querySelectorAll('#inscricaoForm')

    Array.from(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
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

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar ScrollSpy para a navegação lateral
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#sidebar",
        offset: 100,
    });

    // Atualizar a barra de progresso com base na posição do scroll
    const progressBar = document.getElementById("formProgress");

    function updateProgressBar() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let docHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrolled = (scrollTop / docHeight) * 100;
        scrolled = scrolled > 100 ? 100 : scrolled;
        progressBar.style.width = scrolled + "%";
        progressBar.setAttribute("aria-valuenow", scrolled.toFixed(0));
        progressBar.textContent = scrolled.toFixed(0) + "%";
    }

    window.addEventListener("scroll", updateProgressBar);
    updateProgressBar(); // Inicializar ao carregar a página

    // Inicializar Popovers
    var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Função para criar uma disciplina adicional
    function createDisciplina(type) {
        const disciplinasAdicionaisContainer = document.getElementById(
            "disciplinas-adicionais-container"
        );

        const disciplinaIndex = disciplinasAdicionaisContainer.querySelectorAll(
            ".disciplina-adicional"
        ).length + 1;

        const max = type === "bonus1" ? 5 : 4;

        if (
            disciplinasAdicionaisContainer.querySelectorAll(
                `.disciplina-adicional[data-type="${type}"]`
            ).length >= max
        ) {
            alert(`Você já adicionou o máximo de ${max} disciplinas para ${type.toUpperCase()}.`);
            return;
        }

        const disciplinaDiv = document.createElement("div");
        disciplinaDiv.classList.add("disciplina-adicional", "mb-4");
        disciplinaDiv.setAttribute("data-type", type);

        disciplinaDiv.innerHTML = `
        <h5>Disciplina Adicional ${disciplinaIndex} (${type.toUpperCase()})</h5>
        <div class="row mb-3">
          <div class="col-md-8">
            <select class="form-select disciplina-select" required>
              <option value="" disabled selected>
                Selecione a Disciplina
              </option>
              <!-- Matematica -->
              <optgroup label="Matemática">
                <option value="Calculus_I">Cálculo Diferencial e Integral 1</option>
                <option value="Calculus_II">Cálculo Diferencial e Integral 2</option>
                <option value="Calculus_III">Cálculo Diferencial e Integral 3</option>
                <option value="Complex_Variables">Cálculo com Variáveis Complexas</option>
                <option value="Linear_Algebra">Álgebra Linear</option>
                <option value="Analytic_Geometry">Geometria Analítica</option>
                <option value="Mathematical_Analysis">Análise Matemática 1</option>
              </optgroup>
              <!-- Estatística -->
              <optgroup label="Estatística">
                <option value="Exploratory_Data_Analysis">Análise Exploratória de Dados</option>
                <option value="Introduction_Statistics">Introdução à Estatística</option>
                <option value="Probability_Calculation">Cálculo das Probabilidades</option>
                <option value="Probability_1">Probabilidade 1</option>
                <option value="Probability_2">Probabilidade 2</option>
                <option value="Statistical_Inference">Inferência Estatística 1</option>
                <option value="Regression_Models">Modelos de Regressão 1</option>
              </optgroup>
              <!-- Computação -->
              <optgroup label="Computação">
                <option value="Numerical_Calculus">Cálculo Numérico</option>
                <option value="Programming_Fundamentals">Fundamentos de Programação</option>
                <option value="Algorithm_Analysis">Construção e Análise de Algoritmos</option>
                <option value="Data_Structures">Estrutura de Dados</option>
                <option value="Finite_Math">Matemática Finita</option>
              </optgroup>
            </select>
            <div class="invalid-feedback">
              Por favor, selecione uma disciplina.
            </div>
          </div>
          <div class="col-md-4 d-flex align-items-center">
            <button type="button" class="btn btn-danger remove-disciplina-btn">
              <i class="bi bi-trash"></i> Remover
            </button>
          </div>
        </div>
        <div class="ementas-container mb-3">
          <div class="mb-3 ementa-group">
            <label class="form-label">
              Ementa Equivalente <span class="text-danger">*</span>
            </label>
            <input type="file" class="form-control ementa-input" required />
            <div class="invalid-feedback">
              Por favor, envie a ementa equivalente.
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm add-ementa-btn">
            <i class="bi bi-plus-circle"></i> Adicionar Mais Ementas
          </button>
        </div>
      `;

        disciplinasAdicionaisContainer.appendChild(disciplinaDiv);
    }

    // Função para adicionar ementas adicionais
    function addEmenta(event) {
        const ementasContainer = event.target.parentElement;
        const ementaGroup = document.createElement("div");
        ementaGroup.classList.add("mb-3", "ementa-group");
        ementaGroup.innerHTML = `
        <label class="form-label">
          Ementa Equivalente <span class="text-danger">*</span>
        </label>
        <input type="file" class="form-control ementa-input" required />
        <div class="invalid-feedback">
          Por favor, envie a ementa equivalente.
        </div>
      `;
        ementasContainer.insertBefore(ementaGroup, event.target);
    }

    // Adicionar Disciplina
    document.getElementById("addBonus1Btn").addEventListener("click", () => {
        createDisciplina("bonus1");
    });

    document.getElementById("addBonus2Btn").addEventListener("click", () => {
        createDisciplina("bonus2");
    });

    // Delegação de eventos para remover disciplinas e adicionar ementas
    document
        .getElementById("disciplinas-adicionais-container")
        .addEventListener("click", function(e) {
            if (e.target.closest(".remove-disciplina-btn")) {
                const disciplinaDiv = e.target.closest(".disciplina-adicional");
                disciplinaDiv.remove();
            }

            if (e.target.closest(".add-ementa-btn")) {
                addEmenta(e);
            }
        });

    // Validação do formulário
    const form = document.getElementById("inscricaoForm");

    form.addEventListener(
        "submit",
        function(event) {
            // Validar checkbox na Seção 6
            const declaracoes = form.querySelectorAll('input[name="declaracoes2"]:checked');
            if (declaracoes.length < 2) {
                event.preventDefault();
                event.stopPropagation();
                declaracoes.forEach((checkbox) => {
                    checkbox.classList.add("is-invalid");
                });
            } else {
                declaracoes.forEach((checkbox) => {
                    checkbox.classList.remove("is-invalid");
                });
            }

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");
        },
        false
    );
});