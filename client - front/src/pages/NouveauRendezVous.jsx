import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarPlus } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    getPatients,
    createRendezVous
} from '../services/api.js'

import './NouveauRendezVous.css'


function NouveauRendezVous() {

    const navigate = useNavigate()

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    const [patients, setPatients] = useState([])

    const [formulaire, setFormulaire] = useState({
        idPersonneAccompagnee: '',
        titre: '',
        dateHeure: '',
        lieu: '',
        commentaire: ''
    })

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

            const nouveauRendezVous = {

                titre: formulaire.titre,

                // On transforme :
                // 2026-09-10T14:30
                // en :
                // 2026-09-10 14:30:00
                dateHeure:
                    formulaire.dateHeure.replace('T', ' ') + ':00',

                lieu: formulaire.lieu,

                commentaire: formulaire.commentaire,

                idPersonneAccompagnee:
                    Number(formulaire.idPersonneAccompagnee),

                idUtilisateur:
                    utilisateur.id

            }


            await createRendezVous(
                nouveauRendezVous
            )


            navigate('/agenda')


        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de créer le rendez-vous.'
            )

        } finally {

            setEnvoi(false)

        }

    }


    return (

        <div className="new-rdv-layout">

            <Sidebar />


            <main className="new-rdv-content">


                <button
                    className="new-rdv-back"
                    onClick={() => navigate('/dashboard')}
                >

                    <ArrowLeft size={15} />

                    Retour

                </button>


                <section className="new-rdv-header">

                    <h1>Nouveau rendez-vous</h1>

                    <p>
                        Ajoutez un rendez-vous pour une personne accompagnée.
                    </p>

                </section>


                {erreur && (

                    <div className="new-rdv-error">
                        {erreur}
                    </div>

                )}


                <form
                    className="new-rdv-form"
                    onSubmit={handleSubmit}
                >


                    <div className="rdv-form-group">

                        <label htmlFor="patient">
                            Personne accompagnée
                        </label>

                        <select
                            id="patient"
                            name="idPersonneAccompagnee"
                            value={formulaire.idPersonneAccompagnee}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Sélectionner une personne
                            </option>


                            {patients.map((patient) => (

                                <option
                                    key={patient.id_personne_accompagnee}
                                    value={patient.id_personne_accompagnee}
                                >

                                    {patient.prenom} {patient.nom}

                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="rdv-form-group">

                        <label htmlFor="titre">
                            Titre du rendez-vous
                        </label>

                        <input
                            id="titre"
                            type="text"
                            name="titre"
                            value={formulaire.titre}
                            onChange={handleChange}
                            placeholder="Ex : Rendez-vous médecin"
                            required
                        />

                    </div>


                    <div className="rdv-form-group">

                        <label htmlFor="dateHeure">
                            Date et heure
                        </label>

                        <input
                            id="dateHeure"
                            type="datetime-local"
                            name="dateHeure"
                            value={formulaire.dateHeure}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="rdv-form-group">

                        <label htmlFor="lieu">
                            Lieu
                        </label>

                        <input
                            id="lieu"
                            type="text"
                            name="lieu"
                            value={formulaire.lieu}
                            onChange={handleChange}
                            placeholder="Ex : Cabinet médical de Pau"
                            required
                        />

                    </div>


                    <div className="rdv-form-group">

                        <label htmlFor="commentaire">
                            Commentaire
                        </label>

                        <textarea
                            id="commentaire"
                            name="commentaire"
                            value={formulaire.commentaire}
                            onChange={handleChange}
                            placeholder="Ajoutez une information utile..."
                            rows="5"
                        />

                    </div>


                    <div className="new-rdv-actions">


                        <button
                            type="button"
                            className="rdv-cancel-button"
                            onClick={() => navigate('/dashboard')}
                        >

                            Annuler

                        </button>


                        <button
                            type="submit"
                            className="rdv-submit-button"
                            disabled={envoi}
                        >

                            <CalendarPlus size={15} />

                            {envoi
                                ? 'Enregistrement...'
                                : 'Ajouter le rendez-vous'
                            }

                        </button>


                    </div>


                </form>


            </main>

        </div>

    )
}

export default NouveauRendezVous