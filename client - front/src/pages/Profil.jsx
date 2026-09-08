import { UserRound, Mail, ShieldCheck } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import './Profil.css'

function Profil() {

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )

    return (
        <div className="profil-layout">

            <Sidebar />

            <main className="profil-content">

                <section className="profil-header">
                    <h1>Mon profil</h1>
                    <p>
                        Retrouvez les informations liées à votre compte.
                    </p>
                </section>


                <section className="profil-card">

                    <div className="profil-identity">

                        <div className="profil-avatar">
                            {utilisateur?.prenom?.charAt(0)}
                            {utilisateur?.nom?.charAt(0)}
                        </div>

                        <div>
                            <h2>
                                {utilisateur?.prenom} {utilisateur?.nom}
                            </h2>

                            <span className="profil-role">
                                {utilisateur?.role}
                            </span>
                        </div>

                    </div>


                    <div className="profil-separator"></div>


                    <div className="profil-informations">

                        <div className="profil-information">

                            <div className="profil-information-icon">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <span>Nom complet</span>

                                <strong>
                                    {utilisateur?.prenom} {utilisateur?.nom}
                                </strong>
                            </div>

                        </div>


                        <div className="profil-information">

                            <div className="profil-information-icon">
                                <Mail size={18} />
                            </div>

                            <div>
                                <span>Adresse e-mail</span>

                                <strong>
                                    {utilisateur?.email || 'Non renseignée'}
                                </strong>
                            </div>

                        </div>


                        <div className="profil-information">

                            <div className="profil-information-icon">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <span>Type de compte</span>

                                <strong>
                                    {utilisateur?.role}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    )
}

export default Profil