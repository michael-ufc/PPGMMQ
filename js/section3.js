// js/section3.js

import {
    appendHTML
} from './utils.js';

const courseCategories = {
    "Matemática": [
        ["CalculoFundamental1", "Cálculo Diferencial e Integral 1 (ou Cálculo Fundamental 1)"],
        ["CalculoFundamental2", "Cálculo Diferencial e Integral 2 (ou Cálculo Fundamental 2)"],
        ["CalculoFundamental3", "Cálculo Diferencial e Integral 3 (ou Cálculo Fundamental 3)"],
        ["CalculoComVariasVariaveis", "Cálculo com Variáveis Complexas (ou Variável Complexa)"],
        ["AlgebraLinear", "Álgebra Linear"],
        ["GeometriaAnalitica", "Geometria Analítica (ou Geometria Analítica e Vetores, ou Geometria Analítica Vetorial)"],
        ["AnaliseMatematica1", "Análise Matemática 1 (ou Análise Real 1, ou Análise na Reta 1)"]
    ],
    "Estatística": [
        ["AnaliseExploratoriaDeDados", "Análise Exploratória de Dados"],
        ["IntroducaoEstatistica", "Introdução à Estatística (ou Probabilidade e Estatística, ou Fundamentos de Estatística, ou Introdução à Probabilidade e à Estatística)"],
        ["CalculoDasProbabilidades", "Cálculo das Probabilidades (ou Modelos Probabilísticos)"],
        ["Probabilidade1", "Probabilidade 1"],
        ["Probabilidade2", "Probabilidade 2"],
        ["InferênciaEstatistica1", "Inferência Estatística 1"],
        ["ModelosDeRegressao1", "Modelos de Regressão 1"],
    ],
    "Computação": [
        ["CalculoNumerico", "Cálculo Numérico (ou Métodos Numéricos)"],
        ["FundamentosDeProgramacao", "Fundamentos de Programação"],
        ["AnaliseDeAlgoritmos", "Construção e Análise de Algoritmos"],
        ["EstruturaDeDados", "Estrutura de Dados"],
        ["MatematicaFinita", "Matemática Finita (ou Matemática Discreta ou Elementos de Análise Combinatória)"]
    ],
    "PPGMMQ": [
        ["IntroducaoModelagem", "Introdução à Modelagem"],
        ["ProbabilidadeEstatistica", "Probabilidade e Inferência Estatística"],
        ["OtimizacaoLinear", "Otimização Linear"],
        ["ProgramacaoCientifica", "Elementos de Programação Científica"],
        ["IntroducaoInferênciaBayesiana", "Introdução à Inferência Bayesiana"],
        ["ModelosDeRegressao", "Modelos de Regressão"],
        ["ModelagemMultivariada", "Métodos de Modelagem Multivariada"],
        ["MetodosComputacionaisEmEstatistica", "Métodos Computacionais em Estatística"],
        ["ProcessosEstocasticos", "Processos Estocásticos"],
        ["TeoriaDosJogosConflitos", "Teoria dos Jogos e Análise de Conflitos"],
        ["MetodosMatematicosFisica", "Métodos Matemáticos em Física"],
        ["TopicosEspeciaisModelagemEstatistica", "Tópicos Especiais de Modelagem Estatística e Matemática"],
        ["InteligenciaComputacional", "Inteligência Computacional"],
        ["Metaheuristicas", "Metaheurísticas"],
        ["OtimizacaoInteira", "Otimização Inteira"],
        ["OtimizacaoCombinatoriaGrafos", "Otimização Combinatória e em Grafos"],
        ["OtimizacaoNaoLinear", "Otimização Não Linear"],
    ],
};


// Registro para armazenar disciplinas selecionadas
const selectedCourses = new Set();

function createCourseContainer(containerId, courseNumber, required = true) {
    return `
        <div id="${containerId}-container-${courseNumber}" class="mb-3 mx-3">
            <label for="${containerId}-${courseNumber}" class="form-label">
                <strong>Disciplina ${courseNumber}</strong> 
                ${required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <select class="form-select disciplina-select my-1" id="${containerId}-${courseNumber}" name="${containerId}-${courseNumber}" ${required ? 'required' : ''}>
            </select>
            <div class="invalid-feedback">Por favor, selecione uma disciplina.</div>
            
            <div class="mb-3">
                <label for="${containerId}-${courseNumber}Name" class="form-label">
                    Disciplinas equivalentes no seu histórico
                </label>
                <textarea class="form-control" id="${containerId}-${courseNumber}Name" name="${containerId}-${courseNumber}Name" ${required ? 'required' : ''}></textarea>
                <div class="invalid-feedback">Por favor, insira o nome da disciplina.</div>
            </div>
            
            <div class="mb-3">
                <label for="course${courseNumber}Syllabi" class="form-label">
                    Ementas das disciplinas equivalentes
                    <small class="text-muted">(não é necessário anexar se a disciplina tiver exatamente o mesmo nome)</small>
                </label>
                <input type="file" class="form-control" id="${containerId}-${courseNumber}Syllabi" name="${containerId}-${courseNumber}Syllabi[]" multiple accept=".pdf">
                <div class="invalid-feedback">Por favor, envie a(s) ementa(s) da disciplina que você cursou.</div>
            </div>
        </div>
    `;
}

