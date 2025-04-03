document.addEventListener('DOMContentLoaded', () => {
    const inputItem = document.getElementById('input-item');
    const ajouterButton = document.getElementById('ajouter-button');
    const listeCourses = document.getElementById('liste-courses');
    const messageVide = document.getElementById('message-vide');
    
    // Charger la liste des courses depuis le localStorage
    function chargerListeCourses() {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        // Afficher le message si la liste est vide
        if (liste.length === 0) {
            messageVide.style.display = 'block';
        } else {
            messageVide.style.display = 'none';
        }
        
        // Vider la liste actuelle avant de la remplir à nouveau
        listeCourses.innerHTML = '';
        
        // Ajouter chaque élément à la liste
        liste.forEach((ingredient, index) => {
            const li = document.createElement('li');
            li.className = 'item-course';
            
            // Créer le contenu de l'élément
            const nomIngredient = document.createElement('span');
            nomIngredient.textContent = ingredient.nom;
            
            const quantiteContainer = document.createElement('div');
            quantiteContainer.className = 'quantite-container';
            
            const btnMoins = document.createElement('button');
            btnMoins.textContent = '-';
            btnMoins.className = 'btn-quantite';
            btnMoins.addEventListener('click', () => modifierQuantite(index, -1));
            
            const quantiteSpan = document.createElement('span');
            quantiteSpan.className = 'quantite-valeur';
            quantiteSpan.textContent = ingredient.quantite;
            
            const uniteSpan = document.createElement('span');
            uniteSpan.textContent = ingredient.unite || '';
            
            const btnPlus = document.createElement('button');
            btnPlus.textContent = '+';
            btnPlus.className = 'btn-quantite';
            btnPlus.addEventListener('click', () => modifierQuantite(index, 1));
            
            const btnSupprimer = document.createElement('button');
            btnSupprimer.textContent = 'Supprimer';
            btnSupprimer.className = 'btn-supprimer';
            btnSupprimer.addEventListener('click', () => supprimerIngredient(index));
            
            // Assembler l'élément
            quantiteContainer.appendChild(btnMoins);
            quantiteContainer.appendChild(quantiteSpan);
            quantiteContainer.appendChild(uniteSpan);
            quantiteContainer.appendChild(btnPlus);
            
            li.appendChild(nomIngredient);
            li.appendChild(quantiteContainer);
            li.appendChild(btnSupprimer);
            
            listeCourses.appendChild(li);
        });
    }
    
    // Fonction pour modifier la quantité d'un ingrédient
    function modifierQuantite(index, delta) {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        // Vérifier que l'index existe dans la liste
        if (index >= 0 && index < liste.length) {
            // Augmenter ou diminuer la quantité (minimum 1)
            liste[index].quantite = Math.max(1, parseFloat(liste[index].quantite) + delta);
            
            // Sauvegarder la liste mise à jour
            localStorage.setItem('listeCourses', JSON.stringify(liste));
            
            // Mettre à jour l'affichage
            chargerListeCourses();
        }
    }
    
    // Fonction pour supprimer un ingrédient
    function supprimerIngredient(index) {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        // Vérifier que l'index existe dans la liste
        if (index >= 0 && index < liste.length) {
            // Supprimer l'élément à l'index spécifié
            liste.splice(index, 1);
            
            // Sauvegarder la liste mise à jour
            localStorage.setItem('listeCourses', JSON.stringify(liste));
            
            // Mettre à jour l'affichage
            chargerListeCourses();
        }
    }
    
    // Fonction pour ajouter un nouvel ingrédient depuis le champ texte
    function ajouterNouvelIngredient() {
        const texte = inputItem.value.trim();
        
        if (texte) {
            const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
            
            // Vérifier si l'ingrédient existe déjà
            if (!liste.some(ingredient => ingredient.nom.toLowerCase() === texte.toLowerCase())) {
                // Ajouter le nouvel ingrédient
                liste.push({
                    nom: texte,
                    quantite: 1,
                    unite: ''
                });
                
                // Sauvegarder la liste mise à jour
                localStorage.setItem('listeCourses', JSON.stringify(liste));
                
                // Effacer le champ texte
                inputItem.value = '';
                
                // Mettre à jour l'affichage
                chargerListeCourses();
            } else {
                alert('Cet ingrédient est déjà dans la liste.');
            }
        }
    }
    
    // Ajouter les écouteurs d'événements
    if (ajouterButton) {
        ajouterButton.addEventListener('click', ajouterNouvelIngredient);
    }
    
    if (inputItem) {
        inputItem.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                ajouterNouvelIngredient();
            }
        });
    }
    
    // Charger la liste initiale
    chargerListeCourses();
});
// Fonction pour télécharger la liste de courses en fichier texte
function telechargerListeCourses() {
    const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];

    if (liste.length === 0) {
        alert('Votre liste de courses est vide.');
        return;
    }

    // Convertir la liste en texte ou JSON (par exemple, format texte)
    let contenuFichier = 'Liste de courses :\n\n';
    liste.forEach(ingredient => {
        contenuFichier += `${ingredient.nom} - ${ingredient.quantite} ${ingredient.unite}\n`;
    });

    // Créer un blob avec le contenu du fichier
    const blob = new Blob([contenuFichier], { type: 'text/plain' });

    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liste_courses.txt'; // Nom du fichier à télécharger
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libérer l'URL
    URL.revokeObjectURL(url);
}

// Ajouter l'événement au bouton pour télécharger la liste
const telechargerButton = document.getElementById('telecharger-button');
if (telechargerButton) {
    telechargerButton.addEventListener('click', telechargerListeCourses);
}
