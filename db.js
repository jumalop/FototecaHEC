let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
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
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const saveCaseToDB = async (caseData) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada.');
            return;
        }

        const transaction = db.transaction('cases', 'readwrite');
        const store = transaction.objectStore('cases');
        
        caseData.date = new Date().toISOString();
        caseData.id = Date.now();

        const request = store.add(caseData);
        
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

const loadCasesFromDB = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada.');
            return;
        }

        const transaction = db.transaction('cases', 'readonly');
        const store = transaction.objectStore('cases');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

// Inicializar al cargar la página
window.addEventListener('load', initDB);
