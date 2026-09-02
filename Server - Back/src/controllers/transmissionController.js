import { getAllTransmissions, getTransmissionById, getFamilyTransmissions, getFamilyTransmissionById, createTransmission, updateTransmission, deleteTransmission } from "../models/transmissions.model.js";

const getTransmissions = async (req, res) => {
    try {

        let transmissions

        if (req.user.role === 'Famille') {
            transmissions = await getFamilyTransmissions(req.user.id)
        } else {
            transmissions = await getAllTransmissions()
        }

        res.status(200).json(transmissions)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Erreur lors de la récupération des transmissions'
        })
    }
}

const getTransmission = async (req, res) => {
    try {
        const id = req.params.id

        let transmission

        if (req.user.role === 'Famille') {
            transmission = await getFamilyTransmissionById(
                id,
                req.user.id
            )
        } else {
            transmission = await getTransmissionById(id)
        }

        if (!transmission) {
            return res.status(404).json({
                message: 'Transmission non trouvée ou accès refusé'
            })
        }

        res.status(200).json(transmission)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewTransmission = async (req, res) => {
    try {
        const {
            categorie,
            visibilite,
            titre,
            contenu,
            dateEvenement,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await createTransmission(
            categorie,
            visibilite,
            titre,
            contenu,
            dateEvenement,
            idPersonneAccompagnee,
            idUtilisateur
        )

        res.status(201).json({
            message: 'Transmission créée avec succès',
            id_transmission: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la création de la transmission'
        })
    }
}

const updateOneTransmission = async (req, res) => {
    try {
        const id = req.params.id

        const {
            categorie,
            visibilite,
            titre,
            contenu,
            dateEvenement,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await updateTransmission(
            id,
            categorie,
            visibilite,
            titre,
            contenu,
            dateEvenement,
            idPersonneAccompagnee,
            idUtilisateur
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Transmission non trouvée'
            })
        }

        res.status(200).json({
            message: 'Transmission modifiée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la modification de la transmission'
        })
    }
}

const deleteOneTransmission = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deleteTransmission(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Transmission non supprimée'
            })
        }

        res.status(200).json({
            message: 'Transmission supprimée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression de la transmission"
        })
    }
}

export { getTransmissions, getTransmission, createNewTransmission, updateOneTransmission, deleteOneTransmission }