function fetchAndRenderTex(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            MathJax.typesetPromise();
        })
        .catch(error => console.error('Error fetching the .tex file:', error));
}

function showSection(sectionId) {
    const sections = ['about', 'portfolio', 'contact'];
    const card = document.getElementById('content-card');
    const nav = document.getElementById('nav');
    card.classList.add('hidden');
    setTimeout(() => {
        sections.forEach(section => {
            document.getElementById(section).style.display = section === sectionId ? 'block' : 'none';
        });
        if (sectionId === 'portfolio') {
            document.querySelectorAll('.project').forEach(project => {
                project.style.display = 'none';
            });
            document.getElementById('project-list').style.display = 'block';
            document.getElementById('portfolio-title').style.display = 'block';
            document.getElementById('portfolio-text').style.display = 'block';
        }
        nav.classList.remove('hidden');
        card.classList.remove('hidden');
    }, 500);
}

function showProject(projectId) {
    const card = document.getElementById('content-card');
    const backArrow = document.querySelector(`#${projectId} .back-arrow`);
    backArrow.classList.add('hidden');
    document.getElementById('project-list').style.display = 'none';
    document.getElementById('portfolio-title').style.display = 'none';
    document.getElementById('portfolio-text').style.display = 'none';
    document.getElementById('nav').classList.add('hidden');
    const project = document.getElementById(projectId);
    project.classList.add('hidden');
    project.style.display = 'block';

    // Fetch and render the LaTeX content
    if (projectId === 'project1') {
        fetchAndRenderTex('Projects/Project%201%20-%20Merlon-Crenel%20Problem/solution.tex', 'solution');
        fetchAndRenderTex('Projects/Project%201%20-%20Merlon-Crenel%20Problem/example.tex', 'example');
    }

    setTimeout(() => {
        card.classList.add('hidden');
        setTimeout(() => {
            card.classList.remove('hidden');
            project.classList.remove('hidden');
            backArrow.classList.remove('hidden');
            backArrow.classList.add('visible');
        }, 50);
    }, 500);
}

function hideProject(projectId) {
    const card = document.getElementById('content-card');
    const project = document.getElementById(projectId);
    const backArrow = document.querySelector(`#${projectId} .back-arrow`);
    backArrow.classList.remove('visible');
    backArrow.classList.add('hidden');
    project.classList.add('hidden');
    setTimeout(() => {
        project.style.display = 'none';
        document.getElementById('project-list').style.display = 'block';
        document.getElementById('portfolio-title').style.display = 'block';
        document.getElementById('portfolio-text').style.display = 'block';
        document.getElementById('nav').classList.remove('hidden');
        card.classList.add('hidden');
        setTimeout(() => {
            card.classList.remove('hidden');
        }, 50);
    }, 500);
}

function showTimelineDetail(detailId) {
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    const detailCard = document.getElementById(`timeline-detail-card-${detailId}`);
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.style.opacity = 1;
        detailCard.style.display = 'block';
        setTimeout(() => {
            detailCard.classList.remove('hidden');
            detailCard.classList.add('visible');
        }, 10); 
    }, 10); 
}

function hideTimelineDetail(detailId) {
    overlay.classList.remove('visible');
    overlay.classList.add('hidden');
    const overlay = document.getElementById('overlay');
    const detailCard = document.getElementById(`timeline-detail-card-${detailId}`);
    detailCard.classList.remove('visible');
    detailCard.classList.add('hidden');
    setTimeout(() => {
        overlay.style.display = 'none';
        detailCard.style.display = 'none';
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(card => card.classList.add('hidden'));
});

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([42.39181002084234, -72.52858873870092], 8); // Centered on UMass Amherst

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([42.39181002084234, -72.52858873870092]).addTo(map)
        .bindPopup('University of Massachusetts Amherst')
});

function downloadResume() {
    window.open('path/to/your/resume.pdf', '_blank'); // Put resume here once made
}

