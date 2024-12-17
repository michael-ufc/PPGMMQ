// js/section1.js

export function initializeSection1() {
    // Return if section1_form not found
    if (!document.getElementById("section1_form"))
        return;

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