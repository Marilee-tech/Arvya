import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'
import transporter from '../config/mailer.js'


// =====================================
// CONNEXION
// =====================================

const login = async (req, res) => {
    try {
        // On récupère l'email et le mot de passe
        // envoyés depuis le formulaire de connexion.
        const {
            email,
            motDePasse
        } = req.body


        // =====================================
        // 1. RECHERCHE DE L'UTILISATEUR
        // =====================================

        // On recherche l'utilisateur grâce à son email.
        //
        // "est_bloque" vaudra :
        // 1 = le compte est actuellement bloqué
        // 0 = le compte n'est pas bloqué
        //
        // NOW() correspond à la date et l'heure
        // actuelles de MySQL.
        const [rows] = await db.query(
            `SELECT *,
                (
                    bloque_jusqua IS NOT NULL
                    AND bloque_jusqua > NOW()
                ) AS est_bloque
             FROM Utilisateur
             WHERE email = ?`,
            [email]
        )

        // On récupère le premier utilisateur trouvé.
        const utilisateur = rows[0]


        // =====================================
        // 2. UTILISATEUR INTROUVABLE
        // =====================================

        // Si aucun utilisateur ne correspond à cet email,
        // on refuse la connexion.
        //
        // On reste volontairement vague :
        // on ne précise pas si c'est l'email
        // ou le mot de passe qui est incorrect.
        if (!utilisateur) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            })
        }


        // =====================================
        // 3. VÉRIFICATION DU STATUT
        // =====================================

        // Un compte avec le statut "Inactif"
        // n'a pas le droit de se connecter.
        if (utilisateur.statut === 'Inactif') {
            return res.status(403).json({
                message: 'Compte inactif'
            })
        }


        // =====================================
        // 4. COMPTE TEMPORAIREMENT BLOQUÉ
        // =====================================

        // Si est_bloque vaut 1,
        // cela signifie que bloque_jusqua
        // contient une date située dans le futur.
        //
        // On refuse donc immédiatement la connexion.
        if (utilisateur.est_bloque) {
            return res.status(429).json({
                message:
                    'Trop de tentatives de connexion. Réessayez dans quelques minutes.'
            })
        }


        // =====================================
        // 5. BLOCAGE EXPIRÉ
        // =====================================

        // Si bloque_jusqua contient encore une date
        // mais que est_bloque vaut 0,
        // cela signifie que les 5 minutes sont terminées.
        //
        // On remet donc le compteur à zéro
        // et on supprime la date de blocage.
        if (utilisateur.bloque_jusqua) {
            await db.query(
                `UPDATE Utilisateur
                 SET tentatives_connexion = 0,
                     bloque_jusqua = NULL
                 WHERE id_utilisateur = ?`,
                [utilisateur.id_utilisateur]
            )

            // On met également à jour la valeur
            // dans notre objet JavaScript.
            utilisateur.tentatives_connexion = 0
        }


        // =====================================
        // 6. VÉRIFICATION DU MOT DE PASSE
        // =====================================

        // bcrypt.compare compare :
        // - le mot de passe saisi par l'utilisateur
        // - le mot de passe haché enregistré dans MySQL
        //
        // Le résultat est true ou false.
        const motDePasseCorrect = await bcrypt.compare(
            motDePasse,
            utilisateur.mot_de_passe
        )


        // =====================================
        // 7. MAUVAIS MOT DE PASSE
        // =====================================

        if (!motDePasseCorrect) {

            // On récupère le nombre de tentatives actuel
            // puis on ajoute 1.
            const nouvellesTentatives =
                utilisateur.tentatives_connexion + 1


            // =====================================
            // 3e TENTATIVE INCORRECTE
            // =====================================

            // À partir de la troisième erreur,
            // le compte est bloqué pendant 5 minutes.
            if (nouvellesTentatives >= 3) {

                await db.query(
                    `UPDATE Utilisateur
                     SET tentatives_connexion = ?,
                         bloque_jusqua =
                            DATE_ADD(NOW(), INTERVAL 5 MINUTE)
                     WHERE id_utilisateur = ?`,
                    [
                        nouvellesTentatives,
                        utilisateur.id_utilisateur
                    ]
                )

                return res.status(429).json({
                    message:
                        'Trop de tentatives de connexion. Compte bloqué pendant 5 minutes.'
                })
            }


            // =====================================
            // 1re OU 2e TENTATIVE INCORRECTE
            // =====================================

            // Le compte n'est pas encore bloqué.
            // On enregistre simplement le nouveau
            // nombre de tentatives dans MySQL.
            await db.query(
                `UPDATE Utilisateur
                 SET tentatives_connexion = ?
                 WHERE id_utilisateur = ?`,
                [
                    nouvellesTentatives,
                    utilisateur.id_utilisateur
                ]
            )

            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            })
        }


        // =====================================
        // 8. CONNEXION RÉUSSIE
        // =====================================

        // Si le mot de passe est correct,
        // on remet le compteur de tentatives à zéro.
        //
        // On supprime également une éventuelle
        // ancienne date de blocage.
        await db.query(
            `UPDATE Utilisateur
             SET tentatives_connexion = 0,
                 bloque_jusqua = NULL
             WHERE id_utilisateur = ?`,
            [utilisateur.id_utilisateur]
        )


        // =====================================
        // 9. CRÉATION DU JWT
        // =====================================

        // On crée le JWT contenant uniquement
        // les informations nécessaires à l'authentification.
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


        // =====================================
        // 10. STOCKAGE DU JWT DANS UN COOKIE
        // =====================================

        // Au lieu de laisser JavaScript gérer directement
        // le JWT, le serveur l'enregistre dans un cookie.
        //
        // Le navigateur conservera ensuite ce cookie
        // et pourra l'envoyer automatiquement au Backend.
        res.cookie('token', token, {

            // HttpOnly empêche JavaScript côté navigateur
            // de lire directement le contenu du cookie.
            httpOnly: true,

            // En développement nous travaillons en HTTP.
            // En production avec HTTPS, secure sera activé.
            secure: process.env.NODE_ENV === 'production',

            // Limite l'envoi du cookie dans certains
            // contextes provenant d'autres sites.
            sameSite: 'lax',

            // Durée du cookie : 1 heure.
            // maxAge est exprimé en millisecondes.
            maxAge: 60 * 60 * 1000
        })


        // =====================================
        // 11. RÉPONSE AU FRONTEND
        // =====================================

        res.status(200).json({
            message: 'Connexion réussie',

            utilisateur: {
                id: utilisateur.id_utilisateur,
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        })

    } catch (error) {

        // Si une erreur inattendue se produit,
        // elle est affichée dans le terminal.
        console.log(error)

        res.status(500).json({
            message: 'Erreur serveur'
        })
    }
}

