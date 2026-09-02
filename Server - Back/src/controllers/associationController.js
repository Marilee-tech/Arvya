import { getAllAssociations, getAssociationById, createAssociation, updateAssociation, deleteAssociation } from "../models/association.model.js";

const getAssociations = async (req, res) => {
    try {
        const associations = await getAllAssociations()

        res.status(200).json(associations)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Erreur lors de la récupération des associations'
        })
    }
}

const getAssociation = async (req, res) => {
    try {
        const id = req.params.id

        const association = await getAssociationById(id)

        if (!association) {
            return res.status(404).json({
                message: 'Association non trouvée'
            })
        }

        res.status(200).json(association)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewAssociation = async (req, res) => {
    try {
        const {
            relationType,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await createAssociation(
            relationType,
            idPersonneAccompagnee,
            idUtilisateur
        )

        res.status(201).json({
            message: 'Association créée avec succès',
            id_association: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la création de l'association"
        })
    }
}

const updateOneAssociation = async (req, res) => {
    try {
        const id = req.params.id

        const {
            relationType,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await updateAssociation(
            id,
            relationType,
            idPersonneAccompagnee,
            idUtilisateur
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Association non trouvée'
            })
        }

        res.status(200).json({
            message: 'Association modifiée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la modification de l'association"
        })
    }
}

const deleteOneAssociation = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deleteAssociation(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Association non supprimée'
            })
        }

        res.status(200).json({
            message: 'Association supprimée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression de l'association"
        })
    }
}

export { getAssociations, getAssociation, createNewAssociation, updateOneAssociation, deleteOneAssociation }