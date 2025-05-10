async function saveCase() {
    const imageFile = document.getElementById('image').files[0];
    
    const caseData = {
        patientName: document.getElementById('patientName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        diagnosis: document.getElementById('diagnosis').value,
        image: imageFile
    };

    await saveCaseToDB(caseData);
    await updateGallery();
}

async function saveCaseToDB(caseData) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
            caseData.image = reader.result;
            await saveCase(caseData);
            resolve();
        };
        reader.readAsDataURL(caseData.image);
    });
}

async function updateGallery() {
    const cases = await loadCases();
    const grid = document.getElementById('casesGrid');
    grid.innerHTML = '';

    cases.forEach(caso => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <h3>${caso.patientName}</h3>
            <p>Diagnóstico: ${caso.diagnosis}</p>
            <img src="${caso.image}" style="max-width: 200px;">
        `;
        grid.appendChild(card);
    });
}

// Mostrar casos al cargar
window.addEventListener('load', updateGallery);
