import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'


// =========================
// PAGES PUBLIQUES
// =========================

import Accueil from './pages/Accueil.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'


// =========================
// DASHBOARD
// =========================

import DashboardChoice from './pages/DashboardChoice.jsx'


// =========================
// PROTECTION DES ROUTES
// =========================

import ProtectedRoute from './components/ProtectedRoute.jsx'


// =========================
// PAGES PARTAGÉES
// =========================

import Accompagnements from './pages/Accompagnements.jsx'
import AccompagnementDetail from './pages/AccompagnementDetail.jsx'

import CarnetDeVie from './pages/CarnetDeVie.jsx'
import Agenda from './pages/Agenda.jsx'
import Contacts from './pages/Contacts.jsx'
import Notifications from './pages/Notifications.jsx'
import Profil from './pages/Profil.jsx'


// =========================
// PROFESSIONNEL + ADMIN
// =========================

import NouvelleTransmission from './pages/NouvelleTransmission.jsx'
import NouveauRendezVous from './pages/NouveauRendezVous.jsx'
import NouveauContact from './pages/NouveauContact.jsx'


// =========================
// ADMIN
// =========================

import GestionUtilisateurs from './pages/GestionUtilisateurs.jsx'
import NouvelAjoutAdmin from './pages/NouvelAjoutAdmin.jsx'


function App() {

  return (

    <Routes>


      {/* ================================= */}
      {/* PAGE D'ACCUEIL PUBLIQUE */}
      {/* ================================= */}

      <Route
        path="/"
        element={<Accueil />}
      />


      {/* ================================= */}
      {/* CONNEXION */}
      {/* ================================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ================================= */}
      {/* INSCRIPTION */}
      {/* ================================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* ================================= */}
      {/* DASHBOARD */}
      {/* TOUS LES UTILISATEURS CONNECTÉS */}
      {/* ================================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>

            <DashboardChoice />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* ACCOMPAGNEMENTS */}
      {/* ================================= */}

      <Route
        path="/accompagnements"
        element={
          <ProtectedRoute>

            <Accompagnements />

          </ProtectedRoute>
        }
      />


      <Route
        path="/accompagnements/:id"
        element={
          <ProtectedRoute>

            <AccompagnementDetail />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* CARNET DE VIE */}
      {/* ================================= */}

      <Route
        path="/carnet-de-vie"
        element={
          <ProtectedRoute>

            <CarnetDeVie />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* AGENDA */}
      {/* ================================= */}

      <Route
        path="/agenda"
        element={
          <ProtectedRoute>

            <Agenda />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* CONTACTS */}
      {/* ================================= */}

      <Route
        path="/contacts"
        element={
          <ProtectedRoute>

            <Contacts />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* NOTIFICATIONS */}
      {/* ================================= */}

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>

            <Notifications />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* PROFIL */}
      {/* ================================= */}

      <Route
        path="/profil"
        element={
          <ProtectedRoute>

            <Profil />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* PROFESSIONNEL + ADMIN */}
      {/* ================================= */}

      <Route
        path="/nouvelle-transmission"
        element={
          <ProtectedRoute
            allowedRoles={[
              'Professionnel',
              'Administrateur'
            ]}
          >

            <NouvelleTransmission />

          </ProtectedRoute>
        }
      />


      <Route
        path="/nouveau-rendez-vous"
        element={
          <ProtectedRoute
            allowedRoles={[
              'Professionnel',
              'Administrateur'
            ]}
          >

            <NouveauRendezVous />

          </ProtectedRoute>
        }
      />


      <Route
        path="/accompagnements/:id/nouveau-contact"
        element={
          <ProtectedRoute
            allowedRoles={[
              'Professionnel',
              'Administrateur'
            ]}
          >

            <NouveauContact />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* ADMIN UNIQUEMENT */}
      {/* ================================= */}

      <Route
        path="/gestion-utilisateurs"
        element={
          <ProtectedRoute
            allowedRoles={[
              'Administrateur'
            ]}
          >

            <GestionUtilisateurs />

          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/ajouter"
        element={
          <ProtectedRoute
            allowedRoles={[
              'Administrateur'
            ]}
          >

            <NouvelAjoutAdmin />

          </ProtectedRoute>
        }
      />


      {/* ================================= */}
      {/* URL INCONNUE */}
      {/* ================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />


    </Routes>

  )

}


export default App
