import express from 'express'
import { createNewAssociation, deleteOneAssociation, getAssociation, getAssociations, updateOneAssociation } from '../controllers/associationController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur'), getAssociations)
router.get('/:id', verifyToken, authorizeRoles('Administrateur'), getAssociation)
router.post('/', verifyToken, authorizeRoles('Administrateur'), createNewAssociation)
router.put('/:id', verifyToken, authorizeRoles('Administrateur'), updateOneAssociation)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur'), deleteOneAssociation)


export default router