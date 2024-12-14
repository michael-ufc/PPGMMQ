export async function loadIncludes() {
    await loadHTML('includes/header.html', 'header-placeholder');
    await loadHTML('includes/footer.html', 'footer-placeholder');

    const sections = [
        'section1.html',
        'section2.html',
        'section3.html',
        'section4.html',
        'section5.html',
        'section6.html'
    ];

    for (let i = 0; i < sections.length; i++) {
        const container = document.createElement('div');
        container.id = `section${i + 1}`;
        document.getElementById('form-sections').appendChild(container);
        await loadHTML(`includes/${sections[i]}`, container.id);
    }
}

async function loadHTML(url, elementId) {
    const response = await fetch(url);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
}