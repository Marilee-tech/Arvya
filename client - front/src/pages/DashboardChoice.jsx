import Dashboard from './Dashboard.jsx'
import DashboardPro from './DashboardPro.jsx'
import DashboardAdmin from './DashboardAdmin.jsx'


function DashboardChoice() {

    const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur')
    )


    if (utilisateur?.role === 'Professionnel') {
        return <DashboardPro />
    }


    if (utilisateur?.role === 'Administrateur') {
        return <DashboardAdmin />
    }


    return <Dashboard />

}


export default DashboardChoice