import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'
import transporter from '../config/mailer.js'


// =====================================
// CONNEXION
// =====================================

const login = async (req, res) => {

    try {

        const {
            email,
            motDePasse
        } = req.body


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


        const motDePasseCorrect =
            await bcrypt.compare(
                motDePasse,
                utilisateur.mot_de_passe
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

            token: token,

            utilisateur: {

                id: utilisateur.id_utilisateur,

                prenom: utilisateur.prenom,

                nom: utilisateur.nom,

                email: utilisateur.email,

                role: utilisateur.role

            }

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })

    }

}



// =====================================
// INSCRIPTION PUBLIQUE
// =====================================

const register = async (req, res) => {

    try {

        const {
            prenom,
            nom,
            nomUtilisateur,
            email,
            motDePasse
        } = req.body


        // Vérification des champs obligatoires

        if (
            !prenom ||
            !nom ||
            !nomUtilisateur ||
            !email ||
            !motDePasse
        ) {

            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            })

        }


        // Vérification longueur mot de passe

        if (motDePasse.length < 8) {

            return res.status(400).json({
                message:
                    'Le mot de passe doit contenir au moins 8 caractères'
            })

        }


        // Vérifie si email ou nom utilisateur existe déjà

        const [utilisateursExistants] =
            await db.query(
                `SELECT id_utilisateur
         FROM Utilisateur
         WHERE email = ?
         OR nom_utilisateur = ?`,
                [
                    email,
                    nomUtilisateur
                ]
            )


        if (utilisateursExistants.length > 0) {

            return res.status(409).json({
                message:
                    'Cet email ou ce nom d’utilisateur est déjà utilisé'
            })

        }


        // Hash du mot de passe

        const motDePasseHash =
            await bcrypt.hash(
                motDePasse,
                10
            )


        // Création du compte
        // Une inscription publique crée uniquement
        // un compte Famille

        const [resultat] =
            await db.query(
                `INSERT INTO Utilisateur
        (
          prenom,
          nom,
          nom_utilisateur,
          email,
          mot_de_passe,
          role,
          statut
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    prenom,
                    nom,
                    nomUtilisateur,
                    email,
                    motDePasseHash,
                    'Famille',
                    'Actif'
                ]
            )


        res.status(201).json({

            message:
                'Compte créé avec succès',

            id_utilisateur:
                resultat.insertId

        })


    } catch (error) {

        console.log(error)

        res.status(500).json({
            message:
                'Erreur lors de la création du compte'
        })

    }

}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: 'Adresse email obligatoire'
            })
        }

        const [rows] = await db.query(
            `SELECT id_utilisateur, email, prenom
       FROM Utilisateur
       WHERE email = ?`,
            [email]
        )

        const utilisateur = rows[0]


        // On affiche volontairement le même message
        // même si l'adresse n'existe pas.
        if (!utilisateur) {
            return res.status(200).json({
                message:
                    'Si un compte correspond à cette adresse, un email de réinitialisation a été envoyé.'
            })
        }


        // Création d'un token valable 15 minutes
        const resetToken = jwt.sign(
            {
                id: utilisateur.id_utilisateur,
                type: 'reset-password'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '15m'
            }
        )


        // Lien envoyé par email
        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`


        // Envoi du mail
        await transporter.sendMail({
            from: `"ARVYA" <${process.env.EMAIL_USER}>`,

            to: utilisateur.email,

            subject:
                'Réinitialisation de votre mot de passe ARVYA',

            html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 560px;
          margin: auto;
          padding: 30px;
          color: #30352e;
        ">

          <h2 style="
            color: #52674b;
            margin-bottom: 20px;
          ">
            ARVYA
          </h2>

          <p>
            Bonjour ${utilisateur.prenom},
          </p>

          <p>
            Vous avez demandé à réinitialiser
            votre mot de passe ARVYA.
          </p>

          <p>
            Cliquez sur le bouton ci-dessous
            pour choisir un nouveau mot de passe.
          </p>

          <div style="
            margin: 30px 0;
          ">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 13px 22px;
                background: #52674b;
                color: white;
                text-decoration: none;
                border-radius: 8px;
              "
            >
              Réinitialiser mon mot de passe
            </a>
          </div>

          <p style="
            color: #777;
            font-size: 13px;
          ">
            Ce lien est valable pendant 15 minutes.
          </p>

          <p style="
            color: #777;
            font-size: 13px;
          ">
            Si vous n'êtes pas à l'origine de cette
            demande, vous pouvez ignorer cet email.
          </p>

        </div>
      `
        })


        res.status(200).json({
            message:
                'Si un compte correspond à cette adresse, un email de réinitialisation a été envoyé.'
        })

    } catch (error) {
        console.log(
            'Erreur forgot password :',
            error
        )

        res.status(500).json({
            message:
                "Erreur lors de l'envoi de l'email"
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        const {
            token,
            nouveauMotDePasse
        } = req.body

        if (!token || !nouveauMotDePasse) {
            return res.status(400).json({
                message: 'Informations manquantes'
            })
        }

        if (nouveauMotDePasse.length < 8) {
            return res.status(400).json({
                message:
                    'Le mot de passe doit contenir au moins 8 caractères'
            })
        }

        let decoded

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            )
        } catch {
            return res.status(401).json({
                message:
                    'Lien de réinitialisation invalide ou expiré'
            })
        }

        if (decoded.type !== 'reset-password') {
            return res.status(401).json({
                message:
                    'Token de réinitialisation invalide'
            })
        }

        const motDePasseHash = await bcrypt.hash(
            nouveauMotDePasse,
            10
        )

        const [resultat] = await db.query(
            `UPDATE Utilisateur
       SET mot_de_passe = ?
       WHERE id_utilisateur = ?`,
            [
                motDePasseHash,
                decoded.id
            ]
        )

        if (resultat.affectedRows === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            })
        }

        res.status(200).json({
            message:
                'Mot de passe modifié avec succès'
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message:
                'Erreur lors de la réinitialisation du mot de passe'
        })
    }
}


export {
    login,
    register,
    forgotPassword,
    resetPassword
}