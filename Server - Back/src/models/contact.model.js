import db from "../config/db.js"

const getAllContacts = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_contact, nom, prenom, telephone, email, type, id_personne_accompagnee FROM Contact'
        )

        return rows

    } catch (error) {
        console.log('Erreur Contact')
        throw error
    }
}

const getContactById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_contact,
                nom,
                prenom,
                telephone,
                email,
                type,
                id_personne_accompagnee
            FROM Contact
            WHERE id_contact = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            'Erreur lors de la récupération du contact :',
            error
        )
        throw error
    }
}

const getFamilyContacts = async (idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                c.id_contact,
                c.nom,
                c.prenom,
                c.telephone,
                c.email,
                c.type,
                c.id_personne_accompagnee
            FROM Contact AS c
            INNER JOIN Association AS a
                ON c.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE a.id_utilisateur = ?`,
            [idUtilisateur]
        )

        return rows

    } catch (error) {
        console.log('Erreur Contact Famille')
        throw error
    }
}

const getFamilyContactById = async (id, idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                c.id_contact,
                c.nom,
                c.prenom,
                c.telephone,
                c.email,
                c.type,
                c.id_personne_accompagnee
            FROM Contact AS c
            INNER JOIN Association AS a
                ON c.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE c.id_contact = ?
                AND a.id_utilisateur = ?`,
            [id, idUtilisateur]
        )

        return rows[0]

    } catch (error) {
        console.log('Erreur Contact Famille')
        throw error
    }
}

const createContact = async (nom, prenom, telephone, email, type, idPersonneAccompagnee) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Contact (nom, prenom, telephone, email, type, id_personne_accompagnee) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, telephone, email, type, idPersonneAccompagnee]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateContact = async (id, nom, prenom, telephone, email, type, idPersonneAccompagnee) => {
    try {
        const resultat = await db.query(
            'UPDATE Contact SET nom = ?, prenom = ?, telephone = ?, email = ?, type = ?, id_personne_accompagnee = ? WHERE id_contact = ?',
            [nom, prenom, telephone, email, type, idPersonneAccompagnee, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deleteContact = async (id) => {
    try {
        const resultat = await db.query(
            'DELETE FROM Contact WHERE id_contact = ?',
            [id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

export { getAllContacts, getContactById, getFamilyContacts, getFamilyContactById, createContact, updateContact, deleteContact }