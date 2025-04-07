document.addEventListener('DOMContentLoaded', () => {
    const inputItem = document.getElementById('input-item');
    const ajouterButton = document.getElementById('ajouter-button');
    const listeCourses = document.getElementById('liste-courses');
    const messageVide = document.getElementById('message-vide');
    
    function chargerListeCourses() {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        if (liste.length === 0) {
            messageVide.style.display = 'block';
        } else {
            messageVide.style.display = 'none';
        }
        
        listeCourses.innerHTML = '';
        
        liste.forEach((ingredient, index) => {
            const li = document.createElement('li');
            li.className = 'item-course';
            
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
    
    function modifierQuantite(index, delta) {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        if (index >= 0 && index < liste.length) {
            liste[index].quantite = Math.max(1, parseFloat(liste[index].quantite) + delta);
            
            localStorage.setItem('listeCourses', JSON.stringify(liste));
            
            chargerListeCourses();
        }
    }
    
    function supprimerIngredient(index) {
        const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
        
        if (index >= 0 && index < liste.length) {
            liste.splice(index, 1);
            
            localStorage.setItem('listeCourses', JSON.stringify(liste));
            
            chargerListeCourses();
        }
    }
    
    function ajouterNouvelIngredient() {
        const texte = inputItem.value.trim();
        
        if (texte) {
            const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];
            
            if (!liste.some(ingredient => ingredient.nom.toLowerCase() === texte.toLowerCase())) {
                liste.push({
                    nom: texte,
                    quantite: 1,
                    unite: ''
                });
                
                localStorage.setItem('listeCourses', JSON.stringify(liste));
                
                inputItem.value = '';
                
                chargerListeCourses();
            }
        }
    }
    
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
    
    chargerListeCourses();
});

function telechargerListeCourses() {
    const liste = JSON.parse(localStorage.getItem('listeCourses')) || [];

    if (liste.length === 0) {
        return;
    }

    // Vérifier si jsPDF est chargé, si non, l'inclure
    if (typeof jsPDF === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            genererPDF(liste);
        };
        document.head.appendChild(script);
    } else {
        genererPDF(liste);
    }
}

function genererPDF(liste) {
    // Créer un nouveau document PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Ajouter un titre
    doc.setFontSize(18);
    doc.text('Liste de courses', 105, 15, { align: 'center' });
    
    // Ajouter la date
    const date = new Date();
    doc.setFontSize(12);
    doc.text(`Date: ${date.toLocaleDateString()}`, 20, 25);
    
    // Ajouter les éléments de la liste
    doc.setFontSize(12);
    let y = 35;
    
    liste.forEach((ingredient, index) => {
        // Vérifier si nous avons besoin d'une nouvelle page
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        
        const texte = `${index + 1}. ${ingredient.nom} - ${ingredient.quantite} ${ingredient.unite}`;
        doc.text(texte, 20, y);
        y += 10;
    });
    
    // Sauvegarder le PDF
    doc.save('liste_courses.pdf');
}

const telechargerButton = document.getElementById('telecharger-button');
if (telechargerButton) {
    telechargerButton.addEventListener('click', telechargerListeCourses);
}