import { useEffect, useState } from 'react'
import {
    Bell,
    BookOpen,
    CalendarDays
} from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import {
    getTransmissions,
    getRendezVous
} from '../services/api.js'

import './Notifications.css'


function Notifications() {

    const [transmissions, setTransmissions] = useState([])
    const [rendezVous, setRendezVous] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')


    useEffect(() => {

        const chargerNotifications = async () => {

            try {

                const [
                    transmissionsData,
                    rendezVousData
                ] = await Promise.all([
                    getTransmissions(),
                    getRendezVous()
                ])

                setTransmissions(transmissionsData)
                setRendezVous(rendezVousData)

            } catch (error) {

                console.error(error)
                setErreur(
                    'Impossible de charger les notifications.'
                )

            } finally {

                setChargement(false)

            }

        }

        chargerNotifications()

    }, [])


    return (
        <div className="notifications-layout">

            <Sidebar />

            <main className="notifications-content">


                <section className="notifications-header">

                    <div>
                        <h1>Notifications</h1>

                        <p>
                            Retrouvez les dernières informations
                            concernant votre proche.
                        </p>
                    </div>

                </section>


                {chargement && (
                    <p>Chargement...</p>
                )}


                {erreur && (
                    <div className="notifications-error">
                        {erreur}
                    </div>
                )}


                {!chargement &&
                    transmissions.length === 0 &&
                    rendezVous.length === 0 && (

                        <div className="notifications-empty">

                            <Bell size={22} />

                            <p>
                                Aucune nouvelle notification.
                            </p>

                        </div>

                    )}


                <section className="notifications-list">


                    {transmissions.map((transmission) => (

                        <article
                            className="notification-card"
                            key={`transmission-${transmission.id_transmission}`}
                        >

                            <div className="notification-icon">

                                <BookOpen size={18} />

                            </div>


                            <div className="notification-info">

                                <div className="notification-title-row">

                                    <h2>
                                        Nouvelle transmission
                                    </h2>

                                    <span className="notification-badge">
                                        Carnet de vie
                                    </span>

                                </div>


                                <strong>
                                    {transmission.titre}
                                </strong>


                                <p>
                                    {transmission.contenu}
                                </p>

                            </div>

                        </article>

                    ))}


                    {rendezVous.map((rdv) => (

                        <article
                            className="notification-card"
                            key={`rdv-${rdv.id_rendez_vous}`}
                        >

                            <div className="notification-icon">

                                <CalendarDays size={18} />

                            </div>


                            <div className="notification-info">

                                <div className="notification-title-row">

                                    <h2>
                                        Rendez-vous programmé
                                    </h2>

                                    <span className="notification-badge">
                                        Agenda
                                    </span>

                                </div>


                                <strong>
                                    {rdv.titre}
                                </strong>


                                {rdv.date_heure && (

                                    <p>

                                        {new Date(
                                            rdv.date_heure
                                        ).toLocaleDateString(
                                            'fr-FR',
                                            {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            }
                                        )}

                                        {' à '}

                                        {new Date(
                                            rdv.date_heure
                                        ).toLocaleTimeString(
                                            'fr-FR',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }
                                        )}

                                    </p>

                                )}


                                {rdv.lieu && (
                                    <p>
                                        {rdv.lieu}
                                    </p>
                                )}

                            </div>

                        </article>

                    ))}

                </section>

            </main>

        </div>
    )
}

export default Notifications