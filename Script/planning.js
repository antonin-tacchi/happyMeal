document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat-planning');

    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    // Récupérer les favoris du localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    console.log('Favoris récupérés:', favoris);

    // Créer le tableau des jours de la semaine
    const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    // Conteneur pour les plats non placés
    const conteneurInitial = document.createElement('div');
    conteneurInitial.id = "conteneurInitial";
    conteneurInitial.classList.add('conteneurInitial');
    document.body.appendChild(conteneurInitial);

    const table = document.createElement('table');
    table.id = "planningTable";
    table.classList.add('planningTable');

    // Créer l'en-tête du tableau
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Ajouter une colonne vide pour l'étiquette des jours
    const emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);

    // Ajouter les jours de la semaine
    joursSemaine.forEach(jour => {
        const th = document.createElement('th');
        th.textContent = jour;
        th.style.border = "2px solid black";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Créer le corps du tableau
    const tbody = document.createElement('tbody');

    ["Midi", "Soir"].forEach(moment => {
        const row = document.createElement('tr');

        // Ajoute l'étiquette "Midi" ou "Soir" à gauche
        const labelTd = document.createElement('td');
        labelTd.textContent = moment;
        row.appendChild(labelTd);

        // Crée une cellule de dropzone pour chaque jour
        joursSemaine.forEach(() => {
            const td = document.createElement('td');
            td.classList.add('dropzone');
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.body.appendChild(table); // Ajouter le tableau à la page

    // Ajouter les recettes au conteneur initial
    favoris.forEach((recette, index) => {
        const divPlat = document.createElement('div');
        divPlat.classList.add('divNomRecette');
        divPlat.setAttribute('id', 'recette-' + index); // ID unique

        const titreRecette = document.createElement('h2');
        titreRecette.classList.add('titreRecettePlanning');
        titreRecette.textContent = recette

        divPlat.appendChild(titreRecette);
        conteneurInitial.appendChild(divPlat);
    });

    // Activer le drag & drop avec jQuery UI
    $(function(){
        $('.divNomRecette').draggable({
            revert: "invalid",
            start: function(event, ui) {
                $(this).data("origine", $(this).parent()); // Sauvegarde du conteneur d'origine
            }
        });

        $('.dropzone').droppable({
            accept: ".divNomRecette",
            drop: function(event, ui) {
                $(this).empty(); // Supprime l'ancien contenu
                $(this).append(ui.helper); // Ajoute la recette
                ui.helper.css({top: 0, left: 0}); // Réinitialise la position
            }
        });

        // Permet de remettre un plat à sa place initiale
        $('#conteneurInitial').droppable({
            accept: ".divNomRecette",
            drop: function(event, ui) {
                $(this).append(ui.helper); // Replace dans le conteneur
                ui.helper.css({top: 0, left: 0}); // Réinitialise la position
            }
        });
    });
});
