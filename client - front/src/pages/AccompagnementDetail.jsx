import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getPatients, getTransmissions, getRendezVous, getContacts } from '../services/api.js'
import './AccompagnementDetail.css'

function AccompagnementDetail() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [patient, setPatient] = useState(null)
    const [transmissions, setTransmissions] = useState([])
    const [rendezVous, setRendezVous] = useState([])
    const [contacts, setContacts] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    useEffect(() => {

        const chargerDonnees = async () => {

            try {

                const [
                    patientsData,
                    transmissionsData,
                    rendezVousData,
                    contactsData
                ] = await Promise.all([
                    getPatients(),
                    getTransmissions(),
                    getRendezVous(),
                    getContacts()
                ])

                const patientTrouve = patientsData.find(
                    (item) =>
                        item.id_personne_accompagnee === Number(id)
                )

                setPatient(patientTrouve)

                setTransmissions(
                    transmissionsData.filter(
                        (item) =>
                            item.id_personne_accompagnee === Number(id)
                    )
                )

                setRendezVous(
                    rendezVousData.filter(
                        (item) =>
                            item.id_personne_accompagnee === Number(id)
                    )
                )

                setContacts(
                    contactsData.filter(
                        (item) =>
                            item.id_personne_accompagnee === Number(id)
                    )
                )

            } catch (error) {

                console.error(error)
                setErreur('Impossible de charger le profil.')

            } finally {

                setChargement(false)

            }

        }

        chargerDonnees()

    }, [id])


    if (chargement) {
        return (
            <div className="detail-layout">
                <Sidebar />
                <main className="detail-content">
                    <p>Chargement...</p>
                </main>
            </div>
        )
    }


    if (!patient) {
        return (
            <div className="detail-layout">
                <Sidebar />
                <main className="detail-content">
                    <p>Personne accompagnée introuvable.</p>
                </main>
            </div>
        )
    }


    return (
        <div className="detail-layout">

            <Sidebar />

            <main className="detail-content">

                <button
                    className="back-button"
                    onClick={() => navigate('/accompagnements')}
                >
                    ← Retour
                </button>

                {erreur && (
                    <p className="detail-error">
                        {erreur}
                    </p>
                )}

                <section className="profile-header">

                    <div className="profile-avatar">
                        {patient.prenom?.charAt(0)}
                    </div>

                    <div>

                        <h1>
                            {patient.prenom} {patient.nom}
                        </h1>

                        {patient.date_de_naissance && (
                            <p>
                                Né(e) le{' '}
                                {new Date(
                                    patient.date_de_naissance
                                ).toLocaleDateString('fr-FR')}
                            </p>
                        )}

                        {patient.adresse && (
                            <p>{patient.adresse}</p>
                        )}

                    </div>

                </section>


                <section className="detail-grid">


                    <div className="detail-card important-info">

                        <h2>Informations importantes</h2>

                        <p>
                            {patient.informations_importantes ||
                                'Aucune information importante renseignée.'}
                        </p>

                    </div>


                    <div className="detail-card">

                        <h2>Contacts</h2>

                        <p className="detail-count">
                            {contacts.length} contact(s)
                        </p>

                        <button
                            className="detail-button"
                            onClick={() =>
                                navigate(`/contacts?patient=${patient.id_personne_accompagnee}`)
                            }
                        >
                            Voir les contacts
                        </button>

                    </div>


                    <div className="detail-card">

                        <h2>Carnet de vie</h2>

                        <p className="detail-count">
                            {transmissions.length} transmission(s)
                        </p>

                        <button
                            className="detail-button"
                            onClick={() => navigate('/carnet-de-vie')}
                        >
                            Voir le carnet
                        </button>

                    </div>


                    <div className="detail-card">

                        <h2>Agenda</h2>

                        <p className="detail-count">
                            {rendezVous.length} rendez-vous
                        </p>

                        <button
                            className="detail-button"
                            onClick={() => navigate('/agenda')}
                        >
                            Voir l'agenda
                        </button>

                    </div>

                </section>

            </main>

        </div>
    )
}

export default AccompagnementDetail