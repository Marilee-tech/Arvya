import express from 'express'
import { getRendezVous, getOneRendezVous, createNewRendezVous, updateOneRendezVous, deleteOneRendezVous } from '../controllers/rendezvousController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getRendezVous)
router.get('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getOneRendezVous)
router.post('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), createNewRendezVous)
router.put('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), updateOneRendezVous)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), deleteOneRendezVous)


export default router