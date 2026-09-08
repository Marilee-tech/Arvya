import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { getTransmissions } from '../services/api.js'
import './CarnetDeVie.css'

function CarnetDeVie() {

    const [transmissions, setTransmissions] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    useEffect(() => {

        const chargerTransmissions = async () => {

            try {

                const data = await getTransmissions()

                setTransmissions(data)

            } catch (error) {

                console.error(error)
                setErreur('Impossible de charger le carnet de vie.')

            } finally {

                setChargement(false)

            }
        }

        chargerTransmissions()

    }, [])


    return (
        <div className="carnet-layout">

            <Sidebar />

            <main className="carnet-content">

                <section className="carnet-header">

                    <div>
                        <h1>Carnet de vie</h1>
                        <p>
                            Retrouvez les moments et informations partagés.
                        </p>
                    </div>

                </section>


                {chargement && (
                    <p>Chargement...</p>
                )}


                {erreur && (
                    <p className="carnet-error">
                        {erreur}
                    </p>
                )}


                {!chargement && transmissions.length === 0 && (

                    <div className="carnet-empty">
                        <p>Aucune transmission pour le moment.</p>
                    </div>

                )}


                <section className="transmissions-list">

                    {transmissions.map((transmission) => (

                        <article
                            className="transmission-card"
                            key={transmission.id_transmission}
                        >

                            <div className="transmission-top">

                                <span className="transmission-category">
                                    {transmission.categorie}
                                </span>

                                {transmission.date_evenement && (
                                    <span className="transmission-date">
                                        {new Date(
                                            transmission.date_evenement
                                        ).toLocaleDateString('fr-FR')}
                                    </span>
                                )}

                            </div>


                            <h2>
                                {transmission.titre}
                            </h2>


                            <p className="transmission-content">
                                {transmission.contenu}
                            </p>


                            <div className="transmission-footer">

                                <span>
                                    Visibilité : {transmission.visibilite}
                                </span>

                            </div>

                        </article>

                    ))}

                </section>

            </main>

        </div>
    )
}

export default CarnetDeVie