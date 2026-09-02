import express from 'express'
import { getPatient, getPatients, createNewPatient, updateOnePatient, deleteOnePatient } from '../controllers/patientController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getPatients)
router.get('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getPatient)
router.post('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), createNewPatient)
router.put('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), updateOnePatient)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), deleteOnePatient)


export default router