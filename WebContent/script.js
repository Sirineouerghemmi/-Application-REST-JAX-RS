// Configuration de l'API REST
const API_CONFIG = {
    // IMPORTANT: Choisir l'une des options ci-dessous
    
    // OPTION 1: Si vous accédez à index.html via Tomcat (http://localhost:8080/tp333/index.html)
    BASE_URL: '/tp333/api',
    
    // OPTION 2: Si vous ouvrez index.html directement depuis le système de fichiers
    // BASE_URL: 'http://localhost:8080/tp333/api',
    
    // OPTION 3: Utiliser l'adresse IP locale
    // BASE_URL: 'http://127.0.0.1:8080/tp333/api',
    
    ENDPOINTS: {
        HEALTH: '/persons/health',
        ALL_PERSONS: '/persons/all',
        ADD_PERSON: '/persons/add',
        UPDATE_PERSON: '/persons/update',
        DELETE_PERSON: '/persons/delete',
        GET_BY_ID: '/persons',
        SEARCH_BY_NAME: '/persons/search'
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Variables globales
let allPersons = [];
let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend chargé. URL API:', API_CONFIG.BASE_URL);
    checkAPIHealth();
    setupEventListeners();
    loadAllPersons();
});

// Vérifier la santé de l'API
async function checkAPIHealth() {
    try {
        console.log('Test health sur:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const statusElement = document.getElementById('api-status');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Health check réussi:', data);
            statusElement.innerHTML = '<span class="text-success">Connectée</span>';
            return true;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Health check échoué:', error);
        const statusElement = document.getElementById('api-status');
        statusElement.innerHTML = '<span class="text-danger">Hors ligne</span>';
        
        showAlert(`API non disponible: ${error.message}. Vérifiez que Tomcat est démarré.`, 'warning');
        return false;
    }
}

