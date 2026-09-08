import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    ArrowLeft,
    Users,
    UserRound,
    UserPlus
} from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    createUser,
    createPatient,
    createAssociation,
    getUsers
} from '../services/api.js'

import './NouvelAjoutAdmin.css'


function NouvelAjoutAdmin() {

    const navigate = useNavigate()


    // =========================
    // TYPE D'AJOUT
    // =========================

    const [typeAjout, setTypeAjout] = useState(null)

    const [erreur, setErreur] = useState('')
    const [envoi, setEnvoi] = useState(false)


    // =========================
    // FORMULAIRE UTILISATEUR
    // =========================

    const [formUtilisateur, setFormUtilisateur] = useState({
        prenom: '',
        nom: '',
        nomUtilisateur: '',
        email: '',
        motDePasse: '',
        role: 'Famille'
    })


    // =========================
    // FORMULAIRE PERSONNE
    // ACCOMPAGNÉE
    // =========================

    const [formPatient, setFormPatient] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        adresse: '',
        informationsImportantes: ''
    })


    // =========================
    // ASSOCIATIONS
    // =========================

    const [etapePatient, setEtapePatient] =
        useState('creation')

    const [nouvelIdPatient, setNouvelIdPatient] =
        useState(null)

    const [utilisateurs, setUtilisateurs] =
        useState([])

    const [associations, setAssociations] =
        useState([])


    // =========================
    // CHANGEMENT UTILISATEUR
    // =========================

    const handleUtilisateurChange = (event) => {

        const { name, value } = event.target

        setFormUtilisateur({
            ...formUtilisateur,
            [name]: value
        })

    }


    // =========================
    // CHANGEMENT PATIENT
    // =========================

    const handlePatientChange = (event) => {

        const { name, value } = event.target

        setFormPatient({
            ...formPatient,
            [name]: value
        })

    }


    // =========================
    // CRÉER UTILISATEUR
    // =========================

    const handleUtilisateurSubmit = async (event) => {

        event.preventDefault()

        try {

            setEnvoi(true)
            setErreur('')

            await createUser(formUtilisateur)

            navigate('/gestion-utilisateurs')

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                "Impossible de créer l'utilisateur."
            )

        } finally {

            setEnvoi(false)

        }

    }


    // =========================
    // CRÉER PATIENT
    // =========================

    const handlePatientSubmit = async (event) => {

        event.preventDefault()

        try {

            setEnvoi(true)
            setErreur('')

            const resultat =
                await createPatient(formPatient)

            const idPatient =
                resultat.id_personne_accompagnee

            setNouvelIdPatient(idPatient)


            // On récupère les utilisateurs existants
            const utilisateursData =
                await getUsers()


            // On garde uniquement Famille + Professionnel
            const utilisateursAssociables =
                utilisateursData.filter(
                    (user) =>
                        user.role === 'Famille' ||
                        user.role === 'Professionnel'
                )


            setUtilisateurs(
                utilisateursAssociables
            )


            // Passage à l'étape suivante
            setEtapePatient('association')

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de créer la personne accompagnée.'
            )

        } finally {

            setEnvoi(false)

        }

    }


    // =========================
    // SÉLECTION ASSOCIATION
    // =========================

    const toggleAssociation = (user) => {

        const existe = associations.find(
            (association) =>
                association.idUtilisateur ===
                user.id_utilisateur
        )


        // Si déjà sélectionné
        // on le retire
        if (existe) {

            setAssociations(
                associations.filter(
                    (association) =>
                        association.idUtilisateur !==
                        user.id_utilisateur
                )
            )

            return
        }


        // Sinon on l'ajoute
        setAssociations([
            ...associations,
            {
                idUtilisateur:
                    user.id_utilisateur,

                relationType:
                    user.role === 'Famille'
                        ? 'Famille'
                        : 'Professionnel'
            }
        ])

    }


    // =========================
    // ENREGISTRER ASSOCIATIONS
    // =========================

    const enregistrerAssociations = async () => {

        try {

            setEnvoi(true)
            setErreur('')


            for (const association of associations) {

                await createAssociation({

                    relationType:
                        association.relationType,

                    idPersonneAccompagnee:
                        nouvelIdPatient,

                    idUtilisateur:
                        association.idUtilisateur

                })

            }


            navigate('/accompagnements')

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                "Impossible d'enregistrer les associations."
            )

        } finally {

            setEnvoi(false)

        }

    }


    // =========================
    // RETOUR
    // =========================

    const handleRetour = () => {

        if (
            typeAjout === 'patient' &&
            etapePatient === 'association'
        ) {

            setEtapePatient('creation')
            return

        }


        if (typeAjout) {

            setTypeAjout(null)
            return

        }


        navigate('/gestion-utilisateurs')

    }


    // =========================
    // AFFICHAGE
    // =========================

    return (

        <div className="admin-add-layout">


            <Sidebar />


            <main className="admin-add-content">


                {/* RETOUR */}

                <button
                    className="admin-add-back"
                    type="button"
                    onClick={handleRetour}
                >

                    <ArrowLeft size={15} />

                    Retour

                </button>


                {/* HEADER */}

                <header className="admin-add-header">

                    <p>
                        Administration
                    </p>

                    <h1>
                        Ajouter
                    </h1>

                    <span>
                        Ajoutez un utilisateur ou une personne
                        accompagnée à ARVYA.
                    </span>

                </header>


                {/* ERREUR */}

                {erreur && (

                    <div className="admin-add-error">
                        {erreur}
                    </div>

                )}


                {/* ========================= */}
                {/* CHOIX DU TYPE */}
                {/* ========================= */}

                {!typeAjout && (

                    <section className="admin-add-choice">


                        <button
                            className="admin-choice-card"
                            type="button"
                            onClick={() =>
                                setTypeAjout('utilisateur')
                            }
                        >

                            <div className="admin-choice-icon">

                                <Users size={25} />

                            </div>


                            <div>

                                <h2>
                                    Utilisateur
                                </h2>

                                <p>
                                    Créer un compte Famille
                                    ou Professionnel.
                                </p>

                            </div>

                        </button>


                        <button
                            className="admin-choice-card"
                            type="button"
                            onClick={() => {

                                setTypeAjout('patient')
                                setEtapePatient('creation')

                            }}
                        >

                            <div className="admin-choice-icon">

                                <UserRound size={25} />

                            </div>


                            <div>

                                <h2>
                                    Personne accompagnée
                                </h2>

                                <p>
                                    Ajouter une personne et
                                    l'associer à ses proches
                                    et professionnels.
                                </p>

                            </div>

                        </button>


                    </section>

                )}


                {/* ========================= */}
                {/* FORMULAIRE UTILISATEUR */}
                {/* ========================= */}

                {typeAjout === 'utilisateur' && (

                    <form
                        className="admin-add-form"
                        onSubmit={handleUtilisateurSubmit}
                    >


                        <div className="admin-form-title">

                            <UserPlus size={20} />

                            <div>

                                <h2>
                                    Nouvel utilisateur
                                </h2>

                                <p>
                                    Créez un compte Famille
                                    ou Professionnel.
                                </p>

                            </div>

                        </div>


                        <div className="admin-form-row">


                            <div className="admin-form-group">

                                <label>
                                    Prénom
                                </label>

                                <input
                                    name="prenom"
                                    value={
                                        formUtilisateur.prenom
                                    }
                                    onChange={
                                        handleUtilisateurChange
                                    }
                                    required
                                />

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Nom
                                </label>

                                <input
                                    name="nom"
                                    value={
                                        formUtilisateur.nom
                                    }
                                    onChange={
                                        handleUtilisateurChange
                                    }
                                    required
                                />

                            </div>


                        </div>


                        <div className="admin-form-group">

                            <label>
                                Nom d'utilisateur
                            </label>

                            <input
                                name="nomUtilisateur"
                                value={
                                    formUtilisateur.nomUtilisateur
                                }
                                onChange={
                                    handleUtilisateurChange
                                }
                                placeholder="Ex : claire.dupond"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Adresse e-mail
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formUtilisateur.email
                                }
                                onChange={
                                    handleUtilisateurChange
                                }
                                placeholder="exemple@arvya.fr"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Mot de passe temporaire
                            </label>

                            <input
                                type="password"
                                name="motDePasse"
                                value={
                                    formUtilisateur.motDePasse
                                }
                                onChange={
                                    handleUtilisateurChange
                                }
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Rôle
                            </label>

                            <select
                                name="role"
                                value={
                                    formUtilisateur.role
                                }
                                onChange={
                                    handleUtilisateurChange
                                }
                            >

                                <option value="Famille">
                                    Famille
                                </option>

                                <option value="Professionnel">
                                    Professionnel
                                </option>

                            </select>

                        </div>


                        <div className="admin-form-actions">


                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={() =>
                                    setTypeAjout(null)
                                }
                            >

                                Annuler

                            </button>


                            <button
                                type="submit"
                                className="admin-submit-button"
                                disabled={envoi}
                            >

                                <UserPlus size={15} />

                                {envoi
                                    ? 'Création...'
                                    : "Créer l'utilisateur"
                                }

                            </button>


                        </div>


                    </form>

                )}


                {/* ========================= */}
                {/* CRÉATION PERSONNE */}
                {/* ========================= */}

                {typeAjout === 'patient' &&
                    etapePatient === 'creation' && (

                        <form
                            className="admin-add-form"
                            onSubmit={handlePatientSubmit}
                        >


                            <div className="admin-form-title">

                                <UserRound size={20} />

                                <div>

                                    <h2>
                                        Nouvelle personne accompagnée
                                    </h2>

                                    <p>
                                        Renseignez ses informations
                                        principales.
                                    </p>

                                </div>

                            </div>


                            <div className="admin-form-row">


                                <div className="admin-form-group">

                                    <label>
                                        Prénom
                                    </label>

                                    <input
                                        name="prenom"
                                        value={formPatient.prenom}
                                        onChange={
                                            handlePatientChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        Nom
                                    </label>

                                    <input
                                        name="nom"
                                        value={formPatient.nom}
                                        onChange={
                                            handlePatientChange
                                        }
                                        required
                                    />

                                </div>


                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Date de naissance
                                </label>

                                <input
                                    type="date"
                                    name="dateDeNaissance"
                                    value={
                                        formPatient.dateDeNaissance
                                    }
                                    onChange={
                                        handlePatientChange
                                    }
                                    required
                                />

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Adresse postale
                                </label>

                                <input
                                    name="adresse"
                                    value={
                                        formPatient.adresse
                                    }
                                    onChange={
                                        handlePatientChange
                                    }
                                    placeholder="Ex : 10 rue des Lilas, 64000 Pau"
                                    required
                                />

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Informations importantes
                                </label>

                                <textarea
                                    name="informationsImportantes"
                                    value={
                                        formPatient.informationsImportantes
                                    }
                                    onChange={
                                        handlePatientChange
                                    }
                                    rows="5"
                                    placeholder="Habitudes, préférences, informations utiles..."
                                />

                            </div>


                            <div className="admin-form-actions">


                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={() =>
                                        setTypeAjout(null)
                                    }
                                >

                                    Annuler

                                </button>


                                <button
                                    type="submit"
                                    className="admin-submit-button"
                                    disabled={envoi}
                                >

                                    <UserPlus size={15} />

                                    {envoi
                                        ? 'Création...'
                                        : 'Créer et continuer'
                                    }

                                </button>


                            </div>


                        </form>

                    )}


                {/* ========================= */}
                {/* ASSOCIATION */}
                {/* ========================= */}

                {typeAjout === 'patient' &&
                    etapePatient === 'association' && (

                        <section className="admin-add-form">


                            <div className="admin-form-title">

                                <Users size={20} />

                                <div>

                                    <h2>
                                        Associer des utilisateurs
                                    </h2>

                                    <p>
                                        Sélectionnez les membres de la
                                        famille et les professionnels
                                        qui accompagnent cette personne.
                                    </p>

                                </div>

                            </div>


                            {utilisateurs.length === 0 ? (

                                <p>
                                    Aucun utilisateur Famille ou
                                    Professionnel disponible.
                                </p>

                            ) : (

                                <div className="association-list">


                                    {utilisateurs.map((user) => {

                                        const selectionne =
                                            associations.some(
                                                (association) =>
                                                    association.idUtilisateur ===
                                                    user.id_utilisateur
                                            )


                                        return (

                                            <button
                                                key={user.id_utilisateur}
                                                type="button"
                                                className={
                                                    selectionne
                                                        ? 'association-card selected'
                                                        : 'association-card'
                                                }
                                                onClick={() =>
                                                    toggleAssociation(user)
                                                }
                                            >


                                                <div>

                                                    <strong>
                                                        {user.prenom} {user.nom}
                                                    </strong>

                                                    <span>
                                                        {user.role}
                                                    </span>

                                                </div>


                                                <div className="association-check">

                                                    {selectionne
                                                        ? '✓'
                                                        : ''
                                                    }

                                                </div>


                                            </button>

                                        )

                                    })}


                                </div>

                            )}


                            <div className="admin-form-actions">


                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={() =>
                                        setEtapePatient('creation')
                                    }
                                >

                                    Retour

                                </button>


                                <button
                                    type="button"
                                    className="admin-submit-button"
                                    onClick={
                                        enregistrerAssociations
                                    }
                                    disabled={envoi}
                                >

                                    {envoi
                                        ? 'Enregistrement...'
                                        : 'Terminer'
                                    }

                                </button>


                            </div>


                        </section>

                    )}


            </main>


        </div>

    )

}


export default NouvelAjoutAdmin