// script.js

document.addEventListener("DOMContentLoaded", () => {

    // Initialize ScrollSpy for the sidebar navigation
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: "#sidebar",
        offset: 100,
    });

    // Update progress bar based on scroll position
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
    updateProgressBar(); // Initialize on page load

    // Initialize Popovers
    var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Function to map course options to their categories
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

    // Function to create course container
    function createCourseContainer(courseNumber) {
        return `
    <div id="course-container-${courseNumber}" class="mb-3 mx-3">
        <label for="course${courseNumber}" class="form-label">
            <strong>Disciplina ${courseNumber}</strong> 
            <span class="text-danger">*</span>
        </label>
        <select class="form-select disciplina-select my-1" id="course${courseNumber}" name="course${courseNumber}" required disabled>
        </select>
        <div class="invalid-feedback">Por favor, selecione uma disciplina.</div>
        
        <div class="mb-3">
            <label for="course${courseNumber}Name" class="form-label">
                Disciplinas Equivalentes
            </label>
            <textarea class="form-control" id="course${courseNumber}Name" name="course${courseNumber}Name" disabled></textarea>
            <div class="invalid-feedback">Por favor, insira o nome da disciplina.</div>
        </div>
        
        <div class="mb-3">
            <label for="course${courseNumber}Syllabi" class="form-label">
                Ementas das Disciplinas Equivalentes
            </label>
            <input type="file" class="form-control" id="course${courseNumber}Syllabi" name="course${courseNumber}Syllabi[]" multiple disabled>
            <div class="invalid-feedback">Por favor, envie a(s) ementa(s) da disciplina que você cursou.</div>
        </div>
    </div>
    `;
    }

    // Function to populate a select element with options based on categories
    function populateSelect(selectElement, categories, includeOptGroups = false) {
        if (includeOptGroups && categories.length > 1) {
            categories.forEach(category => {
                selectElement.insertAdjacentHTML("beforeend", `<optgroup label="${category}">`);
                courseCategories[category].forEach(course => {
                    selectElement.insertAdjacentHTML("beforeend", `<option value="${course[0]}">${course[1]}</option>`);
                });
                selectElement.insertAdjacentHTML("beforeend", `</optgroup>`);
            });
        } else {
            const singleCategory = categories[0];
            // Add a default disabled selected option
            selectElement.insertAdjacentHTML("beforeend", `<option value="" disabled selected>Selecione uma disciplina de ${singleCategory}</option>`);
            courseCategories[singleCategory].forEach(course => {
                selectElement.insertAdjacentHTML("beforeend", `<option value="${course[0]}">${course[1]}</option>`);
            });
        }
    }

    // Function to enable select, textarea, and file input elements
    function enableCourseElements(courseNumber) {
        const courseSelect = document.getElementById(`course${courseNumber}`);
        const courseName = document.getElementById(`course${courseNumber}Name`);
        const courseSyllabi = document.getElementById(`course${courseNumber}Syllabi`);

        courseSelect.disabled = false;
        courseName.disabled = false;
        courseSyllabi.disabled = false;

        return {
            courseSelect,
            courseName,
            courseSyllabi
        };
    }

    // Configuration for each course
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

    // Insert course containers
    const coursesContainer = document.getElementById("courses");
    courseConfigs.forEach(config => {
        coursesContainer.insertAdjacentHTML("beforeend", createCourseContainer(config.number));
    });

    // Populate select elements based on configuration
    courseConfigs.forEach(config => {
        const {
            number,
            categories,
            includeOptGroups = false
        } = config;
        const {
            courseSelect
        } = enableCourseElements(number);

        if (includeOptGroups) {
            // Add a default disabled selected option
            courseSelect.insertAdjacentHTML("beforeend", `<option value="" disabled selected>Selecione uma disciplina de Matemática, Estatística ou Computação</option>`);
            populateSelect(courseSelect, categories, true);
        } else {
            populateSelect(courseSelect, categories);
        }
    });

    // Function to update options for course2 dynamically
    function updateCourse2Options() {
        const course1Select = document.getElementById("course1");
        const course2Select = document.getElementById("course2");

        const selectedValue = course1Select.value;

        // Clear previous options
        course2Select.innerHTML = "";

        // Add default option
        course2Select.insertAdjacentHTML(
            "beforeend",
            `<option value="" disabled selected>Selecione uma disciplina de Matemática</option>`
        );

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

    // Add event listener to course1
    document.getElementById("course1").addEventListener("change", updateCourse2Options);

    // Initialize options for course2 on page load
    updateCourse2Options();


    // Function to update options for course5 dynamically
    function updateCourse5Options() {
        const course5Select = document.getElementById("course5");
        const selectedValues = new Set();

        // Collect selected values from other course selects
        courseConfigs.forEach(config => {
            if (config.number !== 5) {
                const courseSelect = document.getElementById(`course${config.number}`);
                if (courseSelect && courseSelect.value) {
                    selectedValues.add(courseSelect.value);
                }
            }
        });

        // Clear previous options
        course5Select.innerHTML = "";

        // Add default option
        course5Select.insertAdjacentHTML(
            "beforeend",
            `<option value="" disabled selected>Selecione uma disciplina de Matemática, Estatística ou Computação</option>`
        );

        // Add only non-selected options
        courseConfigs
            .find(config => config.number === 5)
            .categories.forEach(category => {
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

    // Add event listeners to other course selects
    courseConfigs.forEach(config => {
        if (config.number !== 5) {
            const courseSelect = document.getElementById(`course${config.number}`);
            if (courseSelect) {
                courseSelect.addEventListener("change", updateCourse5Options);
            }
        }
    });

    // Initialize options for course5
    updateCourse5Options();


});