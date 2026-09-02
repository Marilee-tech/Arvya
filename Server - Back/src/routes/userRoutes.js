import express from 'express'
import { getUsers, getUser, createNewUser, updateOneUser, deleteOneUser } from '../controllers/userController.js'
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, authorizeRoles('Administrateur'), getUsers)
router.get('/:id', verifyToken, authorizeRoles('Administrateur'), getUser)
router.post('/', verifyToken, authorizeRoles('Administrateur'), createNewUser)
router.put('/:id', verifyToken, authorizeRoles('Administrateur'), updateOneUser)
router.delete('/:id', verifyToken, authorizeRoles('Administrateur'), deleteOneUser)

export default router