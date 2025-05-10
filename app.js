function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function saveCase() {
    const caseData = {
        patientName: document.getElementById('patientName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        diagnosis: document.getElementById('diagnosis').value,
        image: document.getElementById('image').files[0]
    };

    // Guardar en localStorage (temporal)
    const cases = JSON.parse(localStorage.getItem('cases') || []);
    cases.push(caseData);
    localStorage.setItem('cases', JSON.stringify(cases));
    
    alert('Caso guardado temporalmente. ¡Recarga para ver en la galería!');
}
