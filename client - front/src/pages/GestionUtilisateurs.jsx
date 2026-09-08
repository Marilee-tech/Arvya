import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    ArrowLeft,
    Users,
    Mail,
    ShieldCheck,
    X,
    Save,
    Plus
} from 'lucide-react'

import Sidebar from '../components/Sidebar.jsx'

import {
    getUsers,
    getPatients,
    updateUser,
    updatePatient,
    deleteUser,
    deletePatient
} from '../services/api.js'

import './GestionUtilisateurs.css'


function GestionUtilisateurs() {

    const navigate = useNavigate()


    // =========================
    // DONNÉES
    // =========================

    const [users, setUsers] = useState([])
    const [patients, setPatients] = useState([])

    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    const [ongletActif, setOngletActif] = useState('utilisateurs')


    // =========================
    // MODIFICATION UTILISATEUR
    // =========================

    const [utilisateurModifie, setUtilisateurModifie] = useState(null)

    const [formUtilisateur, setFormUtilisateur] = useState({
        role: '',
        statut: ''
    })

    const [enregistrement, setEnregistrement] = useState(false)


    // =========================
    // MODIFICATION PATIENT
    // =========================

    const [patientModifie, setPatientModifie] = useState(null)

    const [formPatient, setFormPatient] = useState({
        prenom: '',
        nom: '',
        dateDeNaissance: '',
        adresse: '',
        informationsImportantes: ''
    })


    // =========================
    // CHARGEMENT DES DONNÉES
    // =========================

    const chargerDonnees = async () => {

        try {

            setChargement(true)
            setErreur('')

            const [
                utilisateursData,
                patientsData
            ] = await Promise.all([
                getUsers(),
                getPatients()
            ])

            setUsers(utilisateursData)
            setPatients(patientsData)

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de charger les données.'
            )

        } finally {

            setChargement(false)

        }

    }


    useEffect(() => {
        chargerDonnees()
    }, [])


    // =========================
    // UTILISATEURS
    // =========================

    const getInitiales = (user) => {

        const prenom = user.prenom?.charAt(0) || ''
        const nom = user.nom?.charAt(0) || ''

        return `${prenom}${nom}`.toUpperCase()

    }


    const ouvrirModificationUtilisateur = (user) => {

        setUtilisateurModifie(user)

        setFormUtilisateur({
            role: user.role,
            statut: user.statut
        })

        setPatientModifie(null)
        setErreur('')

    }


    const fermerModificationUtilisateur = () => {

        setUtilisateurModifie(null)

        setFormUtilisateur({
            role: '',
            statut: ''
        })

    }


    const handleUtilisateurChange = (event) => {

        const { name, value } = event.target

        setFormUtilisateur({
            ...formUtilisateur,
            [name]: value
        })

    }


    const enregistrerModificationUtilisateur = async () => {

        if (!utilisateurModifie) {
            return
        }

        try {

            setEnregistrement(true)
            setErreur('')

            await updateUser(
                utilisateurModifie.id_utilisateur,
                {
                    prenom: utilisateurModifie.prenom,
                    nom: utilisateurModifie.nom,
                    nomUtilisateur: utilisateurModifie.nom_utilisateur,
                    email: utilisateurModifie.email,
                    role: formUtilisateur.role,
                    statut: formUtilisateur.statut
                }
            )

            fermerModificationUtilisateur()

            await chargerDonnees()

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                "Impossible de modifier l'utilisateur."
            )

        } finally {

            setEnregistrement(false)

        }

    }


    const supprimerUtilisateur = async (user) => {

        const confirmation = window.confirm(
            `Voulez-vous vraiment supprimer ${user.prenom} ${user.nom} ?`
        )

        if (!confirmation) {
            return
        }

        try {

            setErreur('')

            await deleteUser(user.id_utilisateur)

            fermerModificationUtilisateur()

            await chargerDonnees()

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                "Impossible de supprimer l'utilisateur."
            )

        }

    }


    // =========================
    // PERSONNES ACCOMPAGNÉES
    // =========================

    const ouvrirModificationPatient = (patient) => {

        setPatientModifie(patient)

        setFormPatient({
            prenom: patient.prenom || '',
            nom: patient.nom || '',

            dateDeNaissance:
                patient.date_de_naissance
                    ? patient.date_de_naissance.split('T')[0]
                    : '',

            adresse: patient.adresse || '',

            informationsImportantes:
                patient.informations_importantes || ''
        })

        setUtilisateurModifie(null)
        setErreur('')

    }


    const fermerModificationPatient = () => {

        setPatientModifie(null)

        setFormPatient({
            prenom: '',
            nom: '',
            dateDeNaissance: '',
            adresse: '',
            informationsImportantes: ''
        })

    }


    const handlePatientChange = (event) => {

        const { name, value } = event.target

        setFormPatient({
            ...formPatient,
            [name]: value
        })

    }


    const enregistrerPatient = async () => {

        if (!patientModifie) {
            return
        }

        try {

            setEnregistrement(true)
            setErreur('')

            await updatePatient(
                patientModifie.id_personne_accompagnee,
                formPatient
            )

            fermerModificationPatient()

            await chargerDonnees()

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de modifier la personne accompagnée.'
            )

        } finally {

            setEnregistrement(false)

        }

    }


    const supprimerPatient = async (patient) => {

        const confirmation = window.confirm(
            `Voulez-vous vraiment supprimer ${patient.prenom} ${patient.nom} ?`
        )

        if (!confirmation) {
            return
        }

        try {

            setErreur('')

            await deletePatient(
                patient.id_personne_accompagnee
            )

            fermerModificationPatient()

            await chargerDonnees()

        } catch (error) {

            console.error(error)

            setErreur(
                error.message ||
                'Impossible de supprimer la personne accompagnée.'
            )

        }

    }


    // =========================
    // AFFICHAGE
    // =========================

    return (

        <div className="users-layout">

            <Sidebar />


            <main className="users-content">


                {/* RETOUR */}

                <button
                    className="users-back"
                    onClick={() => navigate('/dashboard')}
                >

                    <ArrowLeft size={15} />

                    Retour au tableau de bord

                </button>


                {/* HEADER */}

                <header className="users-header">

                    <div>

                        <p className="users-eyebrow">
                            Administration
                        </p>

                        <h1>
                            Gestion
                        </h1>

                        <p>
                            Gérez les utilisateurs et les personnes
                            accompagnées de la plateforme ARVYA.
                        </p>

                    </div>


                    <div className="users-header-actions">

                        <div className="users-count">

                            <Users size={18} />

                            <span>
                                {users.length} utilisateur
                                {users.length > 1 ? 's' : ''}
                            </span>

                        </div>


                        <button
                            className="users-add-button"
                            onClick={() =>
                                navigate('/admin/ajouter')
                            }
                        >

                            <Plus size={15} />

                            Ajouter

                        </button>

                    </div>

                </header>


                {/* ONGLETS */}

                <div className="users-tabs">

                    <button
                        type="button"
                        className={
                            ongletActif === 'utilisateurs'
                                ? 'users-tab active'
                                : 'users-tab'
                        }
                        onClick={() =>
                            setOngletActif('utilisateurs')
                        }
                    >

                        Utilisateurs

                        <span>
                            {users.length}
                        </span>

                    </button>


                    <button
                        type="button"
                        className={
                            ongletActif === 'patients'
                                ? 'users-tab active'
                                : 'users-tab'
                        }
                        onClick={() =>
                            setOngletActif('patients')
                        }
                    >

                        Personnes accompagnées

                        <span>
                            {patients.length}
                        </span>

                    </button>

                </div>


                {/* ERREUR */}

                {erreur && (

                    <div className="users-error">
                        {erreur}
                    </div>

                )}


                {/* CHARGEMENT */}

                {chargement && (

                    <p className="users-loading">
                        Chargement des données...
                    </p>

                )}


                {/* ========================= */}
                {/* ONGLET UTILISATEURS */}
                {/* ========================= */}

                {!chargement &&
                    ongletActif === 'utilisateurs' &&
                    users.length === 0 && (

                        <div className="users-empty">

                            <Users size={30} />

                            <h2>
                                Aucun utilisateur
                            </h2>

                            <p>
                                Aucun compte n'est actuellement enregistré.
                            </p>

                        </div>

                    )}


                {!chargement &&
                    ongletActif === 'utilisateurs' &&
                    users.length > 0 && (

                        <section className="users-table-card">


                            <div className="users-table-header">

                                <span>
                                    Utilisateur
                                </span>

                                <span>
                                    Rôle
                                </span>

                                <span>
                                    Statut
                                </span>

                                <span>
                                    Action
                                </span>

                            </div>


                            {users.map((user) => (

                                <div key={user.id_utilisateur}>


                                    <article className="user-row">


                                        <div className="user-identity">

                                            <div className="user-avatar">
                                                {getInitiales(user)}
                                            </div>


                                            <div className="user-main-info">

                                                <strong>
                                                    {user.prenom} {user.nom}
                                                </strong>

                                                <span className="user-email">

                                                    <Mail size={12} />

                                                    {user.email}

                                                </span>

                                            </div>

                                        </div>


                                        <div>

                                            <span className="user-role">

                                                <ShieldCheck size={12} />

                                                {user.role}

                                            </span>

                                        </div>


                                        <div>

                                            <span
                                                className={
                                                    user.statut === 'Actif'
                                                        ? 'user-status active'
                                                        : 'user-status inactive'
                                                }
                                            >

                                                <span className="status-dot"></span>

                                                {user.statut}

                                            </span>

                                        </div>


                                        <div>

                                            <button
                                                className="user-edit-button"
                                                type="button"
                                                onClick={() =>
                                                    ouvrirModificationUtilisateur(user)
                                                }
                                            >

                                                Modifier

                                            </button>

                                        </div>


                                    </article>


                                    {/* MODIFICATION UTILISATEUR */}

                                    {utilisateurModifie?.id_utilisateur ===
                                        user.id_utilisateur && (

                                            <div className="user-edit-panel">


                                                <div className="user-edit-field">

                                                    <label>
                                                        Rôle
                                                    </label>

                                                    <select
                                                        name="role"
                                                        value={formUtilisateur.role}
                                                        onChange={handleUtilisateurChange}
                                                    >

                                                        <option value="Famille">
                                                            Famille
                                                        </option>

                                                        <option value="Professionnel">
                                                            Professionnel
                                                        </option>

                                                        <option value="Administrateur">
                                                            Administrateur
                                                        </option>

                                                    </select>

                                                </div>


                                                <div className="user-edit-field">

                                                    <label>
                                                        Statut
                                                    </label>

                                                    <select
                                                        name="statut"
                                                        value={formUtilisateur.statut}
                                                        onChange={handleUtilisateurChange}
                                                    >

                                                        <option value="Actif">
                                                            Actif
                                                        </option>

                                                        <option value="Inactif">
                                                            Inactif
                                                        </option>

                                                    </select>

                                                </div>


                                                <div className="user-edit-actions">


                                                    <button
                                                        type="button"
                                                        className="user-delete-button"
                                                        onClick={() =>
                                                            supprimerUtilisateur(user)
                                                        }
                                                    >

                                                        Supprimer

                                                    </button>


                                                    <div className="user-edit-actions-right">


                                                        <button
                                                            type="button"
                                                            className="user-cancel-button"
                                                            onClick={
                                                                fermerModificationUtilisateur
                                                            }
                                                        >

                                                            <X size={14} />

                                                            Annuler

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="user-save-button"
                                                            onClick={
                                                                enregistrerModificationUtilisateur
                                                            }
                                                            disabled={enregistrement}
                                                        >

                                                            <Save size={14} />

                                                            {enregistrement
                                                                ? 'Enregistrement...'
                                                                : 'Enregistrer'
                                                            }

                                                        </button>


                                                    </div>

                                                </div>


                                            </div>

                                        )}


                                </div>

                            ))}


                        </section>

                    )}


                {/* ========================= */}
                {/* ONGLET PERSONNES */}
                {/* ========================= */}

                {!chargement &&
                    ongletActif === 'patients' &&
                    patients.length === 0 && (

                        <div className="users-empty">

                            <Users size={30} />

                            <h2>
                                Aucune personne accompagnée
                            </h2>

                            <p>
                                Aucune personne accompagnée n'est
                                actuellement enregistrée.
                            </p>

                        </div>

                    )}


                {!chargement &&
                    ongletActif === 'patients' &&
                    patients.length > 0 && (

                        <section className="users-table-card">


                            <div className="users-table-header patient-table-header">

                                <span>
                                    Personne accompagnée
                                </span>

                                <span>
                                    Date de naissance
                                </span>

                                <span>
                                    Adresse
                                </span>

                                <span>
                                    Action
                                </span>

                            </div>


                            {patients.map((patient) => (

                                <div
                                    key={
                                        patient.id_personne_accompagnee
                                    }
                                >


                                    <article className="user-row patient-row">


                                        <div className="user-identity">


                                            <div className="user-avatar">

                                                {patient.prenom?.charAt(0)}
                                                {patient.nom?.charAt(0)}

                                            </div>


                                            <div className="user-main-info">

                                                <strong>

                                                    {patient.prenom} {patient.nom}

                                                </strong>

                                                <span>
                                                    Personne accompagnée
                                                </span>

                                            </div>


                                        </div>


                                        <div>

                                            {patient.date_de_naissance
                                                ? new Date(
                                                    patient.date_de_naissance
                                                ).toLocaleDateString('fr-FR')
                                                : 'Non renseignée'
                                            }

                                        </div>


                                        <div>

                                            {patient.adresse ||
                                                'Non renseignée'
                                            }

                                        </div>


                                        <div>

                                            <button
                                                className="user-edit-button"
                                                type="button"
                                                onClick={() =>
                                                    ouvrirModificationPatient(patient)
                                                }
                                            >

                                                Modifier

                                            </button>

                                        </div>


                                    </article>


                                    {/* MODIFICATION PATIENT */}

                                    {patientModifie
                                        ?.id_personne_accompagnee ===
                                        patient.id_personne_accompagnee && (

                                            <div className="user-edit-panel patient-edit-panel">


                                                <div className="user-edit-field">

                                                    <label>
                                                        Prénom
                                                    </label>

                                                    <input
                                                        name="prenom"
                                                        value={formPatient.prenom}
                                                        onChange={handlePatientChange}
                                                    />

                                                </div>


                                                <div className="user-edit-field">

                                                    <label>
                                                        Nom
                                                    </label>

                                                    <input
                                                        name="nom"
                                                        value={formPatient.nom}
                                                        onChange={handlePatientChange}
                                                    />

                                                </div>


                                                <div className="user-edit-field">

                                                    <label>
                                                        Date de naissance
                                                    </label>

                                                    <input
                                                        type="date"
                                                        name="dateDeNaissance"
                                                        value={formPatient.dateDeNaissance}
                                                        onChange={handlePatientChange}
                                                    />

                                                </div>


                                                <div className="user-edit-field">

                                                    <label>
                                                        Adresse postale
                                                    </label>

                                                    <input
                                                        name="adresse"
                                                        value={formPatient.adresse}
                                                        onChange={handlePatientChange}
                                                    />

                                                </div>


                                                <div className="user-edit-field patient-info-field">

                                                    <label>
                                                        Informations importantes
                                                    </label>

                                                    <textarea
                                                        name="informationsImportantes"
                                                        value={
                                                            formPatient.informationsImportantes
                                                        }
                                                        onChange={handlePatientChange}
                                                        rows="3"
                                                    />

                                                </div>


                                                <div className="user-edit-actions">


                                                    <button
                                                        type="button"
                                                        className="user-delete-button"
                                                        onClick={() =>
                                                            supprimerPatient(patient)
                                                        }
                                                    >

                                                        Supprimer

                                                    </button>


                                                    <div className="user-edit-actions-right">


                                                        <button
                                                            type="button"
                                                            className="user-cancel-button"
                                                            onClick={
                                                                fermerModificationPatient
                                                            }
                                                        >

                                                            <X size={14} />

                                                            Annuler

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="user-save-button"
                                                            onClick={
                                                                enregistrerPatient
                                                            }
                                                            disabled={enregistrement}
                                                        >

                                                            <Save size={14} />

                                                            {enregistrement
                                                                ? 'Enregistrement...'
                                                                : 'Enregistrer'
                                                            }

                                                        </button>


                                                    </div>


                                                </div>


                                            </div>

                                        )}


                                </div>

                            ))}


                        </section>

                    )}


            </main>

        </div>

    )

}


export default GestionUtilisateurs