document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat');

    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    // Récupérer les favoris du localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];

    const RECETTES_PAR_PAGE = 9;
    let pageActuelle = 1;

    function afficherRecettes(donnees, page) {
        const grilleRecettes = document.createElement('div');
        grilleRecettes.classList.add('grille-recettes');

        const startIndex = (page - 1) * RECETTES_PAR_PAGE;
        const endIndex = startIndex + RECETTES_PAR_PAGE;
        const recettesPage = donnees.recettes.slice(startIndex, endIndex);

        recettesPage.forEach(recette => {
            const divPlat = document.createElement('div');
            divPlat.id = "divPlat";

            const imageRecette = document.createElement('img');
            imageRecette.src = recette.image;
            imageRecette.alt = recette.nom;
            imageRecette.classList.add('image-recette');

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

            grilleRecettes.appendChild(divPlat);
        });

        sectionPlat.innerHTML = '';
        sectionPlat.appendChild(grilleRecettes);
        ajouterPagination(donnees);
    }

    function ajouterPagination(donnees) {
        const totalPages = Math.ceil(donnees.recettes.length / RECETTES_PAR_PAGE);
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');

        // Créer les boutons Précédent et Suivant
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Précédent';
        prevButton.disabled = pageActuelle === 1;
        prevButton.addEventListener('click', () => {
            if (pageActuelle > 1) {
                pageActuelle--;
                afficherRecettes(donnees, pageActuelle);
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Suivant';
        nextButton.disabled = pageActuelle === totalPages;
        nextButton.addEventListener('click', () => {
            if (pageActuelle < totalPages) {
                pageActuelle++;
                afficherRecettes(donnees, pageActuelle);
            }
        });

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(nextButton);

        sectionPlat.appendChild(paginationContainer);
    }

    fetch('../data/data.json')
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! statut : ${reponse.status}`);
            }
            return reponse.json();
        })
        .then(donnees => {
            afficherRecettes(donnees, pageActuelle);
        })
        .catch(erreur => {
            console.error('Erreur détaillée de chargement des recettes :', erreur);
        });
});
