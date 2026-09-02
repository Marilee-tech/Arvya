import { getAllRendezVous, getRendezVousById, getFamilyRendezVous, getFamilyRendezVousById, createRendezVous, updateRendezVous, deleteRendezVous } from "../models/rendezvous.model.js";

const getRendezVous = async (req, res) => {
    try {

        let rendezVous

        if (req.user.role === 'Famille') {
            rendezVous = await getFamilyRendezVous(req.user.id)
        } else {
            rendezVous = await getAllRendezVous()
        }

        res.status(200).json(rendezVous)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}


const getOneRendezVous = async (req, res) => {
    try {

        const id = req.params.id

        let rendezVous

        if (req.user.role === 'Famille') {
            rendezVous = await getFamilyRendezVousById(
                id,
                req.user.id
            )
        } else {
            rendezVous = await getRendezVousById(id)
        }

        if (!rendezVous) {
            return res.status(404).json({
                message: 'Rendez-vous non trouvé ou accès refusé'
            })
        }

        res.status(200).json(rendezVous)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewRendezVous = async (req, res) => {
    try {
        const {
            titre,
            dateHeure,
            lieu,
            commentaire,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await createRendezVous(
            titre,
            dateHeure,
            lieu,
            commentaire,
            idPersonneAccompagnee,
            idUtilisateur
        )

        res.status(201).json({
            message: 'Rendez-vous créé avec succès',
            id_rendez_vous: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la création du rendez-vous'
        })
    }
}

const updateOneRendezVous = async (req, res) => {
    try {
        const id = req.params.id

        const {
            titre,
            dateHeure,
            lieu,
            commentaire,
            idPersonneAccompagnee,
            idUtilisateur
        } = req.body

        const resultat = await updateRendezVous(
            id,
            titre,
            dateHeure,
            lieu,
            commentaire,
            idPersonneAccompagnee,
            idUtilisateur
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Rendez-vous non trouvé'
            })
        }

        res.status(200).json({
            message: 'Rendez-vous modifié avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la modification du rendez-vous'
        })
    }
}

const deleteOneRendezVous = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deleteRendezVous(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Rendez-vous non supprimé'
            })
        }

        res.status(200).json({
            message: 'Rendez-vous supprimé avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression du rendez-vous"
        })
    }
}
export { getRendezVous, getOneRendezVous, createNewRendezVous, updateOneRendezVous, deleteOneRendezVous }