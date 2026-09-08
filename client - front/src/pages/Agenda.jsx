import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { getRendezVous } from '../services/api.js'
import './Agenda.css'

function Agenda() {

    const [rendezVous, setRendezVous] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    useEffect(() => {

        const chargerRendezVous = async () => {

            try {

                const data = await getRendezVous()

                setRendezVous(data)

            } catch (error) {

                console.error(error)
                setErreur('Impossible de charger les rendez-vous.')

            } finally {

                setChargement(false)

            }
        }

        chargerRendezVous()

    }, [])


    const rendezVousTries = [...rendezVous].sort(
        (a, b) =>
            new Date(a.date_heure) - new Date(b.date_heure)
    )


    return (
        <div className="agenda-layout">

            <Sidebar />

            <main className="agenda-content">

                <section className="agenda-header">

                    <div>
                        <h1>Agenda</h1>
                        <p>
                            Retrouvez les rendez-vous et événements à venir.
                        </p>
                    </div>

                </section>


                {chargement && (
                    <p>Chargement...</p>
                )}


                {erreur && (
                    <p className="agenda-error">
                        {erreur}
                    </p>
                )}


                {!chargement && rendezVous.length === 0 && (
                    <div className="agenda-empty">
                        <p>Aucun rendez-vous prévu.</p>
                    </div>
                )}


                <section className="agenda-list">

                    {rendezVousTries.map((rdv) => {

                        const date = new Date(rdv.date_heure)

                        return (
                            <article
                                className="agenda-card"
                                key={rdv.id_rendez_vous}
                            >

                                <div className="agenda-date">

                                    <span className="agenda-day">
                                        {date.toLocaleDateString('fr-FR', {
                                            day: '2-digit'
                                        })}
                                    </span>

                                    <span className="agenda-month">
                                        {date.toLocaleDateString('fr-FR', {
                                            month: 'short'
                                        })}
                                    </span>

                                </div>


                                <div className="agenda-info">

                                    <div className="agenda-title-row">

                                        <h2>
                                            {rdv.titre}
                                        </h2>

                                        <span className="agenda-hour">
                                            {date.toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>

                                    </div>


                                    <p className="agenda-location">
                                        {rdv.lieu || 'Lieu non renseigné'}
                                    </p>


                                    {rdv.commentaire && (
                                        <p className="agenda-comment">
                                            {rdv.commentaire}
                                        </p>
                                    )}

                                </div>

                            </article>
                        )
                    })}

                </section>

            </main>

        </div>
    )
}

export default Agenda