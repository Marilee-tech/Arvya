import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Phone, Plus, UserRound } from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'
import { getContacts } from '../services/api.js'

import './Contacts.css'


function Contacts() {

    const [contacts, setContacts] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const patientId = searchParams.get('patient')

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    const peutAjouter =
        utilisateur?.role === 'Professionnel' ||
        utilisateur?.role === 'Administrateur'


    useEffect(() => {

        const chargerContacts = async () => {

            try {

                const data = await getContacts()

                setContacts(data)

            } catch (error) {

                console.error(error)

                setErreur(
                    error.message ||
                    'Impossible de charger les contacts.'
                )

            } finally {

                setChargement(false)

            }

        }

        chargerContacts()

    }, [])


    const contactsFiltres = patientId
        ? contacts.filter(
            (contact) =>
                Number(contact.id_personne_accompagnee) ===
                Number(patientId)
        )
        : contacts


    return (

        <div className="contacts-layout">

            <Sidebar />


            <main className="contacts-content">


                <section className="contacts-header">

                    <div>

                        <h1>Contacts</h1>

                        <p>
                            Retrouvez les proches et contacts associés
                            à la personne accompagnée.
                        </p>

                    </div>


                    {peutAjouter && patientId && (

                        <button
                            className="add-contact-button"
                            onClick={() =>
                                navigate(
                                    `/accompagnements/${patientId}/nouveau-contact`
                                )
                            }
                        >
                            <Plus size={15} />

                            Ajouter un contact
                        </button>

                    )}

                </section>


                {chargement && (

                    <p className="contacts-message">
                        Chargement des contacts...
                    </p>

                )}


                {erreur && (

                    <p className="contacts-error">
                        {erreur}
                    </p>

                )}


                {!chargement &&
                    !erreur &&
                    contactsFiltres.length === 0 && (

                        <div className="contacts-empty">

                            <UserRound size={30} />

                            <h2>Aucun contact</h2>

                            <p>
                                Aucun contact n'est encore associé
                                à cette personne.
                            </p>

                        </div>

                    )}


                {!chargement &&
                    !erreur &&
                    contactsFiltres.length > 0 && (

                        <section className="contacts-grid">

                            {contactsFiltres.map((contact) => (

                                <article
                                    className="contact-card"
                                    key={contact.id_contact}
                                >

                                    <div className="contact-avatar">

                                        {contact.prenom?.charAt(0)}
                                        {contact.nom?.charAt(0)}

                                    </div>


                                    <div className="contact-info">

                                        <div className="contact-title">

                                            <h2>
                                                {contact.prenom} {contact.nom}
                                            </h2>

                                            {contact.type && (

                                                <span className="contact-type">
                                                    {contact.type}
                                                </span>

                                            )}

                                        </div>


                                        <div className="contact-details">


                                            {contact.telephone && (

                                                <div className="contact-detail">

                                                    <Phone size={14} />

                                                    <span>
                                                        {contact.telephone}
                                                    </span>

                                                </div>

                                            )}


                                            {contact.email && (

                                                <div className="contact-detail">

                                                    <Mail size={14} />

                                                    <span>
                                                        {contact.email}
                                                    </span>

                                                </div>

                                            )}


                                        </div>

                                    </div>

                                </article>

                            ))}

                        </section>

                    )}


            </main>

        </div>

    )
}

export default Contacts