// Charger toutes les personnes
async function loadAllPersons() {
    showLoadingState();
    
    try {
        console.log('Chargement depuis:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_PERSONS}`);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_PERSONS}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Statut réponse:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const persons = await response.json();
        console.log('Données reçues:', persons);
        
        // Gérer à la fois les tableaux et les objets simples
        if (Array.isArray(persons)) {
            allPersons = persons;
        } else if (persons && typeof persons === 'object') {
            allPersons = [persons];
        } else {
            allPersons = [];
        }
        
        logAPIRequest('GET', '/all', 'success', `${allPersons.length} personnes chargées`);
        displayPersons(allPersons);
        updateStatistics(allPersons);
        
    } catch (error) {
        console.error('Erreur chargement:', error);
        showErrorState();
        logAPIRequest('GET', '/all', 'error', error.message);
        
        showAlert(`Erreur de chargement: ${error.message}`, 'danger');
    }
}

// Afficher les personnes dans le tableau
function displayPersons(persons) {
    const tableBody = document.getElementById('personsTableBody');
    const tableContainer = document.getElementById('personsTableContainer');
    const emptyState = document.getElementById('emptyState');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorState = document.getElementById('errorState');
    
    // Cacher tous les états
    loadingIndicator.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'none';
    errorState.style.display = 'none';
    
    if (!persons || persons.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Ajouter chaque personne
    persons.forEach(person => {
        const row = document.createElement('tr');
        row.className = 'animate__animated animate__fadeIn';
        
        row.innerHTML = `
            <td><span class="badge bg-secondary">${person.id || 'N/A'}</span></td>
            <td><strong>${person.name || 'Non renseigné'}</strong></td>
            <td>
                <span class="badge ${getAgeBadgeClass(person.age)}">
                    ${person.age} ans
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary action-btn" 
                            onclick="editPerson(${person.id})"
                            title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger action-btn" 
                            onclick="deletePerson(${person.id})"
                            title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-outline-info action-btn" 
                            onclick="viewPersonDetails(${person.id})"
                            title="Détails">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Mettre à jour les statistiques
function updateStatistics(persons) {
    const totalElement = document.getElementById('totalPersons');
    const averageAgeElement = document.getElementById('averageAge');
    const youngestElement = document.getElementById('youngestAge');
    
    totalElement.textContent = persons.length;
    
    if (persons.length > 0) {
        const ages = persons.map(p => p.age).filter(age => age > 0);
        if (ages.length > 0) {
            const averageAge = Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
            const youngestAge = Math.min(...ages);
            
            averageAgeElement.textContent = averageAge;
            youngestElement.textContent = youngestAge;
        } else {
            averageAgeElement.textContent = 0;
            youngestElement.textContent = 0;
        }
    } else {
        averageAgeElement.textContent = 0;
        youngestElement.textContent = 0;
    }
}

// Soumettre le formulaire (ajout ou update)
async function handlePersonSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const id = document.getElementById('personId').value;

    if (!name || isNaN(age) || age < 1 || age > 120) {
        showAlert('Veuillez entrer un nom valide et un âge entre 1 et 120.', 'danger');
        return;
    }

    const person = { name, age };
    if (isEditing && id) person.id = parseInt(id);

    try {
        let url, method;
        if (isEditing) {
            url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PERSON}`;
            method = 'PUT';
        } else {
            url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_PERSON}`;
            method = 'POST';
        }

        console.log('Envoi requête:', { url, method, person });
        
        const response = await fetch(url, {
            method: method,
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(person)
        });

        console.log('Réponse:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Essayer de parser comme JSON, sinon traiter comme texte
        try {
            const data = await response.json();
            console.log('Réponse JSON:', data);
            
            showAlert(isEditing ? 'Personne mise à jour !' : 'Personne ajoutée !', 'success');
            logAPIRequest(method, isEditing ? '/update' : '/add', 'success', 
                isEditing ? 'Personne mise à jour' : 'Personne ajoutée');
            resetForm();
            loadAllPersons();
        } catch (jsonError) {
            // Si ce n'est pas du JSON, lire comme texte
            const text = await response.text();
            console.log('Réponse texte:', text);
            
            showAlert(isEditing ? 'Personne mise à jour !' : 'Personne ajoutée !', 'success');
            logAPIRequest(method, isEditing ? '/update' : '/add', 'success', 
                isEditing ? 'Personne mise à jour' : 'Personne ajoutée');
            resetForm();
            loadAllPersons();
        }
    } catch (error) {
        console.error('Erreur complète:', error);
        showAlert(`Erreur : ${error.message}`, 'danger');
        logAPIRequest(isEditing ? 'PUT' : 'POST', isEditing ? '/update' : '/add', 'error', error.message);
    }
}

// Supprimer une personne
async function deletePerson(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette personne ?')) return;

    try {
        console.log('Suppression ID:', id);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_PERSON}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Réponse suppression:', response.status, response.statusText);
        
        if (response.ok) {
            try {
                const data = await response.json();
                console.log('Réponse JSON suppression:', data);
            } catch (e) {
                // Ignorer si pas JSON
            }
            
            showAlert('Personne supprimée !', 'success');
            logAPIRequest('DELETE', `/delete/${id}`, 'success', 'Personne supprimée');
            loadAllPersons();
        } else {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Erreur suppression:', error);
        showAlert(`Erreur : ${error.message}`, 'danger');
        logAPIRequest('DELETE', `/delete/${id}`, 'error', error.message);
    }
}

// Éditer une personne
async function editPerson(id) {
    try {
        console.log('Édition ID:', id);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_BY_ID}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const person = await response.json();
        console.log('Personne chargée:', person);

        if (person) {
            document.getElementById('personId').value = person.id;
            document.getElementById('name').value = person.name;
            document.getElementById('age').value = person.age;
            isEditing = true;

            document.getElementById('submitBtn').classList.add('d-none');
            document.getElementById('updateBtn').classList.remove('d-none');
            document.getElementById('cancelBtn').classList.remove('d-none');

            // Focus sur le formulaire
            document.getElementById('name').focus();

            showAlert(`Édition de: ${person.name}`, 'info');
            logAPIRequest('GET', `/${id}`, 'info', 'Chargement pour édition');
        } else {
            showAlert('Personne non trouvée', 'warning');
        }
    } catch (error) {
        console.error('Erreur d\'édition:', error);
        showAlert('Erreur lors du chargement de la personne', 'danger');
    }
}

// Rechercher une personne par nom
async function searchPerson() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (!searchValue) {
        loadAllPersons();  // Si vide, recharge tout
        return;
    }

    try {
        console.log('Recherche:', searchValue);
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_BY_NAME}/${encodeURIComponent(searchValue)}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        console.log('Réponse recherche:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('Résultat recherche:', result);
        
        // Vérifier si la réponse est un tableau ou un objet
        let personsArray = [];
        if (Array.isArray(result)) {
            personsArray = result;
        } else if (result && typeof result === 'object') {
            personsArray = [result];
        }

        if (personsArray.length > 0) {
            displayPersons(personsArray);
            showAlert(`${personsArray.length} personne(s) trouvée(s)`, 'success');
            logAPIRequest('GET', `/search/${searchValue}`, 'success', 'Recherche réussie');
        } else {
            displayPersons([]);
            showAlert('Aucune personne trouvée avec ce nom.', 'warning');
        }
    } catch (error) {
        console.error('Erreur recherche:', error);
        showAlert(`Erreur de recherche : ${error.message}`, 'danger');
        logAPIRequest('GET', `/search/${searchValue}`, 'error', error.message);
    }
}

// Voir les détails d'une personne
function viewPersonDetails(id) {
    const person = allPersons.find(p => p.id === id);
    if (person) {
        const details = `ID: ${person.id}\nNom: ${person.name}\nÂge: ${person.age} ans`;
        alert(details);
    } else {
        showAlert('Personne non trouvée', 'warning');
    }
}

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('personForm').reset();
    document.getElementById('personId').value = '';
    isEditing = false;
    document.getElementById('submitBtn').classList.remove('d-none');
    document.getElementById('updateBtn').classList.add('d-none');
    document.getElementById('cancelBtn').classList.add('d-none');
}

// Annuler l'édition
function cancelEdit() {
    resetForm();
    showAlert('Édition annulée', 'info');
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Formulaire
    document.getElementById('personForm').addEventListener('submit', handlePersonSubmit);
    document.getElementById('updateBtn').addEventListener('click', handlePersonSubmit);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    
    // Recherche par touche Entrée
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchPerson();
        }
    });
}

// Afficher les états d'interface
function showLoadingState() {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('personsTableContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

function showErrorState() {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('personsTableContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

// Journal des requêtes API
function logAPIRequest(method, endpoint, type, message) {
    const logContainer = document.getElementById('apiLog');
    const timestamp = new Date().toLocaleTimeString();
    
    let typeClass = '';
    let typeIcon = '';
    
    switch(type) {
        case 'success':
            typeClass = 'text-success';
            typeIcon = '✓';
            break;
        case 'error':
            typeClass = 'text-danger';
            typeIcon = '✗';
            break;
        case 'warning':
            typeClass = 'text-warning';
            typeIcon = '⚠';
            break;
        default:
            typeClass = 'text-info';
            typeIcon = 'ℹ';
    }
    
    const logEntry = document.createElement('div');
    logEntry.className = `mb-1 ${typeClass}`;
    logEntry.innerHTML = `
        <span class="text-muted">[${timestamp}]</span>
        <span class="fw-bold"> ${method} ${endpoint}</span>
        <span class="badge bg-dark ms-2">${typeIcon}</span>
        <span class="ms-2">${message}</span>
    `;
    
    // Garder seulement les 20 dernières entrées
    logContainer.prepend(logEntry);
    const entries = logContainer.querySelectorAll('div');
    if (entries.length > 20) {
        entries[entries.length - 1].remove();
    }
}

function clearLog() {
    document.getElementById('apiLog').innerHTML = 
        '<div class="text-muted">Les requêtes API s\'afficheront ici...</div>';
}

// Afficher une alerte
function showAlert(message, type = 'info') {
    // Créer l'alerte Bootstrap
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        <strong>${type === 'success' ? 'Succès' : 
                  type === 'danger' ? 'Erreur' : 
                  type === 'warning' ? 'Attention' : 'Info'}:</strong>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Helper: Classe CSS pour badge d'âge
function getAgeBadgeClass(age) {
    if (age < 20) return 'bg-info';
    if (age < 40) return 'bg-success';
    if (age < 60) return 'bg-warning';
    return 'bg-danger';
}

// Fonction de test manuel
async function testAllEndpoints() {
    console.log('=== Test des endpoints API ===');
    
    const endpoints = [
        { name: 'Health', url: '/persons/health', method: 'GET' },
        { name: 'All Persons', url: '/persons/all', method: 'GET' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name}...`);
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint.url}`, {
                method: endpoint.method,
                headers: { 'Accept': 'application/json' }
            });
            
            console.log(`${endpoint.name}: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Response:', result);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            console.error(`${endpoint.name} failed:`, error);
        }
    }
    
    console.log('=== Fin des tests ===');
}

// Exporter des fonctions globales pour l'HTML
window.loadAllPersons = loadAllPersons;
window.searchPerson = searchPerson;
window.editPerson = editPerson;
window.deletePerson = deletePerson;
window.viewPersonDetails = viewPersonDetails;
window.clearLog = clearLog;
window.testAllEndpoints = testAllEndpoints;  // Pour tester dans la console