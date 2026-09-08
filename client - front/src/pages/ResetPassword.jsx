import { useState } from 'react'
import {
    useNavigate,
    useSearchParams
} from 'react-router-dom'

import {
    Eye,
    EyeOff,
    LockKeyhole
} from 'lucide-react'

import logoArvya from '../assets/logo_sans_slogan-removebg-preview.png'

import './ResetPassword.css'

function ResetPassword() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const token = searchParams.get('token')

    const [form, setForm] = useState({
        nouveauMotDePasse: '',
        confirmation: ''
    })

    const [afficher, setAfficher] = useState(false)
    const [erreur, setErreur] = useState('')
    const [succes, setSucces] = useState('')
    const [chargement, setChargement] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErreur('')
        setSucces('')

        if (!token) {
            setErreur(
                'Lien de réinitialisation invalide'
            )
            return
        }

        if (
            form.nouveauMotDePasse !==
            form.confirmation
        ) {
            setErreur(
                'Les mots de passe ne correspondent pas'
            )
            return
        }

        if (form.nouveauMotDePasse.length < 8) {
            setErreur(
                'Le mot de passe doit contenir au moins 8 caractères'
            )
            return
        }

        try {
            setChargement(true)

            const response = await fetch(
                'http://localhost:3000/auth/reset-password',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token,
                        nouveauMotDePasse:
                            form.nouveauMotDePasse
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Impossible de modifier le mot de passe'
                )
            }

            setSucces(
                'Votre mot de passe a été modifié.'
            )

            setTimeout(() => {
                navigate('/login')
            }, 1300)
        } catch (error) {
            setErreur(error.message)
        } finally {
            setChargement(false)
        }
    }

    return (
        <div className="reset-page">
            <div className="reset-card">
                <img
                    src={logoArvya}
                    alt="ARVYA"
                    className="reset-logo"
                />

                <div className="reset-icon">
                    <LockKeyhole size={21} />
                </div>

                <h1>
                    Nouveau mot de passe
                </h1>

                <p>
                    Choisissez un nouveau mot de passe
                    pour accéder à votre compte ARVYA.
                </p>

                <form
                    className="reset-form"
                    onSubmit={handleSubmit}
                >
                    <label>
                        Nouveau mot de passe
                    </label>

                    <div className="reset-password">
                        <input
                            type={
                                afficher
                                    ? 'text'
                                    : 'password'
                            }
                            placeholder="8 caractères minimum"
                            value={form.nouveauMotDePasse}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nouveauMotDePasse:
                                        e.target.value
                                })
                            }
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setAfficher(!afficher)
                            }
                        >
                            {afficher
                                ? <EyeOff size={16} />
                                : <Eye size={16} />}
                        </button>
                    </div>

                    <label>
                        Confirmer le mot de passe
                    </label>

                    <input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        value={form.confirmation}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                confirmation:
                                    e.target.value
                            })
                        }
                        required
                    />

                    {erreur && (
                        <p className="reset-error">
                            {erreur}
                        </p>
                    )}

                    {succes && (
                        <p className="reset-success">
                            {succes}
                        </p>
                    )}

                    <button
                        className="reset-submit"
                        type="submit"
                        disabled={chargement}
                    >
                        {chargement
                            ? 'Modification...'
                            : 'Modifier mon mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword