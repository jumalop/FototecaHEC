const CLIENT_ID = 'TU_CLIENT_ID_GOOGLE';
const API_KEY = 'TU_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

let googleAuth;

const initDrive = () => {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: 'https://www.googleapis.com/auth/drive.file'
        }).then(() => {
            googleAuth = gapi.auth2.getAuthInstance();
        });
    });
};

const backupToDrive = async (caseData) => {
    if (!googleAuth.isSignedIn.get()) {
        await googleAuth.signIn();
    }

    // Convertir imagen a Base64
    const reader = new FileReader();
    reader.readAsDataURL(caseData.image);
    
    reader.onload = () => {
        const fileContent = JSON.stringify({
            ...caseData,
            image: reader.result
        });

        const file = new Blob([fileContent], { type: 'application/json' });
        const metadata = {
            name: `Caso_${caseData.id}.json`,
            mimeType: 'application/json'
        };

        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', file); // CORREGIDO: Se cerró el paréntesis faltante

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
            }),
            body: formData
        });
    };
};

// Inicializar al cargar
window.addEventListener('load', initDrive);