function populateSelect(selectElement, categories, includeOptGroups = false) {
    // Add a neutral default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    if (categories.length > 1)
        defaultOption.textContent = "Selecione uma disciplina de Matemática, Estatística ou Computação";
    else
        defaultOption.textContent = "Selecione uma disciplina de " + categories[0];
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);

    if (includeOptGroups && categories.length > 1) {
        categories.forEach(category => {
            const optGroup = document.createElement("optgroup");
            optGroup.label = category;
            courseCategories[category].forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                optGroup.appendChild(option);
            });
            selectElement.appendChild(optGroup);
        });
    } else {
        const singleCategory = categories[0];
        courseCategories[singleCategory].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            selectElement.appendChild(option);
        });
    }

    // Enable the select element after populating
    selectElement.disabled = false;
}

function initializeCoursesContainer() {
    const courseConfigs = [{
            number: 1,
            categories: ["Matemática"]
        },
        {
            number: 2,
            categories: ["Matemática"]
        },
        {
            number: 3,
            categories: ["Estatística"]
        },
        {
            number: 4,
            categories: ["Computação"]
        },
        {
            number: 5,
            categories: ["Matemática", "Estatística", "Computação"],
            includeOptGroups: true
        },
    ];

    // Target the .card-body dentro de coursesContainer
    const containerId = "courses";
    const coursesContainer = document.getElementById(containerId).querySelector(".card-body");

    courseConfigs.forEach(config => {
        appendHTML(coursesContainer, createCourseContainer(containerId, config.number));
    });

    courseConfigs.forEach(config => {
        const {
            number,
            categories,
            includeOptGroups = false
        } = config;
        const courseSelect = document.getElementById(`${containerId}-${number}`);
        populateSelect(courseSelect, categories, includeOptGroups);

        // Adicionar event listener para gerenciar seleção única
        courseSelect.addEventListener('change', (event) => {
            const previousValue = courseSelect.getAttribute('data-previous') || "";
            const currentValue = event.target.value;

            if (previousValue) {
                selectedCourses.delete(previousValue);
                updateAllSelectOptions();
            }

            if (currentValue) {
                selectedCourses.add(currentValue);
                courseSelect.setAttribute('data-previous', currentValue);
            } else {
                courseSelect.removeAttribute('data-previous');
            }

            updateAllSelectOptions();
        });
    });
}

function initializeBonusCourses1() {
    const containerId = "bonusCourses1";
    const bonusCoursesContainer = document.getElementById(containerId).querySelector(".card-body");
    const numberOfBonusCourses = 5;

    // Criar os containers das disciplinas bônus
    for (let i = 1; i <= numberOfBonusCourses; i++) {
        appendHTML(bonusCoursesContainer, createCourseContainer(containerId, 5 + i, false));
    }

    // Popular os selects das disciplinas bônus
    for (let i = 1; i <= numberOfBonusCourses; i++) {
        const bonusSelect = document.getElementById(`${containerId}-${5 + i}`);
        populateSelect(bonusSelect, ["Matemática", "Estatística", "Computação"], true);

        // Adicionar event listener para gerenciar seleção única
        bonusSelect.addEventListener('change', (event) => {
            const previousValue = bonusSelect.getAttribute('data-previous') || "";
            const currentValue = event.target.value;

            if (previousValue) {
                selectedCourses.delete(previousValue);
                updateAllSelectOptions();
            }

            if (currentValue) {
                selectedCourses.add(currentValue);
                bonusSelect.setAttribute('data-previous', currentValue);
            } else {
                bonusSelect.removeAttribute('data-previous');
            }

            updateAllSelectOptions();
        });
    }
}

function initializeBonusCourses2() {
    const containerId = "bonusCourses2";
    const bonusCoursesContainer = document.getElementById(containerId).querySelector(".card-body");
    const numberOfBonusCourses = 4;

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        appendHTML(bonusCoursesContainer, createCourseContainer(containerId, 10 + i, false));
    }

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        const bonusSelect = document.getElementById(`${containerId}-${10 + i}`);
        populateSelect(bonusSelect, ["PPGMMQ"], true);

        // Adicionar event listener para gerenciar seleção única
        bonusSelect.addEventListener('change', (event) => {
            const previousValue = bonusSelect.getAttribute('data-previous') || "";
            const currentValue = event.target.value;

            if (previousValue) {
                selectedCourses.delete(previousValue);
                updateAllSelectOptions();
            }

            if (currentValue) {
                selectedCourses.add(currentValue);
                bonusSelect.setAttribute('data-previous', currentValue);
            } else {
                bonusSelect.removeAttribute('data-previous');
            }

            updateAllSelectOptions();
        });
    }
}

export function initializeSection3() {
    // Retornar se não houver "section3_form"
    if (!document.getElementById("section3_form")) return;

    initializeCoursesContainer();
    initializeBonusCourses1();
    initializeBonusCourses2();
}

// Função para atualizar as opções disponíveis em todos os selects
function updateAllSelectOptions() {
    const allSelects = document.querySelectorAll('.disciplina-select');

    allSelects.forEach(select => {
        const currentValue = select.value;
        const options = select.querySelectorAll('option');

        options.forEach(option => {
            if (option.value === "") return; // Ignorar a opção padrão

            if (selectedCourses.has(option.value) && option.value !== currentValue) {
                option.disabled = true;
                option.classList.add('text-muted');
            } else {
                option.disabled = false;
                option.classList.remove('text-muted');
            }
        });
    });
}