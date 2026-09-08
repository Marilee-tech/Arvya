const API_URL = 'http://localhost:3000'

const apiRequest = async (endpoint, options = {}) => {

    const token = localStorage.getItem('token')

    const response = await fetch(`${API_URL}${endpoint}`, {

        ...options,

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers
        }

    })

    if (!response.ok) {
        const erreur = await response.json().catch(() => ({}))

        throw new Error(
            erreur.message || `Erreur API : ${response.status}`
        )
    }

    return await response.json()
}


const getPatients = () => {
    return apiRequest('/patients')
}

const getTransmissions = () => {
    return apiRequest('/transmissions')
}

const getRendezVous = () => {
    return apiRequest('/rendezvous')
}

const getContacts = () => {
    return apiRequest('/contacts')
}

const getUsers = () => apiRequest('/users')

const createTransmission = (transmission) => {

    return apiRequest('/transmissions', {
        method: 'POST',
        body: JSON.stringify(transmission)
    })

}

const createRendezVous = (rendezVous) => {

    return apiRequest('/rendezvous', {
        method: 'POST',
        body: JSON.stringify(rendezVous)
    })

}

const createContact = (contact) => {

    return apiRequest('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact)
    })

}

const updateUser = (id, utilisateur) => {

    return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(utilisateur)
    })

}

const updatePatient = (id, patient) => {

    return apiRequest(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patient)
    })

}

const createUser = (utilisateur) => {

    return apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(utilisateur)
    })

}


const createPatient = (patient) => {

    return apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
    })

}

const createAssociation = (association) => {
    return apiRequest('/associations', {
        method: 'POST',
        body: JSON.stringify(association)
    })
}

const deleteUser = (id) => {
    return apiRequest(`/users/${id}`, {
        method: 'DELETE'
    })
}

const deletePatient = (id) => {
    return apiRequest(`/patients/${id}`, {
        method: 'DELETE'
    })
}

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