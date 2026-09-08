import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'

import {
    getPatients,
    getTransmissions,
    getRendezVous,
    getContacts
} from '../services/api.js'

import './Dashboard.css'


function Dashboard() {

    const [patients, setPatients] = useState([])
    const [transmissions, setTransmissions] = useState([])
    const [rendezVous, setRendezVous] = useState([])
    const [contacts, setContacts] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')


    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    useEffect(() => {

        const chargerDashboard = async () => {

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

                setPatients(patientsData)
                setTransmissions(transmissionsData)
                setRendezVous(rendezVousData)
                setContacts(contactsData)

            } catch (error) {

                console.error(error)
                setErreur('Impossible de charger les informations.')

            } finally {

                setChargement(false)

            }
        }

        chargerDashboard()

    }, [])


    const patient = patients[0]
    const prochainRendezVous = rendezVous[0]


    if (chargement) {
        return (
            <div className="dashboard-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <p>Chargement...</p>
                </main>
            </div>
        )
    }


    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-content">

                {/* EN-TÊTE */}

                <section className="dashboard-header">

                    <div>
                        <h1>Bonjour {utilisateur?.prenom} 👋</h1>
                        <p>
                            Voici les dernières nouvelles de votre proche.
                        </p>
                    </div>

                </section>


                {erreur && (
                    <p className="dashboard-error">
                        {erreur}
                    </p>
                )}


                {/* PARTIE HAUTE */}

                <section className="dashboard-top">


                    {/* AUJOURD'HUI */}

                    <div className="dashboard-card today-card">

                        <div className="card-title-row">

                            <h2>Aujourd'hui</h2>

                            <span className="date-badge">
                                Aujourd'hui
                            </span>

                        </div>


                        {rendezVous.length > 0 ? (

                            rendezVous.slice(0, 2).map((rdv) => (

                                <div
                                    className="today-event"
                                    key={rdv.id_rendez_vous}
                                >

                                    <span className="event-dot"></span>

                                    <div>

                                        <strong>
                                            {rdv.titre}
                                        </strong>

                                        <p>
                                            {rdv.lieu || 'Lieu non renseigné'}
                                        </p>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p className="empty-message">
                                Aucun rendez-vous prévu.
                            </p>

                        )}

                    </div>


                    {/* PERSONNE ACCOMPAGNÉE */}

                    <div className="dashboard-card patient-card">

                        <div className="patient-avatar">
                            {patient?.prenom?.charAt(0)}
                        </div>

                        {patient ? (
                            <>
                                <h3>
                                    {patient.prenom} {patient.nom}
                                </h3>

                                {patient.date_de_naissance && (
                                    <p>
                                        Né(e) le{' '}
                                        {new Date(
                                            patient.date_de_naissance
                                        ).toLocaleDateString('fr-FR')}
                                    </p>
                                )}

                                <button className="outline-button">
                                    Voir son profil
                                </button>
                            </>
                        ) : (
                            <p>Aucune personne accompagnée</p>
                        )}

                    </div>

                </section>


                {/* PARTIE BASSE */}

                <section className="dashboard-bottom">


                    {/* DERNIÈRES NOUVELLES */}

                    <div className="dashboard-card news-card">

                        <div className="card-title-row">

                            <h2>Dernières nouvelles</h2>

                            <button className="text-button">
                                Voir tout
                            </button>

                        </div>


                        {transmissions.length > 0 ? (

                            transmissions.slice(0, 3).map((transmission) => (

                                <article
                                    className="news-item"
                                    key={transmission.id_transmission}
                                >

                                    <span className="news-dot"></span>

                                    <div>

                                        <h3>
                                            {transmission.titre}
                                        </h3>

                                        <p>
                                            {transmission.contenu}
                                        </p>

                                    </div>

                                </article>

                            ))

                        ) : (

                            <p className="empty-message">
                                Aucune nouvelle pour le moment.
                            </p>

                        )}

                    </div>


                    {/* COLONNE DROITE */}

                    <div className="dashboard-side">


                        {/* PROCHAIN RDV */}

                        <div className="dashboard-card next-appointment">

                            <h2>Prochain rendez-vous</h2>

                            {prochainRendezVous ? (
                                <>
                                    <strong>
                                        {prochainRendezVous.titre}
                                    </strong>

                                    <p>
                                        {new Date(
                                            prochainRendezVous.date_heure
                                        ).toLocaleDateString('fr-FR')}
                                    </p>

                                    <p>
                                        {prochainRendezVous.lieu}
                                    </p>
                                </>
                            ) : (
                                <p>Aucun rendez-vous prévu.</p>
                            )}

                        </div>


                        {/* CONTACTS */}

                        <div className="dashboard-card contacts-card">

                            <h2>Contacts principaux</h2>

                            {contacts.length > 0 ? (

                                contacts.slice(0, 2).map((contact) => (

                                    <div
                                        className="contact-row"
                                        key={contact.id_contact}
                                    >

                                        <div className="contact-avatar">
                                            {contact.prenom?.charAt(0)}
                                        </div>

                                        <div>
                                            <strong>
                                                {contact.prenom} {contact.nom}
                                            </strong>

                                            <p>
                                                {contact.type}
                                            </p>
                                        </div>

                                    </div>

                                ))

                            ) : (

                                <p className="empty-message">
                                    Aucun contact.
                                </p>

                            )}

                        </div>


                        {/* À SAVOIR */}

                        {patient?.informations_importantes && (

                            <div className="dashboard-card important-card">

                                <h2>À savoir</h2>

                                <p>
                                    {patient.informations_importantes}
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    )
}

export default Dashboard