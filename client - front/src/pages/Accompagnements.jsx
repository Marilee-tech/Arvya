import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getPatients } from '../services/api.js'
import './Accompagnements.css'


function Accompagnements() {

    const [patients, setPatients] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    const navigate = useNavigate()


    useEffect(() => {

        const chargerPatients = async () => {

            try {

                const data = await getPatients()

                setPatients(data)

            } catch (error) {

                console.error(error)
                setErreur('Impossible de charger les accompagnements.')

            } finally {

                setChargement(false)

            }
        }

        chargerPatients()

    }, [])


    return (
        <div className="accompagnements-layout">

            <Sidebar />

            <main className="accompagnements-content">

                <section className="accompagnements-header">

                    <div>
                        <h1>Mes accompagnements</h1>
                        <p>
                            Retrouvez les personnes que vous accompagnez.
                        </p>
                    </div>

                </section>


                {chargement && (
                    <p>Chargement...</p>
                )}


                {erreur && (
                    <p className="accompagnements-error">
                        {erreur}
                    </p>
                )}


                {!chargement && patients.length === 0 && (
                    <div className="empty-card">
                        <p>Aucune personne accompagnée.</p>
                    </div>
                )}


                <section className="patients-grid">

                    {patients.map((patient) => (

                        <article
                            className="patient-item"
                            key={patient.id_personne_accompagnee}
                        >

                            <div className="patient-item-avatar">
                                {patient.prenom?.charAt(0)}
                            </div>

                            <div className="patient-item-info">

                                <h2>
                                    {patient.prenom} {patient.nom}
                                </h2>

                                {patient.date_de_naissance && (
                                    <p>
                                        Né(e) le{' '}
                                        {new Date(
                                            patient.date_de_naissance
                                        ).toLocaleDateString('fr-FR')}
                                    </p>
                                )}

                                {patient.adresse && (
                                    <p>
                                        {patient.adresse}
                                    </p>
                                )}

                            </div>


                            <button
                                className="patient-button"
                                onClick={() => {
                                    navigate(
                                        `/accompagnements/${patient.id_personne_accompagnee}`
                                    )
                                }}
                            >
                                Voir le profil
                            </button>

                        </article>

                    ))}

                </section>

            </main>

        </div>
    )
}

export default Accompagnements