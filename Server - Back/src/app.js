import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import associationRoutes from './routes/associationRoutes.js'
import transmissionRoutes from './routes/transmissionRoutes.js'
import rendezvousRoutes from './routes/rendezvousRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: 'API ARVYA fonctionne'
    })
})

app.use('/users', userRoutes)
app.use('/patients', patientRoutes)
app.use('/contacts', contactRoutes)
app.use('/associations', associationRoutes)
app.use('/transmissions', transmissionRoutes)
app.use('/rendezvous', rendezvousRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await db.query('SELECT 1')
        console.log('Connexion MySQL réussie ✅')

        app.listen(PORT, () => {
            console.log(`Serveur ARVYA lancé sur le port ${PORT} 🚀`)
        })
    } catch (error) {
        console.error('Erreur de connexion à MySQL :', error.message)
    }
}

startServer()

