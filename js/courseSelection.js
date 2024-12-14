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
};

export function initializeCourseSelection() {
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

    const coursesContainer = document.getElementById("courses");

    courseConfigs.forEach(config => {
        appendHTML(coursesContainer, createCourseContainer(config.number));
    });

    courseConfigs.forEach(config => {
        const {
            number,
            categories,
            includeOptGroups = false
        } = config;
        const courseSelect = document.getElementById(`course${number}`);
        populateSelect(courseSelect, categories, includeOptGroups);
    });

    // Event listeners for dynamic course selections
    document.getElementById("course1").addEventListener("change", updateCourse2Options);
    courseConfigs.forEach(config => {
        if (config.number !== 5) {
            const select = document.getElementById(`course${config.number}`);
            if (select) {
                select.addEventListener("change", updateCourse5Options);
            }
        }
    });

    // Initial population
    updateCourse2Options();
    updateCourse5Options();
}

function createCourseContainer(courseNumber) {
    return `
        <div id="course-container-${courseNumber}" class="mb-3 mx-3">
            <label for="course${courseNumber}" class="form-label">
                <strong>Disciplina ${courseNumber}</strong> 
                <span class="text-danger">*</span>
            </label>
            <select class="form-select disciplina-select my-1" id="course${courseNumber}" name="course${courseNumber}" required>
            </select>
            <div class="invalid-feedback">Por favor, selecione uma disciplina.</div>
            
            <div class="mb-3">
                <label for="course${courseNumber}Name" class="form-label">
                    Disciplinas equivalentes no seu histórico
                </label>
                <textarea class="form-control" id="course${courseNumber}Name" name="course${courseNumber}Name"></textarea>
                <div class="invalid-feedback">Por favor, insira o nome da disciplina.</div>
            </div>
            
            <div class="mb-3">
                <label for="course${courseNumber}Syllabi" class="form-label">
                    Ementas das disciplinas equivalentes
                </label>
                <input type="file" class="form-control" id="course${courseNumber}Syllabi" name="course${courseNumber}Syllabi[]" multiple>
                <div class="invalid-feedback">Por favor, envie a(s) ementa(s) da disciplina que você cursou.</div>
            </div>
        </div>
    `;
}

function populateSelect(selectElement, categories, includeOptGroups = false) {
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
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = `Selecione uma disciplina de ${singleCategory}`;
        selectElement.appendChild(defaultOption);

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

function updateCourse2Options() {
    const course1Select = document.getElementById("course1");
    const course2Select = document.getElementById("course2");

    const selectedValue = course1Select.value;

    // Clear previous options
    course2Select.innerHTML = "";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Selecione uma disciplina de Matemática";
    course2Select.appendChild(defaultOption);

    // Add only non-selected options
    courseCategories["Matemática"].forEach(([value, label]) => {
        if (value !== selectedValue) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            course2Select.appendChild(option);
        }
    });
}

function updateCourse5Options() {
    const course5Select = document.getElementById("course5");
    const selectedValues = new Set();

    // Collect selected values from other course selects
    ["course1", "course2", "course3", "course4"].forEach(courseId => {
        const select = document.getElementById(courseId);
        if (select && select.value) {
            selectedValues.add(select.value);
        }
    });

    // Clear previous options
    course5Select.innerHTML = "";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Selecione uma disciplina de Matemática, Estatística ou Computação";
    course5Select.appendChild(defaultOption);

    // Add options excluding already selected ones
    ["Matemática", "Estatística", "Computação"].forEach(category => {
        const optGroup = document.createElement("optgroup");
        optGroup.label = category;
        courseCategories[category].forEach(([value, label]) => {
            if (!selectedValues.has(value)) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                optGroup.appendChild(option);
            }
        });
        course5Select.appendChild(optGroup);
    });
}