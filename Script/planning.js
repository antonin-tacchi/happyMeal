document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat-planning');

    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    // Détection du type d'appareil
    const isMobile = window.innerWidth < 1024;
    
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

    moments.forEach(moment => {
        const th = document.createElement('th');
        th.textContent = moment;
        th.style.border = "2px solid black";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    joursSemaine.forEach(jour => {
        const row = document.createElement('tr');

        const labelTd = document.createElement('td');
        labelTd.textContent = jour;
        row.appendChild(labelTd);

        moments.forEach(moment => {
            const td = document.createElement('td');
            td.classList.add('dropzone');
            td.dataset.jour = jour;
            td.dataset.moment = moment;
            
            // Pour mobile : ajouter un sélecteur
            if (isMobile) {
                td.addEventListener('click', () => {
                    selecteurRecetteMobile(jour, moment);
                });
            }
            
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.body.appendChild(table); 

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

    const boutonSauvegarder = document.createElement('button');
    boutonSauvegarder.textContent = 'Sauvegarder le planning';
    boutonSauvegarder.id = 'sauvegarderPlanning';
    boutonSauvegarder.classList.add('bouton-sauvegarder');
    document.body.appendChild(boutonSauvegarder);

    function selecteurRecetteMobile(jour, moment) {
        if (!isMobile) return;

        const cellule = document.querySelector(`.dropzone[data-jour="${jour}"][data-moment="${moment}"]`);
        
        const modal = document.createElement('div');
        modal.classList.add('modal-selecteur-mobile');
        
        const modalContent = document.createElement('div');
        modalContent.classList.add("modal-content")
        
        const titre = document.createElement('h3');
        titre.textContent = `Choisir un plat pour ${jour} ${moment}`;
        
        const fermer = document.createElement('button');
        fermer.textContent = 'Fermer';
        fermer.style.marginBottom = '20px';
        fermer.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const listeRecettes = document.createElement('div');
        
        const optionVide = document.createElement('div');
        optionVide.classList.add('option-recette-mobile');
        optionVide.textContent = '-- Vider la cellule --';
        
        optionVide.addEventListener('click', () => {
            while (cellule.firstChild) {
                conteneurInitial.appendChild(cellule.firstChild);
            }
            document.body.removeChild(modal);
        });
        
        listeRecettes.appendChild(optionVide);

        favoris.forEach((recette, index) => {
            const option = document.createElement('div');
            option.classList.add('option-recette-mobile');
            option.textContent = recette;
            option.dataset.recetteId = index;
            
            option.addEventListener('click', () => {
                while (cellule.firstChild) {
                    conteneurInitial.appendChild(cellule.firstChild);
                }

                const recetteElement = document.querySelector(`.divNomRecette[data-recette-id="${index}"]`);
                if (recetteElement) {
                    cellule.appendChild(recetteElement);
                }
                
                document.body.removeChild(modal);
            });
            
            listeRecettes.appendChild(option);
        });
        
        modalContent.appendChild(titre);
        modalContent.appendChild(listeRecettes);
        modalContent.appendChild(fermer);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }

    // Restaurer le planning sauvegardé
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
        
        document.querySelectorAll('.dropzone').forEach(cellule => {
            const jour = cellule.dataset.jour;
            const moment = cellule.dataset.moment;
            const recetteElement = cellule.querySelector('.divNomRecette');

            const position = `${jour}-${moment}`;
            
            if (recetteElement) {
                planning[position] = recetteElement.dataset.recetteId;
            } else {
                planning[position] = null;
            }
        });
        
        localStorage.setItem('planning', JSON.stringify(planning));
        console.log('Planning sauvegardé:', planning);
        
        alert('Planning sauvegardé avec succès!');
    }

    boutonSauvegarder.addEventListener('click', sauvegarderPlanning);

    if (!isMobile) {
        $(function() {
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
                        
                        if (dropzone.find('.divNomRecette').length > 0) {
                            // Annuler le drop
                            return false;
                        }
                        
                        const draggable = ui.draggable;
                        const origin = draggable.data("origine");
                        
                        dropzone.append(draggable);
                        
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
                    
                    $(this).append(draggable);
                    
                    draggable.css({
                        top: '0',
                        left: '0',
                        position: 'relative'
                    });
                }
            });
        });
    }
    
    window.addEventListener('resize', function() {
        const wasMobile = isMobile;
        const newIsMobile = window.innerWidth < 1024;
        
        if (wasMobile !== newIsMobile) {
            location.reload();
        }
    });
});