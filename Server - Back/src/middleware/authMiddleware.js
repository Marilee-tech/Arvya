import jwt from 'jsonwebtoken'


// =====================================
// VÉRIFICATION DU TOKEN
// =====================================

const verifyToken = (req, res, next) => {

    const token = req.cookies.token


    // =====================================
    // TOKEN ABSENT
    // =====================================

    if (!token) {
        return res.status(401).json({
            message: 'Token manquant'
        })
    }


    // =====================================
    // VÉRIFICATION DU JWT
    // =====================================

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded


        next()

    } catch (error) {

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