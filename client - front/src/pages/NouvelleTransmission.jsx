import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    getPatients,
    createTransmission
} from '../services/api.js'

import './NouvelleTransmission.css'


function NouvelleTransmission() {

    const navigate = useNavigate()

    // JSON.parse() permet de le convertir le json en objet javascript
    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    const [patients, setPatients] = useState([])

    const [formulaire, setFormulaire] = useState({
        idPersonneAccompagnee: '',
        categorie: '',
        titre: '',
        contenu: '',
        visibilite: 'Famille',
        dateEvenement: ''
    })
    // Création d'un seul objet qui contient tout les données du formulaire

    const [erreur, setErreur] = useState('')
    const [envoi, setEnvoi] = useState(false)


    useEffect(() => {

        const chargerPatients = async () => {

            try {

                const data = await getPatients()

                setPatients(data)

            } catch (error) {

                console.error(error)

                setErreur(
                    'Impossible de charger les personnes accompagnées.'
                )

            }

        }

        chargerPatients()

    }, [])


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

            const nouvelleTransmission = {

                categorie: formulaire.categorie,

                visibilite: formulaire.visibilite,

                titre: formulaire.titre,

                contenu: formulaire.contenu,

                dateEvenement: formulaire.dateEvenement,

                idPersonneAccompagnee:
                    Number(formulaire.idPersonneAccompagnee),

                idUtilisateur:
                    utilisateur.id

            }


            await createTransmission(
                nouvelleTransmission
            )


            navigate('/carnet-de-vie')


        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de créer la transmission.'
            )

        } finally {

            setEnvoi(false)

        }

    }


    return (

        <div className="new-transmission-layout">

            <Sidebar />


            <main className="new-transmission-content">


                <button
                    className="new-transmission-back"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft size={15} />

                    Retour
                </button>


                <section className="new-transmission-header">

                    <h1>Nouvelle transmission</h1>

                    <p>
                        Partagez une information concernant
                        une personne accompagnée.
                    </p>

                </section>


                {erreur && (

                    <div className="new-transmission-error">
                        {erreur}
                    </div>

                )}


                <form
                    className="new-transmission-form"
                    onSubmit={handleSubmit}
                >


                    <div className="form-group">

                        <label htmlFor="patient">
                            Personne accompagnée
                        </label>

                        <select
                            id="patient"
                            name="idPersonneAccompagnee"
                            value={
                                formulaire.idPersonneAccompagnee
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Sélectionner une personne
                            </option>

                            {patients.map((patient) => (

                                <option
                                    key={
                                        patient.id_personne_accompagnee
                                    }
                                    value={
                                        patient.id_personne_accompagnee
                                    }
                                >
                                    {patient.prenom} {patient.nom}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="form-row">


                        <div className="form-group">

                            <label htmlFor="categorie">
                                Catégorie
                            </label>

                            <select
                                id="categorie"
                                name="categorie"
                                value={formulaire.categorie}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Sélectionner
                                </option>

                                <option value="Quotidien">
                                    Quotidien
                                </option>

                                <option value="Activite">
                                    Activité
                                </option>

                                <option value="Repas">
                                    Repas
                                </option>

                                <option value="Humeur">
                                    Humeur
                                </option>

                                <option value="Information">
                                    Information
                                </option>

                                <option value="Autre">
                                    Autre
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label htmlFor="dateEvenement">
                                Date
                            </label>

                            <input
                                id="dateEvenement"
                                type="date"
                                name="dateEvenement"
                                value={formulaire.dateEvenement}
                                onChange={handleChange}
                                required
                            />

                        </div>


                    </div>


                    <div className="form-group">

                        <label htmlFor="titre">
                            Titre
                        </label>

                        <input
                            id="titre"
                            type="text"
                            name="titre"
                            value={formulaire.titre}
                            onChange={handleChange}
                            placeholder="Ex : Promenade de l'après-midi"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="contenu">
                            Transmission
                        </label>

                        <textarea
                            id="contenu"
                            name="contenu"
                            value={formulaire.contenu}
                            onChange={handleChange}
                            placeholder="Écrivez votre transmission..."
                            rows="7"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="visibilite">
                            Visibilité
                        </label>

                        <select
                            id="visibilite"
                            name="visibilite"
                            value={formulaire.visibilite}
                            onChange={handleChange}
                            required
                        >

                            <option value="Famille">
                                Visible par la famille
                            </option>

                            <option value="Privee">
                                Professionnels uniquement
                            </option>

                        </select>

                        <span className="visibility-help">
                            Choisissez si cette transmission
                            peut être consultée par la famille.
                        </span>

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/dashboard')}
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            className="submit-button"
                            disabled={envoi}
                        >

                            <Send size={15} />

                            {envoi
                                ? 'Enregistrement...'
                                : 'Publier la transmission'
                            }

                        </button>

                    </div>


                </form>

            </main>

        </div>

    )
}

export default NouvelleTransmission