// =====================================
// UTILISATEUR CONNECTÉ
// =====================================

const getMe = async (req, res) => {
    try {

        // req.user est créé par verifyToken.
        //
        // Le middleware a déjà :
        // 1. récupéré le cookie
        // 2. vérifié le JWT
        // 3. placé son contenu dans req.user
        const idUtilisateur = req.user.id


        // On récupère les informations actuelles
        // de l'utilisateur directement dans MySQL.
        //
        // On ne récupère volontairement PAS
        // le mot de passe.
        const [rows] = await db.query(
            `SELECT
                id_utilisateur,
                prenom,
                nom,
                email,
                role,
                statut
             FROM Utilisateur
             WHERE id_utilisateur = ?`,
            [idUtilisateur]
        )


        const utilisateur = rows[0]


        // Si l'utilisateur contenu dans le JWT
        // n'existe plus dans la base.
        if (!utilisateur) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            })
        }


        // Si le compte a été désactivé après
        // la création de sa session.
        if (utilisateur.statut === 'Inactif') {
            return res.status(403).json({
                message: 'Compte inactif'
            })
        }


        // Tout est valide.
        // On renvoie les informations utiles
        // au Frontend.
        res.status(200).json({
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
// DÉCONNEXION
// =====================================

const logout = (req, res) => {

    // Le cookie est HttpOnly.
    // React ne peut donc pas le supprimer directement.
    //
    // C'est le Backend qui doit demander
    // au navigateur de supprimer le cookie.
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })


    res.status(200).json({
        message: 'Déconnexion réussie'
    })
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
    resetPassword,
    getMe,
    logout
}