document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat-planning');

    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    // Récupérer les favoris du localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    console.log('Favoris récupérés:', favoris);
    
    // Récupérer le planning sauvegardé s'il existe
    const planningEnregistre = JSON.parse(localStorage.getItem('planning')) || {};
    console.log('Planning récupéré:', planningEnregistre);

    const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const moments = ["Midi", "Soir"];

    const conteneurInitial = document.createElement('div');
    conteneurInitial.id = "conteneurInitial";
    conteneurInitial.classList.add('conteneurInitial');
    document.body.appendChild(conteneurInitial);

    const table = document.createElement('table');
    table.id = "planningTable";
    table.classList.add('planningTable');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);

    // Ajouter Midi et Soir comme en-têtes de colonnes
    moments.forEach(moment => {
        const th = document.createElement('th');
        th.textContent = moment;
        th.style.border = "2px solid black";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Créer une ligne pour chaque jour de la semaine
    joursSemaine.forEach(jour => {
        const row = document.createElement('tr');

        const labelTd = document.createElement('td');
        labelTd.textContent = jour;
        row.appendChild(labelTd);

        // Créer une cellule pour chaque moment (Midi, Soir)
        moments.forEach(moment => {
            const td = document.createElement('td');
            td.classList.add('dropzone');
            td.dataset.jour = jour;
            td.dataset.moment = moment;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.body.appendChild(table); 

    // Créer les éléments pour les recettes favorites
    favoris.forEach((recette, index) => {
        const divPlat = document.createElement('div');
        divPlat.classList.add('divNomRecette');
        divPlat.setAttribute('id', 'recette-' + index); 
        divPlat.dataset.recetteId = index;
        divPlat.dataset.nom = recette;

        const titreRecette = document.createElement('h2');
        titreRecette.classList.add('titreRecettePlanning');
        titreRecette.textContent = recette || 'Nom non disponible';

        divPlat.appendChild(titreRecette);
        conteneurInitial.appendChild(divPlat);
    });

    // Ajouter un bouton pour sauvegarder le planning
    const boutonSauvegarder = document.createElement('button');
    boutonSauvegarder.textContent = 'Sauvegarder le planning';
    boutonSauvegarder.id = 'sauvegarderPlanning';
    boutonSauvegarder.classList.add('bouton-sauvegarder');
    document.body.appendChild(boutonSauvegarder);

    // Restaurer le planning précédemment sauvegardé
    if (planningEnregistre) {
        Object.keys(planningEnregistre).forEach(position => {
            const [jour, moment] = position.split('-');
            const recetteId = planningEnregistre[position];
            
            if (recetteId !== null) {
                const recetteElement = document.querySelector(`.divNomRecette[data-recette-id="${recetteId}"]`);
                const cellule = document.querySelector(`.dropzone[data-jour="${jour}"][data-moment="${moment}"]`);
                
                if (recetteElement && cellule) {
                    cellule.appendChild(recetteElement);
                }
            }
        });
    }

    // Fonction pour sauvegarder le planning
    function sauvegarderPlanning() {
        const planning = {};
        
        // Parcourir toutes les cellules du planning
        document.querySelectorAll('.dropzone').forEach(cellule => {
            const jour = cellule.dataset.jour;
            const moment = cellule.dataset.moment;
            const recetteElement = cellule.querySelector('.divNomRecette');
            
            // Créer une clé unique pour chaque cellule (ex: "Lundi-Midi")
            const position = `${jour}-${moment}`;
            
            if (recetteElement) {
                planning[position] = recetteElement.dataset.recetteId;
            } else {
                planning[position] = null;
            }
        });
        
        // Sauvegarder dans localStorage
        localStorage.setItem('planning', JSON.stringify(planning));
        console.log('Planning sauvegardé:', planning);
        
        // Afficher un message à l'utilisateur
        alert('Planning sauvegardé avec succès!');
    }

    // Écouter le clic sur le bouton de sauvegarde
    boutonSauvegarder.addEventListener('click', sauvegarderPlanning);

    // Initialiser draggable/droppable avec des paramètres spécifiques pour mobile
    $(function() {
        // Configuration générale pour tous les appareils
        $('.divNomRecette').each(function() {
            $(this).draggable({
                revert: "invalid",
                scroll: true,
                scrollSensitivity: 40,
                scrollSpeed: 40,
                containment: "document",
                cursor: "move",
                opacity: 0.7,
                helper: "original",
                start: function(event, ui) {
                    $(this).data("origine", $(this).parent());
                    $(this).addClass("being-dragged");
                },
                stop: function(event, ui) {
                    $(this).removeClass("being-dragged");
                }
            });
        });

        $('.dropzone').each(function() {
            $(this).droppable({
                accept: ".divNomRecette",
                tolerance: "pointer",
                drop: function(event, ui) {
                    const dropzone = $(this);
                    
                    // Vérifier si la dropzone contient déjà une recette
                    if (dropzone.find('.divNomRecette').length > 0) {
                        // Annuler le drop
                        return false;
                    }
                    
                    const draggable = ui.draggable;
                    const origin = draggable.data("origine");
                    
                    // Déplacer l'élément dans la nouvelle zone
                    dropzone.append(draggable);
                    
                    // Réinitialiser la position
                    draggable.css({
                        top: '0',
                        left: '0',
                        position: 'relative'
                    });
                }
            });
        });
        
        $('#conteneurInitial').droppable({
            accept: ".divNomRecette",
            tolerance: "pointer",
            drop: function(event, ui) {
                const draggable = ui.draggable;
                
                // Déplacer l'élément vers le conteneur initial
                $(this).append(draggable);
                
                // Réinitialiser la position
                draggable.css({
                    top: '0',
                    left: '0',
                    position: 'relative'
                });
            }
        });
    });
});