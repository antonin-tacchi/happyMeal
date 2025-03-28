document.addEventListener('DOMContentLoaded', () => {
    console.log("🟢 pop_up.js chargé !");

    const sectionPlat = document.querySelector('.section-plat');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDescription = document.getElementById('popup-description');
    const popupIngredients = document.getElementById('popup-ingredients');
    const popupSteps = document.getElementById('popup-steps');
    const closeBtn = document.getElementById('closeBtn');

    // ✅ Écoute l'événement de sélection depuis recherche.js
    document.addEventListener('recetteSelectionnee', (event) => {
        const recette = event.detail;
        afficherPopup(recette);
    });

    // ✅ Écoute aussi les clics dans la section des plats existante
    if (sectionPlat) {
        sectionPlat.addEventListener('click', (event) => {
            const divPlat = event.target.closest('#divPlat');

            if (divPlat) {
                popup.style.display = 'block';
            }
        });
    }

    // ✅ Fonction pour afficher la pop-up avec les infos de la recette
    function afficherPopup(recette) {
        console.log("🟢 Ouverture de la pop-up pour :", recette.nom);

        // Mise à jour du titre et de la description
        popupTitle.textContent = recette.nom;
        popupDescription.textContent = recette.description || 'Pas de description disponible';

        // Suppression de l'affichage de l'image (on ne manipule plus le texte ni l'élément image)
        // Il n'y a plus de code relatif à l'image dans cette fonction

        // Affichage des ingrédients
        popupIngredients.innerHTML = '';
        recette.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            popupIngredients.appendChild(li);
        });

        // Affichage des étapes
        popupSteps.innerHTML = '';
        recette.etapes.forEach(etape => {
            const li = document.createElement('li');
            li.textContent = etape;
            popupSteps.appendChild(li);
        });

        // Affichage de la pop-up
        popup.style.display = 'block';
    }

    // ✅ Fermer la pop-up
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
