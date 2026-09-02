import db from "../config/db.js"

const getAllAssociations = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_association, relation_type, id_personne_accompagnee, id_utilisateur FROM Association'
        )

        return rows

    } catch (error) {
        console.log('Erreur Association')
        throw error
    }
}

const getAssociationById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_association,
                relation_type,
                id_personne_accompagnee,
                id_utilisateur
            FROM Association
            WHERE id_association = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'association :",
            error
        )
        throw error
    }
}

const createAssociation = async (relationType, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Association (relation_type, id_personne_accompagnee, id_utilisateur) VALUES (?, ?, ?)',
            [relationType, idPersonneAccompagnee, idUtilisateur]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateAssociation = async (id, relationType, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'UPDATE Association SET relation_type = ?, id_personne_accompagnee = ?, id_utilisateur = ? WHERE id_association = ?',
            [relationType, idPersonneAccompagnee, idUtilisateur, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deleteAssociation = async (id) => {
    try {
        const resultat = await db.query(
            'DELETE FROM Association WHERE id_association = ?',
            [id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

export { getAllAssociations, getAssociationById, createAssociation, updateAssociation, deleteAssociation }