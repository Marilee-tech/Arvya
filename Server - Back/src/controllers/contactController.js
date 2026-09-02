import { getAllContacts, getContactById, getFamilyContacts, getFamilyContactById, createContact, updateContact, deleteContact } from "../models/contact.model.js";

const getContacts = async (req, res) => {
    try {

        let contacts

        if (req.user.role === 'Famille') {
            contacts = await getFamilyContacts(req.user.id)
        } else {
            contacts = await getAllContacts()
        }

        res.status(200).json(contacts)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const getContact = async (req, res) => {
    try {

        const id = req.params.id

        let contact

        if (req.user.role === 'Famille') {
            contact = await getFamilyContactById(
                id,
                req.user.id
            )
        } else {
            contact = await getContactById(id)
        }

        if (!contact) {
            return res.status(404).json({
                message: 'Contact non trouvé ou accès refusé'
            })
        }

        res.status(200).json(contact)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

const createNewContact = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            telephone,
            email,
            type,
            idPersonneAccompagnee
        } = req.body

        const resultat = await createContact(
            nom,
            prenom,
            telephone,
            email,
            type,
            idPersonneAccompagnee
        )

        res.status(201).json({
            message: 'Contact créé avec succès',
            id_contact: resultat.insertId
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la création du contact'
        })
    }
}

const updateOneContact = async (req, res) => {
    try {
        const id = req.params.id

        const {
            nom,
            prenom,
            telephone,
            email,
            type,
            idPersonneAccompagnee
        } = req.body

        const resultat = await updateContact(
            id,
            nom,
            prenom,
            telephone,
            email,
            type,
            idPersonneAccompagnee
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Contact non trouvé'
            })
        }

        res.status(200).json({
            message: 'Contact modifié avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur lors de la modification du Contact'
        })
    }
}

const deleteOneContact = async (req, res) => {
    try {
        const id = req.params.id

        const resultat = await deleteContact(
            id
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Contact non supprimé'
            })
        }

        res.status(200).json({
            message: 'Contact supprimé avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Erreur lors de la suppression du contact"
        })
    }
}
export { getContacts, getContact, createNewContact, updateOneContact, deleteOneContact }