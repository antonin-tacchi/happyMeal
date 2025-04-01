document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const sectionPlat = document.querySelector('.section-plat');

    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.classList.add('popup');

    const popupContent = document.createElement('div');
    popupContent.id = 'popup-content';
    popupContent.classList.add('popup-content');

    const closeBtn = document.createElement('span');
    closeBtn.id = 'closeBtn';
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';

    const recetteTitle = document.createElement('h2');
    recetteTitle.id = 'recette-title';
    recetteTitle.classList.add('recette-title');
    recetteTitle.textContent = '';

    const recetteDetails = document.createElement('div');
    recetteDetails.id = 'recette-details';
    recetteDetails.classList.add('recette-details');

    popupContent.appendChild(closeBtn);
    popupContent.appendChild(recetteTitle);
    popupContent.appendChild(recetteDetails);
    popup.appendChild(popupContent);
    main.appendChild(popup);

    // New function to handle displaying popup
    function afficherPopup(recetteData) {
        const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        const isCurrentlyFavorite = favoris.includes(recetteData.nom);
        
        recetteDetails.innerHTML = `
            <div class="header-pop_up">
                <h2 class="recipe-name">${recetteData.nom}</h2>
                <p>${recetteData.temps_preparation}</p>
            </div>   
            
            <p class="categorie_plat"><strong>Catégorie:</strong> ${recetteData.categorie}</p>

            <div class="recette_section">
                <div class="prepa-section">
                    <h3>Étapes de préparation:</h3>
                    <ol>
                        ${recetteData.etapes.map(etape => `<li>${etape}</li>`).join('')}
                    </ol>
                </div>
                <div class="igredients-section">
                    <h3>Ingrédients:</h3>
                    <ul>
                        ${recetteData.ingredients.map(ingredient => 
                            `<li>${ingredient.nom}: ${ingredient.quantite} ${ingredient.unite || ''}</li></li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="etoile_favoris">
                    <div id="star-toggle" class="star-container" data-recette-nom="${recetteData.nom}">
                        <svg id="star-empty" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: ${isCurrentlyFavorite ? 'none' : 'block'};">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <svg id="star-filled" width="30" height="30" viewBox="0 0 24 24" fill="gold" stroke="gold" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: ${isCurrentlyFavorite ? 'block' : 'none'};">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;
        
        popup.style.display = 'block';
        
        const starContainer = document.getElementById('star-toggle');
        const starEmpty = document.getElementById('star-empty');
        const starFilled = document.getElementById('star-filled');
        
        // Remove previous event listeners to prevent multiple bindings
        const oldStarContainer = document.getElementById('star-toggle');
        const newStarContainer = oldStarContainer.cloneNode(true);
        oldStarContainer.parentNode.replaceChild(newStarContainer, oldStarContainer);
        
        newStarContainer.addEventListener('click', () => {
            const recetteNom = newStarContainer.dataset.recetteNom;
            
            toggleFavorite(recetteNom);
            
            const starEmpty = newStarContainer.querySelector('#star-empty');
            const starFilled = newStarContainer.querySelector('#star-filled');
            
            if (starEmpty.style.display === 'block') {
                starEmpty.style.display = 'none';
                starFilled.style.display = 'block';
            } else {
                starEmpty.style.display = 'block';
                starFilled.style.display = 'none';
            }
        });
    }

    // Existing functions remain the same
    function toggleFavorite(recetteNom) {
        let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        
        const index = favoris.indexOf(recetteNom);
        
        if (index > -1) {
            // Retire des favoris si déjà présente
            favoris.splice(index, 1);
        } else {
            // Ajoute aux favoris
            favoris.push(recetteNom);
        }
        
        localStorage.setItem('favoris', JSON.stringify(favoris));
        
        // Mettre à jour l'UI des favoris sur la page courante
        updateFavoriteUI();
    }

    function updateFavoriteUI() {
        const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        
        const recetteElements = document.querySelectorAll('#divPlat');
        
        recetteElements.forEach(element => {
            const recetteData = JSON.parse(element.dataset.recette);
            const recetteId = recetteData.nom;
            
            let starContainer = element.querySelector('.star-favoris');
            if (!starContainer) {
                starContainer = document.createElement('div');
                starContainer.classList.add('star-favoris');
                element.appendChild(starContainer);
            }
            
            starContainer.innerHTML = favoris.includes(recetteId) 
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
        });
    }

    sectionPlat.addEventListener('click', (event) => {
        const divPlat = event.target.closest('#divPlat');
        
        if (divPlat) {
            const recetteData = JSON.parse(divPlat.dataset.recette);
            afficherPopup(recetteData);
        }
    });

    document.addEventListener('recetteSelectionnee', (event) => {
        const recette = event.detail;
        afficherPopup(recette);
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});