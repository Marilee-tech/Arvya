import { useNavigate } from 'react-router-dom'

import {
    ArrowRight,
    BookOpen,
    Users,
    ShieldCheck,
    CalendarDays
} from 'lucide-react'

import logoArvya from '../assets/logo_sans_slogan-removebg-preview.png'

import './Accueil.css'


function Accueil() {

    const navigate = useNavigate()


    return (

        <div className="home-page">


            {/* NAVBAR */}

            <header className="home-navbar">

                <img
                    src={logoArvya}
                    alt="Logo ARVYA"
                    className="home-logo"
                />


                <div className="home-navbar-actions">

                    <button
                        className="home-login-button"
                        onClick={() => navigate('/login')}
                    >
                        Se connecter
                    </button>


                    <button
                        className="home-register-button"
                        onClick={() => navigate('/register')}
                    >
                        Créer un compte
                    </button>

                </div>

            </header>


            {/* HERO */}

            <main className="home-main">


                <section className="home-hero">


                    <div className="home-hero-content">

                        <p className="home-eyebrow">
                            Le carnet de vie partagé
                        </p>


                        <h1>
                            Accompagner ensemble,
                            <span> simplement.</span>
                        </h1>


                        <p className="home-description">
                            ARVYA permet aux familles et aux professionnels
                            de partager les moments importants, les
                            transmissions et les rendez-vous autour d'une
                            personne accompagnée.
                        </p>


                        <div className="home-actions">

                            <button
                                className="home-primary-button"
                                onClick={() => navigate('/login')}
                            >
                                Se connecter

                                <ArrowRight size={17} />
                            </button>


                            <button
                                className="home-secondary-button"
                                onClick={() => navigate('/register')}
                            >
                                Créer un compte
                            </button>

                        </div>


                    </div>


                    {/* CARTE VISUELLE */}

                    <div className="home-preview">

                        <div className="preview-top">

                            <span className="preview-label">
                                Aujourd'hui
                            </span>

                            <span className="preview-status">
                                Tout va bien
                            </span>

                        </div>


                        <div className="preview-person">

                            <div className="preview-avatar">
                                YD
                            </div>

                            <div>
                                <strong>
                                    Yvonne Dupond
                                </strong>

                                <span>
                                    Personne accompagnée
                                </span>
                            </div>

                        </div>


                        <div className="preview-card">

                            <div className="preview-icon">
                                <BookOpen size={17} />
                            </div>

                            <div>
                                <span>
                                    Nouvelle transmission
                                </span>

                                <strong>
                                    Promenade de l'après-midi
                                </strong>
                            </div>

                        </div>


                        <div className="preview-card">

                            <div className="preview-icon">
                                <CalendarDays size={17} />
                            </div>

                            <div>
                                <span>
                                    Prochain rendez-vous
                                </span>

                                <strong>
                                    Médecin · 14h30
                                </strong>
                            </div>

                        </div>


                    </div>


                </section>


                {/* AVANTAGES */}

                <section className="home-features">


                    <article className="home-feature">

                        <div className="home-feature-icon">
                            <Users size={20} />
                        </div>

                        <h2>
                            Rester liés
                        </h2>

                        <p>
                            Familles et professionnels retrouvent
                            les informations essentielles au même endroit.
                        </p>

                    </article>


                    <article className="home-feature">

                        <div className="home-feature-icon">
                            <BookOpen size={20} />
                        </div>

                        <h2>
                            Garder une trace
                        </h2>

                        <p>
                            Les transmissions constituent progressivement
                            l'histoire du quotidien de la personne.
                        </p>

                    </article>


                    <article className="home-feature">

                        <div className="home-feature-icon">
                            <ShieldCheck size={20} />
                        </div>

                        <h2>
                            Partager sereinement
                        </h2>

                        <p>
                            Chaque utilisateur accède uniquement aux
                            informations correspondant à son rôle.
                        </p>

                    </article>


                </section>


            </main>


            <footer className="home-footer">

                <img
                    src={logoArvya}
                    alt="ARVYA"
                />

                <span>
                    Parce que chaque transmission raconte une histoire.
                </span>

            </footer>


        </div>

    )

}


export default Accueil