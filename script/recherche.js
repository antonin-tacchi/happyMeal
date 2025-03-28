document.addEventListener('DOMContentLoaded', () => {
    console.log("🔍 recherche.js chargé !");

    const searchBar = document.querySelector('.search-bar');
    let recettesData = [];

    if (!searchBar) {
        console.error("❌ Erreur : barre de recherche non trouvée !");
        return;
    }

    // Charger les recettes depuis le JSON
    fetch('../data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP " + response.status);
            }
            return response.json();
        })
        .then(data => {
            recettesData = data.recettes;
            console.log("📄 Recettes chargées :", recettesData);
        })
        .catch(error => console.error('❌ Erreur de chargement des recettes:', error));

    // Événement pour détecter la saisie et filtrer les recettes
    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        console.log("🔎 Recherche :", searchTerm);

        if (searchTerm.length === 0) {
            afficherSuggestions([]); // Cacher les suggestions si l'entrée est vide
            return;
        }

        const filteredRecettes = recettesData.filter(recette =>
            recette.nom.toLowerCase().includes(searchTerm)
        );

        afficherSuggestions(filteredRecettes);
    });

    // Afficher les suggestions sous la barre de recherche
    function afficherSuggestions(recettes) {
        let suggestionsContainer = document.querySelector('.search-results');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.classList.add('search-results');
            searchBar.parentNode.appendChild(suggestionsContainer);
        }

        suggestionsContainer.innerHTML = ''; // Vider les suggestions existantes

        if (recettes.length === 0) {
            suggestionsContainer.style.display = 'none'; // Masquer les résultats s'il n'y a pas de correspondance
            return;
        } else {
            suggestionsContainer.style.display = 'block'; // Afficher la liste des résultats
        }

        recettes.forEach(recette => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = recette.nom;
            suggestionItem.addEventListener('click', () => {
                console.log("🟢 Recette sélectionnée :", recette.nom);
                suggestionsContainer.innerHTML = ''; // Fermer les suggestions après sélection
                document.dispatchEvent(new CustomEvent('recetteSelectionnee', { detail: recette })); // Envoie l'événement à pop_up.js
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});
