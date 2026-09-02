import express from 'express'
import { getContact, getContacts, createNewContact, updateOneContact, deleteOneContact } from '../controllers/contactController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getContacts)
router.get('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel', 'Famille'), getContact)
router.post('/', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), createNewContact)
router.put('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), updateOneContact)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur', 'Professionnel'), deleteOneContact)


export default router