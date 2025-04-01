document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat');
    
    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }
    
    // Récupérer les favoris du localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    
    fetch('../data/data.json')
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
            }
            return reponse.json();
        })
        .then(donnees => {
            const melangerTableau = (tableau) => {
                for (let i = tableau.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
                }
                return tableau;
            };

            const recettesMelangees = melangerTableau([...donnees.recettes]);
            const recettesSelectionnees = recettesMelangees.slice(0, 3);
            
            sectionPlat.innerHTML = '';
            
            recettesSelectionnees.forEach(recette => {
                const divPlat = document.createElement('div');
                divPlat.id = "divPlat";

                const containerTitreStar = document.createElement('div');
                containerTitreStar.classList.add('container-titre-star');
                containerTitreStar.id = "containerTitreStar";

                const imageRecette = document.createElement('img');
                imageRecette.src = recette.image;
                imageRecette.alt = recette.nom;
                imageRecette.classList.add('image-recette');
                imageRecette.id = "imageRecette";
                
                const titreRecette = document.createElement('h2');
                titreRecette.id = "titreRecette";
                titreRecette.textContent = recette.nom;
                
                // Créer le conteneur de l'étoile
                const starContainer = document.createElement('div');
                starContainer.classList.add('star-favoris');
                starContainer.innerHTML = favoris.includes(recette.nom) 
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
                    toggleFavorite(recette.nom);
                };
                
                divPlat.dataset.recette = JSON.stringify(recette);
                
                divPlat.appendChild(starContainer);
                divPlat.appendChild(imageRecette);
                divPlat.appendChild(titreRecette);
                
                sectionPlat.appendChild(divPlat);
            });
        })
        .catch(erreur => {
            console.error('Erreur détaillée de chargement des recettes :', erreur);
        });
});