document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat');
    
    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
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
            sectionPlat.innerHTML = '';
            
            // Créer un conteneur de grille pour les recettes
            const grilleRecettes = document.createElement('div');
            grilleRecettes.classList.add('grille-recettes');
            
            donnees.recettes.forEach(recette => {
                const divPlat = document.createElement('div');
                divPlat.id = "divPlat";
                
                // Créer et ajouter l'image
                const imageRecette = document.createElement('img');
                imageRecette.src = recette.image;
                imageRecette.alt = recette.nom;
                imageRecette.classList.add('image-recette');
                
                // Créer le titre
                const titreRecette = document.createElement('h2');
                titreRecette.id = "titreRecette";
                titreRecette.textContent = recette.nom;
                
                // Store full recipe data as a data attribute
                divPlat.dataset.recette = JSON.stringify(recette);
                
                // Ajouter l'image et le titre à la div
                divPlat.appendChild(imageRecette);
                divPlat.appendChild(titreRecette);
                
                // Ajouter la div à la grille
                grilleRecettes.appendChild(divPlat);
            });
            
            // Ajouter la grille à la section
            sectionPlat.appendChild(grilleRecettes);
        })
        .catch(erreur => {
            console.error('Erreur détaillée de chargement des recettes :', erreur);
        });
});
document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat');
    
    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    // Définir la taille de la page
    const RECETTES_PAR_PAGE = 9;
    let pageActuelle = 1;  // La première page par défaut

    // Fonction pour afficher les recettes
    function afficherRecettes(donnees, page) {
        const grilleRecettes = document.createElement('div');
        grilleRecettes.classList.add('grille-recettes');

        // Calculer les indices de début et de fin des recettes à afficher
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
            
            divPlat.dataset.recette = JSON.stringify(recette);
            divPlat.appendChild(imageRecette);
            divPlat.appendChild(titreRecette);
            
            grilleRecettes.appendChild(divPlat);
        });

        sectionPlat.innerHTML = '';  // Vider la section avant de la remplir
        sectionPlat.appendChild(grilleRecettes);
    }

    // Fonction pour gérer la pagination
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
                ajouterPagination(donnees);
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Suivant';
        nextButton.disabled = pageActuelle === totalPages;
        nextButton.addEventListener('click', () => {
            if (pageActuelle < totalPages) {
                pageActuelle++;
                afficherRecettes(donnees, pageActuelle);
                ajouterPagination(donnees);
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
            afficherRecettes(donnees, pageActuelle); // Afficher les recettes de la première page
            ajouterPagination(donnees); // Ajouter les boutons de pagination
        })
        .catch(erreur => {
            console.error('Erreur détaillée de chargement des recettes :', erreur);
        });
});

