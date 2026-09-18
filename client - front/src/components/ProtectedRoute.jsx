import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({
    children,
    allowedRoles
}) {

    // null = vérification en cours
    // true = utilisateur authentifié
    // false = utilisateur non authentifié
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    // On stocke l'utilisateur renvoyé par /auth/me
    const [utilisateur, setUtilisateur] = useState(null)


    useEffect(() => {

        const verifierConnexion = async () => {

            try {

                // On demande au Backend :
                // "Est-ce que mon cookie correspond
                // à une session valide ?"
                const response = await fetch(
                    'http://localhost:3000/auth/me',
                    {
                        // Indispensable pour envoyer
                        // le cookie HttpOnly
                        credentials: 'include'
                    }
                )


                // Si le Backend répond 401, 403...
                // la session n'est pas valide.
                if (!response.ok) {

                    setIsAuthenticated(false)

                    return
                }


                const data = await response.json()


                // On récupère l'utilisateur directement
                // depuis le Backend.
                setUtilisateur(data.utilisateur)

                setIsAuthenticated(true)


            } catch (error) {

                console.error(
                    'Erreur vérification session :',
                    error
                )

                setIsAuthenticated(false)
            }
        }


        verifierConnexion()

    }, [])


    // =====================================
    // VÉRIFICATION EN COURS
    // =====================================

    // Pendant que React attend la réponse
    // de /auth/me, on évite de rediriger
    // prématurément vers /login.
    if (isAuthenticated === null) {

        return <p>Chargement...</p>
    }


    // =====================================
    // NON CONNECTÉ
    // =====================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }


    // =====================================
    // VÉRIFICATION DU RÔLE
    // =====================================

    if (
        allowedRoles &&
        !allowedRoles.includes(utilisateur.role)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        )
    }


    // =====================================
    // UTILISATEUR AUTORISÉ
    // =====================================

    return children
}


export default ProtectedRoute