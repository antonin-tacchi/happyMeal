document.addEventListener('DOMContentLoaded', () => {
    const sectionFavoris = document.querySelector('#section-favoris');
    const noFavoritesElement = document.getElementById('no-favorites');
    
    // Récupérer les favoris du localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    
    // Vérifier s'il y a des favoris
    if (favoris.length === 0) {
        noFavoritesElement.style.display = 'block';
        return;
    }
    
    fetch('../data/data.json')
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
            }
            return reponse.json();
        })
        .then(donnees => {
            // Filtrer les recettes favorites
            const recettesFavorites = donnees.recettes.filter(recette => 
                favoris.includes(recette.nom)
            );
            
            // Masquer le message "pas de favoris"
            noFavoritesElement.style.display = 'none';
            
            // Afficher les recettes favorites
            recettesFavorites.forEach(recette => {
                const divPlat = document.createElement('div');
                divPlat.id = "divPlat";

                const imageRecette = document.createElement('img');
                imageRecette.src = recette.image;
                imageRecette.alt = recette.nom;
                imageRecette.classList.add('image-recette');
                imageRecette.id = "imageRecette";
                
                const titreRecette = document.createElement('h2');
                titreRecette.id = "titreRecette";
                titreRecette.textContent = recette.nom;
                
                const starContainer = document.createElement('div');
                starContainer.classList.add('star-favoris');
                starContainer.innerHTML = `
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="gold" stroke="gold" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                `;
                
                divPlat.dataset.recette = JSON.stringify(recette);
                
                divPlat.appendChild(starContainer);
                divPlat.appendChild(imageRecette);
                divPlat.appendChild(titreRecette);
                
                sectionFavoris.appendChild(divPlat);
            });
        })
        .catch(erreur => {
            console.error('Erreur de chargement des recettes favorites :', erreur);
            noFavoritesElement.style.display = 'block';
        });
});