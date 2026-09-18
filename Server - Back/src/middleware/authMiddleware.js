import jwt from 'jsonwebtoken'


// =====================================
// VÉRIFICATION DU TOKEN
// =====================================

const verifyToken = (req, res, next) => {

    // Le JWT est maintenant stocké dans
    // un cookie HttpOnly nommé "token".
    //
    // cookie-parser permet d'accéder
    // aux cookies avec req.cookies.
    const token = req.cookies.token


    // =====================================
    // TOKEN ABSENT
    // =====================================

    // Si aucun cookie "token" n'est présent,
    // l'utilisateur n'est pas authentifié.
    if (!token) {
        return res.status(401).json({
            message: 'Token manquant'
        })
    }


    // =====================================
    // VÉRIFICATION DU JWT
    // =====================================

    try {

        // jwt.verify vérifie :
        // - que le token est valide
        // - qu'il a été signé avec notre JWT_SECRET
        // - qu'il n'est pas expiré
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )


        // Le contenu du JWT est enregistré
        // dans req.user.
        //
        // Dans ARVYA, il contient notamment :
        // {
        //     id: ...,
        //     role: ...
        // }
        //
        // Les routes suivantes peuvent donc
        // savoir quel utilisateur est connecté.
        req.user = decoded


        // Tout est valide :
        // Express peut continuer vers
        // le prochain middleware ou contrôleur.
        next()

    } catch (error) {

        // Token invalide ou expiré :
        // l'accès à la route est refusé.
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        })
    }
}


// =====================================
// AUTORISATION SELON LE RÔLE
// =====================================

const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        // req.user a été créé juste avant
        // par verifyToken.
        //
        // On vérifie que le rôle contenu
        // dans le JWT fait partie des rôles
        // autorisés pour cette route.
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: 'Accès refusé'
            })
        }


        // Le rôle est autorisé :
        // la requête peut continuer.
        next()
    }
}


export {
    verifyToken,
    authorizeRoles
}