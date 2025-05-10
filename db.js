let db;

const initDB = () => {
    const request = indexedDB.open('HematologyDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const store = db.createObjectStore('cases', {
            keyPath: 'id',
            autoIncrement: true
        });

        store.createIndex('diagnosis', 'diagnosis', { unique: false });
        store.createIndex('date', 'date', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };
};

const saveCase = async (caseData) => {
    return new Promise((resolve) => {
        const transaction = db.transaction('cases', 'readwrite');
        const store = transaction.objectStore('cases');
        
        caseData.date = new Date().toISOString();
        caseData.id = Date.now();

        const request = store.add(caseData);
        
        request.onsuccess = () => {
            backupToDrive(caseData); // Llamada al backup
            resolve();
        };
    });
};

const loadCases = () => {
    return new Promise((resolve) => {
        const transaction = db.transaction('cases', 'readonly');
        const store = transaction.objectStore('cases');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
    });
};

// Inicializar al cargar la página
window.addEventListener('load', initDB);
