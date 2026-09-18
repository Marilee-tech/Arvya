// =====================================
// URL DU BACKEND
// =====================================

const API_URL = 'http://localhost:3000'


// =====================================
// FONCTION GÉNÉRALE POUR LES REQUÊTES API
// =====================================

const apiRequest = async (endpoint, options = {}) => {

    const response = await fetch(`${API_URL}${endpoint}`, {

        // Récupère les options spécifiques de la requête :
        // method, body, etc.
        ...options,


        // =====================================
        // COOKIE D'AUTHENTIFICATION
        // =====================================

        // Permet au navigateur d'envoyer automatiquement
        // le cookie HttpOnly au Backend.
        //
        // On n'a plus besoin de récupérer le JWT
        // depuis le localStorage.
        credentials: 'include',


        // =====================================
        // HEADERS
        // =====================================

        headers: {

            'Content-Type': 'application/json',

            // Permet de conserver d'éventuels
            // headers spécifiques à une requête.
            ...options.headers
        }
    })


    // =====================================
    // GESTION DES ERREURS
    // =====================================

    if (!response.ok) {

        const erreur = await response
            .json()
            .catch(() => ({}))

        throw new Error(
            erreur.message ||
            `Erreur API : ${response.status}`
        )
    }


    // =====================================
    // RÉPONSE
    // =====================================

    return await response.json()
}


// =====================================
// PATIENTS / PERSONNES ACCOMPAGNÉES
// =====================================

const getPatients = () => {
    return apiRequest('/patients')
}

const createPatient = (patient) => {
    return apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
    })
}

const updatePatient = (id, patient) => {
    return apiRequest(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patient)
    })
}

const deletePatient = (id) => {
    return apiRequest(`/patients/${id}`, {
        method: 'DELETE'
    })
}


// =====================================
// TRANSMISSIONS
// =====================================

const getTransmissions = () => {
    return apiRequest('/transmissions')
}

const createTransmission = (transmission) => {
    return apiRequest('/transmissions', {
        method: 'POST',
        body: JSON.stringify(transmission)
    })
}


// =====================================
// RENDEZ-VOUS
// =====================================

const getRendezVous = () => {
    return apiRequest('/rendezvous')
}

const createRendezVous = (rendezVous) => {
    return apiRequest('/rendezvous', {
        method: 'POST',
        body: JSON.stringify(rendezVous)
    })
}


// =====================================
// CONTACTS
// =====================================

const getContacts = () => {
    return apiRequest('/contacts')
}

const createContact = (contact) => {
    return apiRequest('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact)
    })
}


// =====================================
// UTILISATEURS
// =====================================

const getUsers = () => {
    return apiRequest('/users')
}

const createUser = (utilisateur) => {
    return apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(utilisateur)
    })
}

const updateUser = (id, utilisateur) => {
    return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(utilisateur)
    })
}

const deleteUser = (id) => {
    return apiRequest(`/users/${id}`, {
        method: 'DELETE'
    })
}


// =====================================
// ASSOCIATIONS
// =====================================

const createAssociation = (association) => {
    return apiRequest('/associations', {
        method: 'POST',
        body: JSON.stringify(association)
    })
}


// =====================================
// EXPORTS
// =====================================

export {
    getPatients,
    getTransmissions,
    getRendezVous,
    getContacts,
    getUsers,
    createTransmission,
    createRendezVous,
    createContact,
    createUser,
    createPatient,
    createAssociation,
    deleteUser,
    deletePatient,
    updateUser,
    updatePatient
}