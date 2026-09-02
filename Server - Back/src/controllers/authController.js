import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'

const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body

        const [rows] = await db.query(
            'SELECT * FROM Utilisateur WHERE email = ?',
            [email]
        )

        const utilisateur = rows[0]

        if (!utilisateur) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            })
        }

        if (utilisateur.statut === 'Inactif') {
            return res.status(403).json({
                message: 'Compte inactif'
            })
        }

        const motDePasseCorrect = await bcrypt.compare(
            motDePasse, // celui envoyé lors de la connexion
            utilisateur.mot_de_passe // le hash récupéré dans MySQL
        )

        if (!motDePasseCorrect) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            })
        }

        const token = jwt.sign(
            {
                id: utilisateur.id_utilisateur,
                role: utilisateur.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '1h'
            }
        )

        res.status(200).json({
            message: 'Connexion réussie',
            token: token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

export { login }