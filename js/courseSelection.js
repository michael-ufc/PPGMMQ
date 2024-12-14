// courseSelection.js

import {
    appendHTML
} from './utils.js';

const courseCategories = {
    "Matemática": [
        ["Calculus_I", "Cálculos I"],
        ["Calculus_II", "Cálculos II"],
        ["Calculus_III", "Cálculos III"],
        ["Complex_Variables", "Cálculos com Variáveis Complexas"],
        ["Linear_Algebra", "Álgebra Linear"],
        ["Analytic_Geometry", "Geometria Analítica"],
        ["Mathematical_Analysis", "Análise Matemática 1"]
    ],
    "Estatística": [
        ["Exploratory_Data_Analysis", "Análise Exploratória de Dados"],
        ["Introduction_Statistics", "Introdução à Estatística"],
        ["Probability_Calculation", "Cálculo das Probabilidades"],
        ["Probability_1", "Probabilidade 1"],
        ["Probability_2", "Probabilidade 2"],
        ["Statistical_Inference", "Inferência Estatística 1"],
        ["Regression_Models", "Modelos de Regressão 1"]
    ],
    "Computação": [
        ["Numerical_Calculus", "Cálculo Numérico"],
        ["Programming_Fundamentals", "Fundamentos de Programação"],
        ["Algorithm_Analysis", "Construção e Análise de Algoritmos"],
        ["Data_Structures", "Estrutura de Dados"],
        ["Finite_Math", "Matemática Finita"]
    ],
    "PPGMMQ": [
        ["Introduction_to_Modeling", "Introdução à Modelagem"],
        ["Probability_and_Statistical_Inference", "Probabilidade e Inferência Estatística"],
        ["Linear_Optimization", "Otimização Linear"],
        ["Scientific_Programming", "Elementos de Programação Científica"],
        ["Introduction_to_Bayesian_Inference", "Introdução à Inferência Bayesiana"],
        ["Regression_Models", "Modelos de Regressão"],
        ["Multivariate_Modeling", "Métodos de Modelagem Multivariada"],
        ["Computational_Methods_in_Statistics", "Métodos Computacionais em Estatística"],
        ["Stochastic_Processes", "Processos Estocásticos"],
        ["Game_Theory_and_Conflict_Analysis", "Teoria dos Jogos e Análise de Conflitos"],
        ["Mathematical_Methods_in_Physics", "Métodos Matemáticos em Física"],
        ["Special_Topics_in_Statistical_and_Mathematical_Modeling", "Tópicos Especiais de Modelagem Estatística e Matemática"],
        ["Computational_Intelligence", "Inteligência Computacional"],
        ["Metaheuristics", "Metaheurísticas"],
        ["Integer_Optimization", "Otimização Inteira"],
        ["Combinatorial_Optimization_and_Graphs", "Otimização Combinatória e em Grafos"],
        ["Nonlinear_Optimization", "Otimização Não Linear"],
    ],
};

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

    // Target the .card-body within coursesContainer
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
    });
}

function initializeBonusCourses1() {
    const containerId = "bonusCourses1";
    const bonusCoursesContainer = document.getElementById(containerId).querySelector(".card-body");
    const numberOfBonusCourses = 5;

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        appendHTML(bonusCoursesContainer, createCourseContainer(containerId, i, false));
    }

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        const bonusSelect = document.getElementById(`${containerId}-${i}`);
        populateSelect(bonusSelect, ["Matemática", "Estatística", "Computação"], true);
    }
}

function initializeBonusCourses2() {
    const containerId = "bonusCourses2";
    const bonusCoursesContainer = document.getElementById(containerId).querySelector(".card-body");
    const numberOfBonusCourses = 4;

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        appendHTML(bonusCoursesContainer, createCourseContainer(containerId, i, false));
    }

    for (let i = 1; i <= numberOfBonusCourses; i++) {
        const bonusSelect = document.getElementById(`${containerId}-${i}`);
        populateSelect(bonusSelect, ["PPGMMQ"], true);
    }
}

export function initializeCourseSelection() {
    initializeCoursesContainer();
    initializeBonusCourses1();
    initializeBonusCourses2();
}