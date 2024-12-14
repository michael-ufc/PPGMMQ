// js/includes.js
export async function loadIncludes() {
    // Load header and footer if necessary
    await loadHTML('includes/footer.html', 'footer-placeholder');

    // Define the sections including the instructions
    const sections = [{
            file: 'section1.html',
            containerId: 'section1-content'
        },
        {
            file: 'section2.html',
            containerId: 'section2-content'
        },
        {
            file: 'section3.html',
            containerId: 'section3-content'
        },
        {
            file: 'section4.html',
            containerId: 'section4-content'
        },
        {
            file: 'section5.html',
            containerId: 'section5-content'
        },
        {
            file: 'section6.html',
            containerId: 'section6-content'
        }
    ];

    // Load each section into its respective container
    for (const section of sections) {
        await loadHTML(`includes/${section.file}`, section.containerId);
    }
}

async function loadHTML(url, elementId) {
    try {
        console.log(`Loading ${url} into element #${elementId}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading content from ${url} into element #${elementId}:`, error);
        document.getElementById(elementId).innerHTML = `<p class="text-danger">Erro ao carregar o conteúdo.</p>`;
    }
}