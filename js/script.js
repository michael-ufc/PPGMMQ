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

    // Populate Section 3: Selection of Courses
    const coursesContainer = document.getElementById("courses");

    function createCourseContainer(courseNumber) {
        return `
            <div id="course-container-${courseNumber}" class="mb-3 mx-3">
                <label for="course${courseNumber}" class="form-label">
                    <strong>Disciplina ${courseNumber}</strong> 
                    <span class="text-danger">*</span>
                </label>
                <select class="form-select disciplina-select" id="course${courseNumber}" name="course${courseNumber}" required>
                    <option value="" disabled selected>Selecione a Disciplina</option>
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
                <div class="invalid-feedback">Por favor, selecione uma disciplina.</div>

                <div class="mb-3">
                    <label for="course${courseNumber}Name" class="form-label">
                        Disciplinas Equivalentes
                        <span class="text-danger">*</span>
                    </label>
                    <textarea class="form-control" id="course${courseNumber}Name" name="course${courseNumber}Name" required></textarea>
                    <div class="invalid-feedback">Por favor, insira o nome da disciplina.</div>
                </div>

                <div class="mb-3">
                    <label for="course${courseNumber}Syllabi" class="form-label">
                        Ementas das Disciplinas Equivalentes <span class="text-danger">*</span>
                    </label>
                    <input type="file" class="form-control" id="course${courseNumber}Syllabi" name="course${courseNumber}Syllabi[]" multiple required>
                    <div class="invalid-feedback">Por favor, envie a(s) ementa(s) da disciplina que você cursou.</div>
                </div>
            </div>
        `;
    }

    function addCourses(numCourses) {
        for (let i = 1; i <= numCourses; i++) {
            coursesContainer.insertAdjacentHTML("beforeend", createCourseContainer(i));
        }
    }

    addCourses(5); // Add 5 courses by default
});