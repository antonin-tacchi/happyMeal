document.addEventListener('DOMContentLoaded', () => {
    const sectionPlat = document.querySelector('.section-plat');
    const pop_up = document.querySelector('.popup-content');

    if (!sectionPlat) {
        console.error('Section non trouvée. Vérifiez votre sélecteur.');
        return;
    }

    fetch('../data/data.json')
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Erreur HTTP ! statut : ${reponse.status}');
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
                const titreRecette = document.createElement('h2');
                const divPlat = document.createElement('div');
                const categoriePlat = document.createElement('p');
                categoriePlat.id = "categoriePlat";
                divPlat.id = "divPlat";
                titreRecette.id = "titreRecette";
                titreRecette.textContent = recette.nom;
                sectionPlat.appendChild(divPlat);
                divPlat.appendChild(titreRecette);
                pop_up.appendChild(categoriePlat);
            });
        })
        .catch(erreur => {
            console.error('Erreur détaillée de chargement des recettes :', erreur);
        });
});