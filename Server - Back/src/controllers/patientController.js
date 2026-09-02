import { getAllPatients, getPatientById, getFamilyPatients, getFamilyPatientById, createPatient, updatePatient, deletePatient } from "../models/patient.model.js";

const getPatients = async (req, res) => {
    try {
        let patients

        if (req.user.role === 'Famille') {
            patients = await getFamilyPatients(req.user.id)
        } else {
            patients = await getAllPatients()
        }

        res.status(200).json(patients)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const getPatient = async (req, res) => {
    try {
        const id = req.params.id

        let patient

        if (req.user.role === 'Famille') {
            patient = await getFamilyPatientById(
                id,
                req.user.id
            )
        } else {
            patient = await getPatientById(id)
        }

        if (!patient) {
            return res.status(404).json({
                message: 'Personne accompagnée non trouvée ou accès refusé'
            })
        }

        res.status(200).json(patient)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewPatient = async (req, res) => {
    try {
        const {
            prenom,
            nom,
            dateDeNaissance,
            adresse,
            informationsImportantes
        } = req.body

        const resultat = await createPatient(
            prenom,
            nom,
            dateDeNaissance,
            adresse,
            informationsImportantes
        )

        res.status(201).json({
            message: 'Personne Accompagnée créé avec succès',
            id_personne_accompagnee: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la création de la Personne Accompagnée'
        })
    }
}

const updateOnePatient = async (req, res) => {
    try {
        const id = req.params.id

        const {
            prenom,
            nom,
            dateDeNaissance,
            adresse,
            informationsImportantes
        } = req.body

        const resultat = await updatePatient(
            id,
            prenom,
            nom,
            dateDeNaissance,
            adresse,
            informationsImportantes
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Personne Accompagnée non trouvée'
            })
        }

        res.status(200).json({
            message: 'Personne Accompagnée modifiée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la modification de la Personne Accompagnée'
        })
    }
}

const deleteOnePatient = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deletePatient(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Personne Accompagnée non supprimée'
            })
        }

        res.status(200).json({
            message: 'Personne Accompagnée supprimée avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression de la personne accompagnée"
        })
    }
}
export { getPatients, getPatient, createNewPatient, updateOnePatient, deleteOnePatient }