import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import { createContact } from '../services/api.js'

import './NouveauContact.css'


function NouveauContact() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [formulaire, setFormulaire] = useState({
        prenom: '',
        nom: '',
        type: '',
        telephone: '',
        email: ''
    })

    const [erreur, setErreur] = useState('')
    const [envoi, setEnvoi] = useState(false)


    const handleChange = (event) => {

        const { name, value } = event.target

        setFormulaire({
            ...formulaire,
            [name]: value
        })

    }


    const handleSubmit = async (event) => {

        event.preventDefault()

        setErreur('')
        setEnvoi(true)

        try {

            const nouveauContact = {
                nom: formulaire.nom,
                prenom: formulaire.prenom,
                telephone: formulaire.telephone,
                email: formulaire.email,
                type: formulaire.type,
                idPersonneAccompagnee: Number(id)
            }

            await createContact(nouveauContact)

            navigate(`/contacts?patient=${id}`)

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de créer le contact.'
            )

        } finally {

            setEnvoi(false)

        }

    }


    return (

        <div className="new-contact-layout">

            <Sidebar />


            <main className="new-contact-content">


                <button
                    className="new-contact-back"
                    onClick={() =>
                        navigate(`/contacts?patient=${id}`)
                    }
                >
                    <ArrowLeft size={15} />
                    Retour
                </button>


                <section className="new-contact-header">

                    <h1>Nouveau contact</h1>

                    <p>
                        Ajoutez un proche ou un contact utile
                        pour cette personne accompagnée.
                    </p>

                </section>


                {erreur && (

                    <div className="new-contact-error">
                        {erreur}
                    </div>

                )}


                <form
                    className="new-contact-form"
                    onSubmit={handleSubmit}
                >


                    <div className="contact-form-row">


                        <div className="contact-form-group">

                            <label htmlFor="prenom">
                                Prénom
                            </label>

                            <input
                                id="prenom"
                                name="prenom"
                                type="text"
                                value={formulaire.prenom}
                                onChange={handleChange}
                                placeholder="Ex : Jean"
                                required
                            />

                        </div>


                        <div className="contact-form-group">

                            <label htmlFor="nom">
                                Nom
                            </label>

                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                value={formulaire.nom}
                                onChange={handleChange}
                                placeholder="Ex : Dupond"
                                required
                            />

                        </div>


                    </div>


                    <div className="contact-form-group">

                        <label htmlFor="type">
                            Lien avec la personne
                        </label>

                        <select
                            id="type"
                            name="type"
                            value={formulaire.type}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Sélectionner
                            </option>

                            <option value="Fils">Fils</option>
                            <option value="Fille">Fille</option>
                            <option value="Conjoint">Conjoint</option>
                            <option value="Famille">Famille</option>
                            <option value="Ami">Ami(e)</option>
                            <option value="Medecin">Médecin</option>
                            <option value="Autre">Autre</option>

                        </select>

                    </div>


                    <div className="contact-form-group">

                        <label htmlFor="telephone">
                            Téléphone
                        </label>

                        <input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={formulaire.telephone}
                            onChange={handleChange}
                            placeholder="06 00 00 00 00"
                        />

                    </div>


                    <div className="contact-form-group">

                        <label htmlFor="email">
                            Adresse e-mail
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formulaire.email}
                            onChange={handleChange}
                            placeholder="exemple@email.fr"
                        />

                    </div>


                    <div className="new-contact-actions">


                        <button
                            type="button"
                            className="contact-cancel-button"
                            onClick={() =>
                                navigate(`/contacts?patient=${id}`)
                            }
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            className="contact-submit-button"
                            disabled={envoi}
                        >

                            <UserPlus size={15} />

                            {envoi
                                ? 'Enregistrement...'
                                : 'Ajouter le contact'
                            }

                        </button>


                    </div>


                </form>


            </main>

        </div>

    )
}

export default NouveauContact