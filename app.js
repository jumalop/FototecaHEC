// ►►► FUNCIONES DE NAVEGACIÓN ◄◄◄
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// ►►► GUARDAR CASO ◄◄◄
async function saveCase() {
    const imageFile = document.getElementById('image').files[0];
    
    if (!imageFile) {
        alert('⚠️ ¡Debe subir una imagen del frotis!');
        return;
    }

    try {
        const caseData = {
            id: Date.now(),
            patientName: document.getElementById('patientName').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            diagnosis: document.getElementById('diagnosis').value,
            image: await readFileAsBase64(imageFile),
            date: new Date().toISOString()
        };

        const transaction = db.transaction('cases', 'readwrite');
        const store = transaction.objectStore('cases');
        store.add(caseData);

        alert('✅ Caso guardado exitosamente!');
        updateGallery();

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al guardar el caso');
    }
}

function readFileAsBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// ►►► ACTUALIZAR GALERÍA ◄◄◄
async function updateGallery() {
    const transaction = db.transaction('cases', 'readonly');
    const store = transaction.objectStore('cases');
    const request = store.getAll();

    request.onsuccess = () => {
        const grid = document.getElementById('casesGrid');
        grid.innerHTML = '';

        request.result.forEach(caso => {
            grid.innerHTML += `
                <div class="case-card">
                    <h3>${caso.patientName}</h3>
                    <p>Edad: ${caso.age} | ${caso.gender}</p>
                    <p>Diagnóstico: ${caso.diagnosis}</p>
                    <img src="${caso.image}" alt="Frotis">
                </div>
            `;
        });
    };
}

// ►►► INICIALIZACIÓN ◄◄◄
window.addEventListener('load', async () => {
    await initDB();
    updateGallery();
    showSection('new-case');
    
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('SW registrado'))
            .catch(console.error);
    }
});
