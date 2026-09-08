import db from "../config/db.js"

const getAllPatients = async () => {
    try {
        const [rows] = await db.query(
            'SELECT id_personne_accompagnee, prenom, nom, date_de_naissance, adresse, informations_importantes FROM Personne_Accompagnee'
        )

        return rows

    } catch (error) {
        console.log('Erreur Personne Accompagnée')
        throw error
    }
}

const getPatientById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_personne_accompagnee,
                prenom,
                nom,
                date_de_naissance,
                adresse,
                informations_importantes
            FROM Personne_Accompagnee
            WHERE id_personne_accompagnee = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            'Erreur lors de la récupération de la Personne Accompagnée :',
            error
        )
        throw error
    }
}

const getFamilyPatients = async (idUtilisateur) => {
    try {
        const [rows] = await db.query(
            `SELECT
                p.id_personne_accompagnee,
                p.prenom,
                p.nom,
                p.date_de_naissance,
                p.adresse,
                p.informations_importantes
            FROM Personne_Accompagnee AS p
            INNER JOIN Association AS a
                ON p.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE a.id_utilisateur = ?`,
            [idUtilisateur]
        )

        return rows

    } catch (error) {
        console.log('Erreur Personne Accompagnée Famille')
        throw error
    }
}

const getFamilyPatientById = async (id, idUtilisateur) => {
    try {
        const [rows] = await db.query(
            `SELECT
                p.id_personne_accompagnee,
                p.prenom,
                p.nom,
                p.date_de_naissance,
                p.adresse,
                p.informations_importantes
            FROM Personne_Accompagnee AS p
            INNER JOIN Association AS a
                ON p.id_personne_accompagnee = a.id_personne_accompagnee
            WHERE p.id_personne_accompagnee = ?
                AND a.id_utilisateur = ?`,
            [id, idUtilisateur]
        )

        return rows[0]

    } catch (error) {
        console.log('Erreur Personne Accompagnée Famille')
        throw error
    }
}

const createPatient = async (prenom, nom, dateDeNaissance, adresse, informationsImportantes) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Personne_Accompagnee (prenom, nom, date_de_naissance, adresse, informations_importantes) VALUES (?, ?, ?, ?, ?)',
            [prenom, nom, dateDeNaissance, adresse, informationsImportantes]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updatePatient = async (id, prenom, nom, dateDeNaissance, adresse, informationsImportantes) => {
    try {
        const resultat = await db.query(
            'UPDATE Personne_Accompagnee SET prenom = ?, nom = ?, date_de_naissance = ?, adresse = ?, informations_importantes = ? WHERE id_personne_accompagnee = ?',
            [prenom, nom, dateDeNaissance, adresse, informationsImportantes, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deletePatient = async (id) => {

    const connection =
        await db.getConnection()

    try {

        await connection.beginTransaction()


        await connection.query(
            `DELETE FROM Association
       WHERE id_personne_accompagnee = ?`,
            [id]
        )


        await connection.query(
            `DELETE FROM Contact
       WHERE id_personne_accompagnee = ?`,
            [id]
        )


        await connection.query(
            `DELETE FROM Transmission
       WHERE id_personne_accompagnee = ?`,
            [id]
        )


        await connection.query(
            `DELETE FROM Rendez_vous
       WHERE id_personne_accompagnee = ?`,
            [id]
        )


        const [resultat] =
            await connection.query(
                `DELETE FROM Personne_Accompagnee
         WHERE id_personne_accompagnee = ?`,
                [id]
            )


        await connection.commit()


        return resultat


    } catch (error) {

        await connection.rollback()

        console.log(error)

        throw error


    } finally {

        connection.release()

    }

}

export { getAllPatients, getPatientById, getFamilyPatients, getFamilyPatientById, createPatient, updatePatient, deletePatient }