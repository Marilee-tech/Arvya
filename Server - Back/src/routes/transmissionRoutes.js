import express from 'express'
import { createNewTransmission, deleteOneTransmission, getTransmission, getTransmissions, updateOneTransmission } from '../controllers/transmissionController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'


const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getTransmissions)
router.get('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getTransmission)
router.post('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), createNewTransmission)
router.put('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), updateOneTransmission)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), deleteOneTransmission)


export default router