// Mostrar splash screen al cargar
window.addEventListener('load', function() {
    // Ocultar splash después de 2 segundos
    setTimeout(function() {
        const splash = document.getElementById('splashScreen');
        const mainContent = document.getElementById('mainContent');
        
        splash.classList.add('fade-out');
        mainContent.style.display = 'block';
        
        // Eliminar completamente el splash después de la animación
        setTimeout(() => splash.remove(), 500);
    }, 2000);
});
