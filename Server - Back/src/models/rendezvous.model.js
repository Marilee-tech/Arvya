import db from "../config/db.js"

const getAllRendezVous = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_rendez_vous, titre, date_heure, lieu, commentaire, id_personne_accompagnee, id_utilisateur FROM Rendez_vous'
        )

        return rows

    } catch (error) {
        console.log('Erreur Rendez-vous')
        throw error
    }
}

const getRendezVousById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_rendez_vous,
                titre,
                date_heure,
                lieu,
                commentaire,
                id_personne_accompagnee,
                id_utilisateur
            FROM Rendez_vous
            WHERE id_rendez_vous = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            'Erreur lors de la récupération du rendez-vous :',
            error
        )
        throw error
    }
}

const getFamilyRendezVous = async (idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                r.id_rendez_vous,
                r.titre,
                r.date_heure,
                r.lieu,
                r.commentaire,
                r.id_personne_accompagnee,
                r.id_utilisateur
            FROM Rendez_vous AS r
            INNER JOIN Association AS a
                ON r.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE a.id_utilisateur = ?`,
            [idUtilisateur]
        )

        return rows

    } catch (error) {
        console.log('Erreur Rendez-vous Famille')
        throw error
    }
}

const getFamilyRendezVousById = async (id, idUtilisateur) => {
    try {

        const [rows] = await db.query(
            `SELECT
                r.id_rendez_vous,
                r.titre,
                r.date_heure,
                r.lieu,
                r.commentaire,
                r.id_personne_accompagnee,
                r.id_utilisateur
            FROM Rendez_vous AS r
            INNER JOIN Association AS a
                ON r.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE r.id_rendez_vous = ?
                AND a.id_utilisateur = ?`,
            [id, idUtilisateur]
        )

        return rows[0]

    } catch (error) {
        console.log('Erreur Rendez-vous Famille')
        throw error
    }
}

const createRendezVous = async (titre, dateHeure, lieu, commentaire, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Rendez_vous (titre, date_heure, lieu, commentaire, id_personne_accompagnee, id_utilisateur) VALUES (?, ?, ?, ?, ?, ?)',
            [titre, dateHeure, lieu, commentaire, idPersonneAccompagnee, idUtilisateur]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateRendezVous = async (id, titre, dateHeure, lieu, commentaire, idPersonneAccompagnee, idUtilisateur) => {
    try {
        const resultat = await db.query(
            'UPDATE Rendez_vous SET titre = ?, date_heure = ?, lieu = ?, commentaire = ?, id_personne_accompagnee = ?, id_utilisateur = ? WHERE id_rendez_vous = ?',
            [titre, dateHeure, lieu, commentaire, idPersonneAccompagnee, idUtilisateur, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deleteRendezVous = async (id) => {
    try {
        const resultat = await db.query(
            'DELETE FROM Rendez_vous WHERE id_rendez_vous = ?',
            [id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

export { getAllRendezVous, getRendezVousById, getFamilyRendezVous, getFamilyRendezVousById, createRendezVous, updateRendezVous, deleteRendezVous }