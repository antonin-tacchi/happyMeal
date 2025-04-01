document.addEventListener('DOMContentLoaded', () => {
    console.log("🔍 recherche.js chargé !");

    // Sélectionner toutes les barres de recherche (desktop et mobile)
    const searchBars = document.querySelectorAll('.search-bar');
    let recettesData = [];

    if (searchBars.length === 0) {
        console.error("❌ Erreur : aucune barre de recherche trouvée !");
        return;
    } else {
        console.log(`✅ ${searchBars.length} barres de recherche trouvées`);
    }

    // Charger les données des recettes
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

    // Ajouter un écouteur d'événements à chaque barre de recherche
    searchBars.forEach(searchBar => {
        searchBar.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            console.log("🔎 Recherche :", searchTerm);

            if (searchTerm.length === 0) {
                afficherSuggestions(searchBar, []);
                return;
            }

            const filteredRecettes = recettesData.filter(recette =>
                recette.nom.toLowerCase().includes(searchTerm)
            );

            afficherSuggestions(searchBar, filteredRecettes);
        });

        // Cacher les suggestions quand on clique ailleurs
        document.addEventListener('click', (event) => {
            if (!searchBar.contains(event.target)) {
                const suggestionsContainer = searchBar.parentNode.querySelector('.search-results');
                if (suggestionsContainer) {
                    suggestionsContainer.style.display = 'none';
                }
            }
        });
    });

    // Fonction modifiée pour afficher les suggestions pour la barre de recherche spécifique
    function afficherSuggestions(searchBar, recettes) {
        // Rechercher le conteneur de suggestions existant dans le parent de la barre de recherche
        let suggestionsContainer = searchBar.parentNode.querySelector('.search-results');
        
        // Si aucun conteneur n'existe, en créer un nouveau
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.classList.add('search-results');
            searchBar.parentNode.appendChild(suggestionsContainer);
        }

        suggestionsContainer.innerHTML = '';

        if (recettes.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        } else {
            suggestionsContainer.style.display = 'block';
            suggestionsContainer.classList.add('show');
        }

        recettes.forEach(recette => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = recette.nom;
            suggestionItem.addEventListener('click', () => {
                console.log("🟢 Recette sélectionnée :", recette.nom);
                searchBar.value = recette.nom; // Mettre à jour la valeur de la barre de recherche
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                document.dispatchEvent(new CustomEvent('recetteSelectionnee', { detail: recette })); 
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});