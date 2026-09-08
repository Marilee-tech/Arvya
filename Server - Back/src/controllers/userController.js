import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../models/user.model.js'
import bcrypt from 'bcrypt'

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers()

        res.status(200).json(users)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Erreur lors de la récupération des utilisateurs'
        })
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id

        const user = await getUserById(id)

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            })
        }

        res.status(200).json(user)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewUser = async (req, res) => {
    try {
        const {
            prenom,
            nom,
            nomUtilisateur,
            email,
            motDePasse,
            role
        } = req.body

        const motDePasseHash = await bcrypt.hash(motDePasse, 10)

        const resultat = await createUser(
            prenom,
            nom,
            nomUtilisateur,
            email,
            motDePasseHash,
            role
        )

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            id_utilisateur: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la création de l’utilisateur'
        })
    }
}

const updateOneUser = async (req, res) => {
    try {
        const id = req.params.id

        const {
            prenom,
            nom,
            nomUtilisateur,
            email,
            role,
            statut
        } = req.body

        const resultat = await updateUser(
            id,
            prenom,
            nom,
            nomUtilisateur,
            email,
            role,
            statut
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            })
        }

        res.status(200).json({
            message: 'Utilisateur modifié avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la modification de l’utilisateur'
        })
    }
}

const deleteOneUser = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deleteUser(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Utilisateur non supprimé'
            })
        }

        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur"
        })
    }
}

export { getUsers, getUser, createNewUser, updateOneUser, deleteOneUser }