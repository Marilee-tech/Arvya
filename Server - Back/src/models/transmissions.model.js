import db from "../config/db.js"

const getAllTransmissions = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_transmission, categorie, visibilite, titre, contenu, date_evenement, id_personne_accompagnee, id_utilisateur FROM Transmission'
        )

        return rows

    } catch (error) {
        console.log('Erreur Transmission')
        throw error
    }
}

const getTransmissionById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_transmission,
                categorie,
                visibilite,
                titre,
                contenu,
                date_evenement,
                id_personne_accompagnee,
                id_utilisateur
            FROM Transmission
            WHERE id_transmission = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            'Erreur lors de la récupération de la transmission :',
            error
        )
        throw error
    }
}

const getFamilyTransmissions = async (idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                t.id_transmission,
                t.categorie,
                t.visibilite,
                t.titre,
                t.contenu,
                t.date_evenement,
                t.id_personne_accompagnee,
                t.id_utilisateur
            FROM Transmission AS t
            INNER JOIN Association AS a
                ON t.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE t.visibilite = ?
                AND a.id_utilisateur = ?`,
            ['Famille', idUtilisateur]
        )

        return rows

    } catch (error) {
        console.log('Erreur Transmission Famille')
        throw error
    }
}

const getFamilyTransmissionById = async (id, idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                t.id_transmission,
                t.categorie,
                t.visibilite,
                t.titre,
                t.contenu,
                t.date_evenement,
                t.id_personne_accompagnee,
                t.id_utilisateur
            FROM Transmission AS t
            INNER JOIN Association AS a
                ON t.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE t.id_transmission = ?
                AND t.visibilite = ?
                AND a.id_utilisateur = ?`,
            [id, 'Famille', idUtilisateur]
        )

        return rows[0]

    } catch (error) {
        console.log('Erreur Transmission Famille')
        throw error
    }
}

const createTransmission = async (categorie, visibilite, titre, contenu, dateEvenement, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Transmission (categorie, visibilite, titre, contenu, date_evenement, id_personne_accompagnee, id_utilisateur) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [categorie, visibilite, titre, contenu, dateEvenement, idPersonneAccompagnee, idUtilisateur]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateTransmission = async (id, categorie, visibilite, titre, contenu, dateEvenement, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'UPDATE Transmission SET categorie = ?, visibilite = ?, titre = ?, contenu = ?, date_evenement = ?, id_personne_accompagnee = ?, id_utilisateur = ? WHERE id_transmission = ?',
            [categorie, visibilite, titre, contenu, dateEvenement, idPersonneAccompagnee, idUtilisateur, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deleteTransmission = async (id) => {
    try {
        const resultat = await db.query(
            'DELETE FROM Transmission WHERE id_transmission = ?',
            [id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}



export { getAllTransmissions, getTransmissionById, getFamilyTransmissions, getFamilyTransmissionById, createTransmission, updateTransmission, deleteTransmission }