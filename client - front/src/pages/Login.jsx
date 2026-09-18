import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    Eye,
    EyeOff,
    ArrowRight
} from 'lucide-react'

import logoArvya
    from '../assets/logo_sans_slogan-removebg-preview.png'

import './Login.css'


function Login() {

    const navigate = useNavigate()


    const [email, setEmail] =
        useState('')


    const [motDePasse, setMotDePasse] =
        useState('')


    const [
        afficherMotDePasse,
        setAfficherMotDePasse
    ] = useState(false)


    const [erreur, setErreur] =
        useState('')


    const [chargement, setChargement] =
        useState(false)



    // =====================================
    // CONNEXION
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setErreur('')


        try {

            setChargement(true)


            const response = await fetch(
                'http://localhost:3000/auth/login',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    // Autorise le navigateur à recevoir
                    // et envoyer les cookies avec le Backend
                    credentials: 'include',

                    body: JSON.stringify({

                        email,

                        motDePasse

                    })

                }
            )


            const data =
                await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Impossible de se connecter'
                )

            }


            // Stockage de l'utilisateur

            localStorage.setItem(
                'utilisateur',
                JSON.stringify(
                    data.utilisateur
                )
            )


            // Redirection dashboard

            navigate('/dashboard')


        } catch (error) {

            setErreur(
                error.message
            )


        } finally {

            setChargement(false)

        }

    }



    return (

        <div className="login-page">


            {/* ================================= */}
            {/* PARTIE GAUCHE */}
            {/* ================================= */}

            <section className="login-brand">


                <div className="login-brand-content">


                    <img
                        src={logoArvya}
                        alt="Logo ARVYA"
                        className="login-logo"
                    />


                    <h1>

                        Accompagner ensemble,

                        <span>
                            {' '}simplement.
                        </span>

                    </h1>


                    <p>

                        ARVYA rassemble familles et
                        professionnels autour d'un même
                        carnet de vie partagé.

                    </p>


                </div>


                <p className="login-quote">

                    Parce que chaque transmission
                    raconte une histoire.

                </p>


            </section>



            {/* ================================= */}
            {/* FORMULAIRE */}
            {/* ================================= */}

            <section className="login-form-section">


                <div className="login-container">


                    <div className="login-header">


                        <p className="login-eyebrow">
                            Bienvenue
                        </p>


                        <h2>
                            Se connecter
                        </h2>


                        <p>

                            Accédez à votre espace ARVYA.

                        </p>


                    </div>



                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >


                        {/* EMAIL */}

                        <div className="login-field">


                            <label htmlFor="email">

                                Adresse email

                            </label>


                            <input
                                id="email"
                                type="email"
                                placeholder="votre@email.fr"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />


                        </div>



                        {/* MOT DE PASSE */}

                        <div className="login-field">


                            <div className="login-password-label">


                                <label htmlFor="motDePasse">

                                    Mot de passe

                                </label>


                                <button
                                    type="button"
                                    className="forgot-link"
                                    onClick={() =>
                                        navigate(
                                            '/forgot-password'
                                        )
                                    }
                                >

                                    Mot de passe oublié ?

                                </button>


                            </div>


                            <div className="login-password">


                                <input
                                    id="motDePasse"
                                    type={
                                        afficherMotDePasse
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Votre mot de passe"
                                    value={motDePasse}
                                    onChange={(e) =>
                                        setMotDePasse(
                                            e.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    className="login-eye"
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



                        {/* ERREUR */}

                        {
                            erreur && (

                                <p className="login-error">

                                    {erreur}

                                </p>

                            )
                        }



                        {/* BOUTON CONNEXION */}

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={chargement}
                        >


                            {
                                chargement
                                    ? 'Connexion...'
                                    : 'Se connecter'
                            }


                            {
                                !chargement &&
                                <ArrowRight size={16} />
                            }


                        </button>


                    </form>



                    {/* ================================= */}
                    {/* CRÉATION DE COMPTE */}
                    {/* ================================= */}

                    <div className="login-register">


                        <span>

                            Vous n'avez pas encore
                            de compte ?

                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                navigate('/register')
                            }
                        >

                            Créer un compte

                        </button>


                    </div>



                    {/* ================================= */}
                    {/* RETOUR ACCUEIL */}
                    {/* ================================= */}

                    <button
                        className="login-home-link"
                        type="button"
                        onClick={() =>
                            navigate('/')
                        }
                    >

                        Retour à l'accueil

                    </button>


                </div>


            </section>


        </div>

    )

}


export default Login