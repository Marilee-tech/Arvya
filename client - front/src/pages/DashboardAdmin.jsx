import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    Users,
    UserRound,
    BookOpen,
    CalendarDays,
    ArrowRight
} from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    getUsers,
    getPatients,
    getTransmissions,
    getRendezVous
} from '../services/api.js'

import './DashboardAdmin.css'


function DashboardAdmin() {

    const navigate = useNavigate()

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    const [users, setUsers] = useState([])
    const [patients, setPatients] = useState([])
    const [transmissions, setTransmissions] = useState([])
    const [rendezVous, setRendezVous] = useState([])

    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')


    useEffect(() => {

        const chargerDashboard = async () => {

            try {

                const [
                    usersData,
                    patientsData,
                    transmissionsData,
                    rendezVousData
                ] = await Promise.all([
                    getUsers(),
                    getPatients(),
                    getTransmissions(),
                    getRendezVous()
                ])

                setUsers(usersData)
                setPatients(patientsData)
                setTransmissions(transmissionsData)
                setRendezVous(rendezVousData)

            } catch (error) {

                console.error(error)

                setErreur(
                    error.message ||
                    'Impossible de charger le tableau de bord.'
                )

            } finally {

                setChargement(false)

            }

        }

        chargerDashboard()

    }, [])


    const utilisateursActifs = users.filter(
        (user) => user.statut === 'Actif'
    ).length


    const professionnels = users.filter(
        (user) => user.role === 'Professionnel'
    ).length


    const familles = users.filter(
        (user) => user.role === 'Famille'
    ).length


    if (chargement) {

        return (

            <div className="admin-layout">

                <Sidebar />

                <main className="admin-content">
                    <p>Chargement du tableau de bord...</p>
                </main>

            </div>

        )

    }


    return (

        <div className="admin-layout">

            <Sidebar />


            <main className="admin-content">


                <header className="admin-header">

                    <div>

                        <p className="admin-welcome">
                            Administration
                        </p>

                        <h1>
                            Bonjour {utilisateur?.prenom}
                        </h1>

                        <p className="admin-subtitle">
                            Voici un aperçu de l'activité d'ARVYA.
                        </p>

                    </div>

                </header>


                {erreur && (

                    <div className="admin-error">
                        {erreur}
                    </div>

                )}


                <section className="admin-stats">


                    <article className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <Users size={20} />
                        </div>

                        <div>
                            <span>Utilisateurs</span>
                            <strong>{users.length}</strong>
                        </div>

                    </article>


                    <article className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <UserRound size={20} />
                        </div>

                        <div>
                            <span>Personnes accompagnées</span>
                            <strong>{patients.length}</strong>
                        </div>

                    </article>


                    <article className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <BookOpen size={20} />
                        </div>

                        <div>
                            <span>Transmissions</span>
                            <strong>{transmissions.length}</strong>
                        </div>

                    </article>


                    <article className="admin-stat-card">

                        <div className="admin-stat-icon">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <span>Rendez-vous</span>
                            <strong>{rendezVous.length}</strong>
                        </div>

                    </article>


                </section>


                <section className="admin-grid">


                    <article className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>Utilisateurs</h2>
                                <p>
                                    Gestion des comptes ARVYA
                                </p>
                            </div>

                            <Users size={20} />

                        </div>


                        <div className="admin-user-summary">

                            <div>
                                <strong>{utilisateursActifs}</strong>
                                <span>Actifs</span>
                            </div>

                            <div>
                                <strong>{professionnels}</strong>
                                <span>Professionnels</span>
                            </div>

                            <div>
                                <strong>{familles}</strong>
                                <span>Familles</span>
                            </div>

                        </div>


                        <button
                            className="admin-action-button"
                            onClick={() =>
                                navigate('/gestion-utilisateurs')
                            }
                        >
                            Gérer les utilisateurs

                            <ArrowRight size={15} />
                        </button>

                    </article>


                    <article className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>Personnes accompagnées</h2>
                                <p>
                                    Consultez les personnes enregistrées
                                </p>
                            </div>

                            <UserRound size={20} />

                        </div>


                        <div className="admin-big-number">
                            {patients.length}
                        </div>

                        <p className="admin-card-description">
                            personne{patients.length > 1 ? 's' : ''}{' '}
                            actuellement enregistrée
                            {patients.length > 1 ? 's' : ''} sur ARVYA.
                        </p>


                        <button
                            className="admin-secondary-button"
                            onClick={() =>
                                navigate('/accompagnements')
                            }
                        >
                            Voir les accompagnements

                            <ArrowRight size={15} />
                        </button>

                    </article>


                </section>


            </main>

        </div>

    )
}

export default DashboardAdmin