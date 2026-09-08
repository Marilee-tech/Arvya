import db from "../config/db.js";

const getAllUsers = async () => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_utilisateur,
                prenom,
                nom,
                nom_utilisateur,
                email,
                role,
                statut
            FROM Utilisateur`
        )

        return rows

    } catch (error) {
        console.log('Erreur Utilisateur')
        throw error
    }
}


const getUserById = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id_utilisateur,
                prenom,
                nom,
                nom_utilisateur,
                email,
                role,
                statut
            FROM Utilisateur
            WHERE id_utilisateur = ?`,
            [id]
        )

        return rows[0]

    } catch (error) {
        console.error(
            'Erreur lors de la récupération de l’utilisateur :',
            error
        )
        throw error
    }
}

const createUser = async (prenom, nom, nomUtilisateur, email, motDePasse, role) => {
    try {
        const resultat = await db.query(
            'INSERT INTO Utilisateur (prenom, nom, nom_utilisateur, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?)',
            [prenom, nom, nomUtilisateur, email, motDePasse, role]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateUser = async (id, prenom, nom, nomUtilisateur, email, role, statut) => {
    try {
        const resultat = await db.query(
            'UPDATE Utilisateur SET prenom = ?, nom = ?, nom_utilisateur = ?, email = ?, role = ?, statut = ? WHERE id_utilisateur = ?',
            [prenom, nom, nomUtilisateur, email, role, statut, id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

const deleteUser = async (id) => {
    try {
        const resultat = await db.query(
            'DELETE FROM Utilisateur WHERE id_utilisateur = ?',
            [id]
        )

        return resultat[0]

    } catch (error) {
        console.log(error)
        throw error
    }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser }