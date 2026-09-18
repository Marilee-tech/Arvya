import { NavLink, useNavigate } from 'react-router-dom'

import './Sidebar.css'

import {
    House,
    BookOpen,
    Users,
    CalendarDays,
    Bell,
    UserRound,
    LogOut,
    Plus
} from 'lucide-react'

import logoArvya from '../assets/logo_sans_slogan-removebg-preview.png'


function Sidebar() {

    const navigate = useNavigate()

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )


    const handleAjouter = () => {

        if (utilisateur?.role === 'Administrateur') {

            navigate('/admin/ajouter')

            return
        }


        if (utilisateur?.role === 'Professionnel') {

            navigate('/nouvelle-transmission')

        }

    }


    const afficherAjouter =
        utilisateur?.role === 'Administrateur' ||
        utilisateur?.role === 'Professionnel'


    return (

        <aside className="sidebar">


            <div className="sidebar-logo">

                <img
                    src={logoArvya}
                    alt="Logo ARVYA"
                    className="sidebar-logo-image"
                />

            </div>


            {afficherAjouter && (

                <button
                    className="sidebar-add"
                    type="button"
                    onClick={handleAjouter}
                >

                    <Plus size={17} />

                    <span>Ajouter</span>

                </button>

            )}


            <nav className="sidebar-nav">


                <NavLink to="/dashboard">

                    <House size={17} />

                    Accueil

                </NavLink>


                <NavLink to="/carnet-de-vie">

                    <BookOpen size={17} />

                    Carnet de vie

                </NavLink>


                <NavLink to="/accompagnements">

                    <Users size={17} />

                    Mes accompagnements

                </NavLink>


                <NavLink to="/agenda">

                    <CalendarDays size={17} />

                    Agenda

                </NavLink>


                <NavLink to="/notifications">

                    <Bell size={17} />

                    Notifications

                </NavLink>


            </nav>


            <div className="sidebar-bottom">


                <NavLink to="/profil">

                    <UserRound size={17} />

                    <span>Mon profil</span>

                </NavLink>


                <button
                    className="logout-button"
                    type="button"
                    onClick={async () => {

                        try {

                            // On appelle le Backend pour lui demander
                            // de supprimer le cookie HttpOnly.
                            await fetch(
                                'http://localhost:3000/auth/logout',
                                {
                                    method: 'POST',

                                    // Permet d'envoyer le cookie
                                    // avec la requête.
                                    credentials: 'include'
                                }
                            )

                        } catch (error) {

                            console.error(
                                'Erreur lors de la déconnexion :',
                                error
                            )

                        } finally {

                            localStorage.removeItem('utilisateur')


                            // Retour vers la page de connexion.
                            navigate('/login')
                        }
                    }}
                >
                    <LogOut size={17} />
                    <span>Déconnexion</span>
                </button>


            </div>


        </aside>

    )

}


export default Sidebar