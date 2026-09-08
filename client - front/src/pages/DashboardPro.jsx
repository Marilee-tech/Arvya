import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users,
    BookOpen,
    CalendarDays,
    Plus,
    ArrowRight
} from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    getPatients,
    getTransmissions,
    getRendezVous
} from '../services/api.js'

import './DashboardPro.css'


function DashboardPro() {

    const navigate = useNavigate()

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    const [patients, setPatients] = useState([])
    const [transmissions, setTransmissions] = useState([])
    const [rendezVous, setRendezVous] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')


    useEffect(() => {

        const chargerDashboard = async () => {

            try {

                const [
                    patientsData,
                    transmissionsData,
                    rendezVousData
                ] = await Promise.all([
                    getPatients(),
                    getTransmissions(),
                    getRendezVous()
                ])

                setPatients(patientsData)
                setTransmissions(transmissionsData)
                setRendezVous(rendezVousData)

            } catch (error) {

                console.error(error)

                setErreur(
                    'Impossible de charger le tableau de bord.'
                )

            } finally {

                setChargement(false)

            }
        }

        chargerDashboard()

    }, [])


    if (chargement) {

        return (
            <div className="pro-dashboard-layout">

                <Sidebar />

                <main className="pro-dashboard-content">
                    <p>Chargement...</p>
                </main>

            </div>
        )
    }


    return (
        <div className="pro-dashboard-layout">

            <Sidebar />


            <main className="pro-dashboard-content">


                <section className="pro-dashboard-header">

                    <div>

                        <h1>
                            Bonjour {utilisateur?.prenom} 👋
                        </h1>

                        <p>
                            Voici un aperçu de vos accompagnements.
                        </p>

                    </div>


                    <button
                        className="pro-primary-button"
                        onClick={() =>
                            navigate('/nouvelle-transmission')
                        }
                    >
                        <Plus size={16} />

                        Nouvelle transmission
                    </button>

                </section>


                {erreur && (
                    <div className="pro-dashboard-error">
                        {erreur}
                    </div>
                )}


                <section className="pro-stats-grid">


                    <article className="pro-stat-card">

                        <div className="pro-stat-icon">
                            <Users size={20} />
                        </div>

                        <div>
                            <span>Personnes accompagnées</span>

                            <strong>
                                {patients.length}
                            </strong>
                        </div>

                    </article>


                    <article className="pro-stat-card">

                        <div className="pro-stat-icon">
                            <BookOpen size={20} />
                        </div>

                        <div>
                            <span>Transmissions</span>

                            <strong>
                                {transmissions.length}
                            </strong>
                        </div>

                    </article>


                    <article className="pro-stat-card">

                        <div className="pro-stat-icon">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <span>Rendez-vous</span>

                            <strong>
                                {rendezVous.length}
                            </strong>
                        </div>

                    </article>


                </section>


                <section className="pro-dashboard-grid">


                    <article className="pro-dashboard-card">


                        <div className="pro-card-header">

                            <h2>Mes accompagnements</h2>

                            <button
                                onClick={() =>
                                    navigate('/accompagnements')
                                }
                            >
                                Voir tout
                                <ArrowRight size={14} />
                            </button>

                        </div>


                        <div className="pro-patients-list">

                            {patients.length === 0 && (
                                <p className="pro-empty">
                                    Aucun accompagnement.
                                </p>
                            )}


                            {patients.slice(0, 4).map((patient) => (

                                <div
                                    className="pro-patient-row"
                                    key={
                                        patient.id_personne_accompagnee
                                    }
                                >

                                    <div className="pro-patient-avatar">

                                        {patient.prenom?.charAt(0)}

                                    </div>


                                    <div className="pro-patient-info">

                                        <strong>
                                            {patient.prenom} {patient.nom}
                                        </strong>

                                        <span>
                                            {patient.adresse ||
                                                'Adresse non renseignée'}
                                        </span>

                                    </div>


                                    <button
                                        className="pro-open-button"
                                        onClick={() =>
                                            navigate(
                                                `/accompagnements/${patient.id_personne_accompagnee}`
                                            )
                                        }
                                    >
                                        <ArrowRight size={15} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    </article>


                    <article className="pro-dashboard-card">


                        <div className="pro-card-header">

                            <h2>Prochains rendez-vous</h2>

                            <button
                                onClick={() =>
                                    navigate('/agenda')
                                }
                            >
                                Voir tout
                                <ArrowRight size={14} />
                            </button>

                        </div>


                        <div className="pro-appointments-list">

                            {rendezVous.length === 0 && (

                                <p className="pro-empty">
                                    Aucun rendez-vous prévu.
                                </p>

                            )}


                            {rendezVous.slice(0, 3).map((rdv) => {

                                const date = rdv.date_heure
                                    ? new Date(rdv.date_heure)
                                    : null

                                return (

                                    <div
                                        className="pro-appointment-row"
                                        key={rdv.id_rendez_vous}
                                    >

                                        <div className="pro-appointment-date">

                                            {date ? (
                                                <>
                                                    <strong>
                                                        {date.toLocaleDateString(
                                                            'fr-FR',
                                                            {
                                                                day: '2-digit'
                                                            }
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {date.toLocaleDateString(
                                                            'fr-FR',
                                                            {
                                                                month: 'short'
                                                            }
                                                        )}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>—</span>
                                            )}

                                        </div>


                                        <div>

                                            <strong>
                                                {rdv.titre}
                                            </strong>

                                            <p>
                                                {rdv.lieu ||
                                                    'Lieu non renseigné'}
                                            </p>

                                        </div>

                                    </div>

                                )

                            })}

                        </div>


                        <button
                            className="pro-secondary-button"
                            onClick={() =>
                                navigate('/nouveau-rendez-vous')
                            }
                        >
                            <Plus size={15} />

                            Nouveau rendez-vous
                        </button>

                    </article>


                    <article className="pro-dashboard-card pro-transmissions-card">


                        <div className="pro-card-header">

                            <h2>Dernières transmissions</h2>

                            <button
                                onClick={() =>
                                    navigate('/carnet-de-vie')
                                }
                            >
                                Voir tout
                                <ArrowRight size={14} />
                            </button>

                        </div>


                        {transmissions.length === 0 && (

                            <p className="pro-empty">
                                Aucune transmission.
                            </p>

                        )}


                        {transmissions
                            .slice(0, 3)
                            .map((transmission) => (

                                <div
                                    className="pro-transmission-row"
                                    key={
                                        transmission.id_transmission
                                    }
                                >

                                    <div className="pro-transmission-dot" />

                                    <div>

                                        <strong>
                                            {transmission.titre}
                                        </strong>

                                        <p>
                                            {transmission.contenu}
                                        </p>

                                        <span>
                                            {transmission.categorie}
                                        </span>

                                    </div>

                                </div>

                            ))}


                    </article>


                </section>


            </main>

        </div>
    )
}

export default DashboardPro