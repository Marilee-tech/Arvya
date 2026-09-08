import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff
} from 'lucide-react'

import logoArvya
    from '../assets/logo_sans_slogan-removebg-preview.png'

import './Register.css'


function Register() {

    const navigate = useNavigate()


    const [form, setForm] = useState({

        prenom: '',
        nom: '',
        nomUtilisateur: '',
        email: '',
        motDePasse: '',
        confirmationMotDePasse: ''

    })


    const [afficherMotDePasse, setAfficherMotDePasse] =
        useState(false)


    const [chargement, setChargement] =
        useState(false)


    const [erreur, setErreur] =
        useState('')


    const [succes, setSucces] =
        useState('')



    // =====================================
    // MODIFICATION DES CHAMPS
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target


        setForm({
            ...form,
            [name]: value
        })

    }



    // =====================================
    // INSCRIPTION
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault()


        setErreur('')
        setSucces('')


        // Vérification mot de passe

        if (
            form.motDePasse !==
            form.confirmationMotDePasse
        ) {

            setErreur(
                'Les mots de passe ne correspondent pas'
            )

            return

        }


        if (form.motDePasse.length < 8) {

            setErreur(
                'Le mot de passe doit contenir au moins 8 caractères'
            )

            return

        }


        try {

            setChargement(true)


            const response = await fetch(
                'http://localhost:3000/auth/register',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        prenom:
                            form.prenom,

                        nom:
                            form.nom,

                        nomUtilisateur:
                            form.nomUtilisateur,

                        email:
                            form.email,

                        motDePasse:
                            form.motDePasse

                    })

                }
            )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Impossible de créer le compte'
                )

            }


            setSucces(
                'Votre compte a bien été créé !'
            )


            setTimeout(() => {

                navigate('/login')

            }, 1200)


        } catch (error) {

            setErreur(
                error.message
            )


        } finally {

            setChargement(false)

        }

    }



    return (

        <div className="register-page">


            {/* ========================= */}
            {/* PARTIE GAUCHE */}
            {/* ========================= */}

            <section className="register-brand">


                <button
                    className="register-back"
                    type="button"
                    onClick={() => navigate('/')}
                >

                    <ArrowLeft size={16} />

                    Accueil

                </button>


                <div className="register-brand-content">


                    <img
                        src={logoArvya}
                        alt="ARVYA"
                        className="register-logo"
                    />


                    <h1>
                        Accompagner ensemble,
                        <span> simplement.</span>
                    </h1>


                    <p>
                        Un espace partagé pour rester
                        connecté au quotidien de la
                        personne accompagnée.
                    </p>


                </div>


                <p className="register-quote">
                    Parce que chaque transmission
                    raconte une histoire.
                </p>


            </section>



            {/* ========================= */}
            {/* FORMULAIRE */}
            {/* ========================= */}

            <section className="register-form-section">


                <div className="register-form-container">


                    <div className="register-form-header">

                        <p className="register-eyebrow">
                            Bienvenue sur ARVYA
                        </p>

                        <h2>
                            Créer votre compte
                        </h2>

                        <p>
                            Créez votre espace famille
                            en quelques instants.
                        </p>

                    </div>



                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >


                        {/* NOM + PRÉNOM */}

                        <div className="register-row">


                            <div className="register-field">

                                <label htmlFor="prenom">
                                    Prénom
                                </label>

                                <input
                                    id="prenom"
                                    name="prenom"
                                    type="text"
                                    placeholder="Marie"
                                    value={form.prenom}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="register-field">

                                <label htmlFor="nom">
                                    Nom
                                </label>

                                <input
                                    id="nom"
                                    name="nom"
                                    type="text"
                                    placeholder="Dupont"
                                    value={form.nom}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                        </div>



                        {/* NOM UTILISATEUR */}

                        <div className="register-field">

                            <label htmlFor="nomUtilisateur">
                                Nom d'utilisateur
                            </label>

                            <input
                                id="nomUtilisateur"
                                name="nomUtilisateur"
                                type="text"
                                placeholder="marie.dupont"
                                value={form.nomUtilisateur}
                                onChange={handleChange}
                                required
                            />

                        </div>



                        {/* EMAIL */}

                        <div className="register-field">

                            <label htmlFor="email">
                                Adresse email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="marie@email.fr"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>



                        {/* MOT DE PASSE */}

                        <div className="register-field">

                            <label htmlFor="motDePasse">
                                Mot de passe
                            </label>


                            <div className="register-password">

                                <input
                                    id="motDePasse"
                                    name="motDePasse"
                                    type={
                                        afficherMotDePasse
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="8 caractères minimum"
                                    value={form.motDePasse}
                                    onChange={handleChange}
                                    required
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setAfficherMotDePasse(
                                            !afficherMotDePasse
                                        )
                                    }
                                    aria-label={
                                        afficherMotDePasse
                                            ? 'Masquer le mot de passe'
                                            : 'Afficher le mot de passe'
                                    }
                                >

                                    {
                                        afficherMotDePasse
                                            ? <EyeOff size={16} />
                                            : <Eye size={16} />
                                    }

                                </button>

                            </div>

                        </div>



                        {/* CONFIRMATION */}

                        <div className="register-field">

                            <label htmlFor="confirmationMotDePasse">
                                Confirmer le mot de passe
                            </label>

                            <input
                                id="confirmationMotDePasse"
                                name="confirmationMotDePasse"
                                type="password"
                                placeholder="Retapez votre mot de passe"
                                value={
                                    form.confirmationMotDePasse
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>



                        {/* ERREUR */}

                        {
                            erreur && (

                                <p className="register-error">
                                    {erreur}
                                </p>

                            )
                        }



                        {/* SUCCÈS */}

                        {
                            succes && (

                                <p className="register-success">
                                    {succes}
                                </p>

                            )
                        }



                        {/* BOUTON */}

                        <button
                            className="register-submit"
                            type="submit"
                            disabled={chargement}
                        >

                            {
                                chargement
                                    ? 'Création...'
                                    : 'Créer mon compte'
                            }

                            {
                                !chargement &&
                                <ArrowRight size={16} />
                            }

                        </button>


                    </form>



                    <div className="register-login-link">

                        <span>
                            Vous avez déjà un compte ?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/login')
                            }
                        >
                            Se connecter
                        </button>

                    </div>


                    <p className="register-account-info">
                        L'inscription publique crée un
                        compte Famille. Les comptes
                        professionnels sont créés par
                        l'administrateur ARVYA.
                    </p>


                </div>


            </section>


        </div>

    )

}


export default Register