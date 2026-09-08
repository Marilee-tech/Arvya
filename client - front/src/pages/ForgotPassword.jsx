import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    ArrowLeft,
    ArrowRight,
    KeyRound,
    Mail
} from 'lucide-react'

import logoArvya
    from '../assets/logo_sans_slogan-removebg-preview.png'

import './ForgotPassword.css'


function ForgotPassword() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [erreur, setErreur] = useState('')
    const [succes, setSucces] = useState('')
    const [chargement, setChargement] = useState(false)


    // =====================================
    // DEMANDE DE RÉINITIALISATION
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setErreur('')
        setSucces('')

        try {

            setChargement(true)

            const response = await fetch(
                'http://localhost:3000/auth/forgot-password',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            )


            const data = await response.json()


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de l'envoi de l'email"
                )

            }


            // On reste sur cette page.
            // Le lien de réinitialisation est envoyé par email.

            setSucces(data.message)


        } catch (error) {

            setErreur(error.message)

        } finally {

            setChargement(false)

        }

    }


    return (

        <div className="forgot-page">


            {/* RETOUR CONNEXION */}

            <button
                type="button"
                className="forgot-back"
                onClick={() =>
                    navigate('/login')
                }
            >

                <ArrowLeft size={16} />

                Retour à la connexion

            </button>



            <div className="forgot-card">


                {/* LOGO */}

                <img
                    src={logoArvya}
                    alt="ARVYA"
                    className="forgot-logo"
                />



                {/* ICÔNE */}

                <div className="forgot-icon">

                    {
                        succes
                            ? <Mail size={21} />
                            : <KeyRound size={21} />
                    }

                </div>



                {/* SI LE MAIL N'A PAS ENCORE ÉTÉ ENVOYÉ */}

                {!succes && (

                    <>

                        <h1>
                            Mot de passe oublié ?
                        </h1>

                        <p>
                            Saisissez l'adresse email associée
                            à votre compte ARVYA. Nous vous
                            enverrons un lien permettant de
                            créer un nouveau mot de passe.
                        </p>


                        <form
                            onSubmit={handleSubmit}
                            className="forgot-form"
                        >

                            <label htmlFor="email">

                                Adresse email

                            </label>


                            <input
                                id="email"
                                type="email"
                                placeholder="votre@email.fr"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />


                            {/* MESSAGE ERREUR */}

                            {erreur && (

                                <p className="forgot-error">

                                    {erreur}

                                </p>

                            )}


                            {/* BOUTON */}

                            <button
                                type="submit"
                                disabled={chargement}
                            >

                                {
                                    chargement
                                        ? 'Envoi en cours...'
                                        : 'Envoyer le lien'
                                }

                                {
                                    !chargement && (
                                        <ArrowRight size={16} />
                                    )
                                }

                            </button>

                        </form>

                    </>

                )}



                {/* ================================= */}
                {/* EMAIL ENVOYÉ */}
                {/* ================================= */}

                {succes && (

                    <div className="forgot-confirmation">

                        <h1>
                            Consultez vos emails
                        </h1>


                        <p>
                            Si un compte ARVYA correspond à
                            cette adresse, un email contenant
                            un lien de réinitialisation vient
                            d'être envoyé.
                        </p>


                        <div className="forgot-success">

                            {succes}

                        </div>


                        <p className="forgot-help">

                            Pensez également à vérifier votre
                            dossier de courriers indésirables.
                            Le lien est valable pendant
                            15 minutes.

                        </p>


                        <button
                            type="button"
                            className="forgot-login-button"
                            onClick={() =>
                                navigate('/login')
                            }
                        >

                            Retour à la connexion

                        </button>

                    </div>

                )}


            </div>

        </div>

    )

}


export default ForgotPassword