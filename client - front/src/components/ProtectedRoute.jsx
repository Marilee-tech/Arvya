import { Navigate } from 'react-router-dom'


function ProtectedRoute({
    children,
    allowedRoles
}) {

    const token =
        localStorage.getItem('token')

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )


    // Pas connecté
    if (!token || !utilisateur) {

        return <Navigate to="/login" replace />

    }


    // Connecté mais mauvais rôle
    if (
        allowedRoles &&
        !allowedRoles.includes(utilisateur.role)
    ) {

        return <Navigate to="/dashboard" replace />

    }


    // Autorisé
    return children

}


export default ProtectedRoute