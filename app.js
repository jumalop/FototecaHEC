function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
let db;

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
}

async function saveCase() {
    const imageFile = document.getElementById('image').files[0];
    
    if (!imageFile) {
        alert('¡Debe subir una imagen del frotis!');
        return;
    }

    const caseData = {
        patientName: document.getElementById('patientName').value.trim(),
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        osepNumber: document.getElementById('osep').value.trim(),
        diagnosis: document.getElementById('diagnosis').value.trim(),
        image: await convertImageToBase64(imageFile),
        date: new Date().toISOString(),
        caseId: crypto.randomUUID()
    };

    try {
        const transaction = db.transaction('cases', 'readwrite');
        const store = transaction.objectStore('cases');
        await store.add(caseData);
        
        alert('¡Caso guardado correctamente!');
        updateGallery();
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el caso');
    }
}

function convertImageToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

async function updateGallery() {
    const transaction = db.transaction('cases', 'readonly');
    const store = transaction.objectStore('cases');
    const request = store.getAll();

    request.onsuccess = () => {
        const cases = request.result;
        const grid = document.getElementById('casesGrid');
        grid.innerHTML = '';

        cases.forEach(caso => {
            const card = document.createElement('div');
            card.className = 'case-card';
            card.innerHTML = `
                <h3>${caso.patientName}</h3>
                <p><strong>Edad:</strong> ${caso.age} | <strong>Género:</strong> ${caso.gender}</p>
                <p><strong>Diagnóstico:</strong> ${caso.diagnosis}</p>
                <img src="${caso.image}" alt="Frotis hematológico">
                <p><small>ID: ${caso.caseId}</small></p>
            `;
            grid.appendChild(card);
        });
    };
}

// Inicialización
window.addEventListener('load', () => {
    const request = indexedDB.open('HematologyDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const store = db.createObjectStore('cases', {
            keyPath: 'caseId'
        });
        
        store.createIndex('diagnosis', 'diagnosis');
        store.createIndex('date', 'date');
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        updateGallery();
    };

    showSection('new-case');
});
