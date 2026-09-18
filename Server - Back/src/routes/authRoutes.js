import express from 'express'

import {
    login,
    register,
    forgotPassword,
    resetPassword,
    getMe,
    logout
} from '../controllers/authController.js'


// On importe le middleware qui vérifie
// notre cookie JWT.
import {
    verifyToken
} from '../middleware/authMiddleware.js'


const router = express.Router()


// =====================================
// ROUTES PUBLIQUES
// =====================================

// Ces routes ne nécessitent pas
// d'être déjà connecté.

router.post(
    '/login',
    login
)

router.post(
    '/register',
    register
)

router.post(
    '/forgot-password',
    forgotPassword
)

router.post(
    '/reset-password',
    resetPassword
)


// =====================================
// ROUTE PROTÉGÉE
// =====================================

// Pour accéder à /auth/me,
// la requête passe d'abord par verifyToken.
//
// verifyToken récupère :
// req.cookies.token
//
// Si le JWT est valide :
// req.user est créé
// puis getMe est exécuté.
//
// Sinon :
// réponse 401.
router.get(
    '/me',
    verifyToken,
    getMe
)

router.post(
    '/logout',
    logout
)


export default router