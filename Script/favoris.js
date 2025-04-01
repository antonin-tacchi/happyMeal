// Fonction pour basculer le statut de favori d'une recette
function toggleFavorite(recetteNom) {
    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    
    const index = favoris.indexOf(recetteNom);
    
    if (index > -1) {
        favoris.splice(index, 1);
    } else {
        favoris.push(recetteNom);
    }
    
    // Sauvegarder les favoris mis à jour dans le localStorage
    localStorage.setItem('favoris', JSON.stringify(favoris));
    
    // Mettre à jour l'interface utilisateur
    updateFavoritesUI();
}

function updateFavoritesUI() {
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    
    const recetteElements = document.querySelectorAll('#divPlat');
    
    recetteElements.forEach(element => {
        const recetteData = JSON.parse(element.dataset.recette);
        const recetteNom = recetteData.nom;
        
        let starContainer = element.querySelector('.star-favoris');
        if (!starContainer) {
            starContainer = document.createElement('div');
            starContainer.classList.add('star-favoris');
            element.appendChild(starContainer);
        }
        
        starContainer.innerHTML = favoris.includes(recetteNom) 
            ? `
                <svg width="30" height="30" viewBox="0 0 24 24" fill="gold" stroke="gold" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            `
            : `
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            `;
        
        // Ajouter un écouteur d'événement pour basculer les favoris
        starContainer.onclick = (event) => {
            event.stopPropagation(); // Empêcher la propagation au div parent
            toggleFavorite(recetteNom);
        };
    });
}

// Initialiser l'affichage des favoris lors du chargement de la page
document.addEventListener('DOMContentLoaded', updateFavoritesUI);