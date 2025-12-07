import { Routes, Route, Link } from 'react-router-dom'
import AdminCars from './AdminCars'
export default function Dashboard() {
    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-4 mb-4">
                <Link to="/dashboard/cars" className="px-3 py-1 border">Mes
                    annonces</Link>
                <Link to="/dashboard/create" className="px-3 py-1 border">Créer
                    annonce</Link>
            </div>
            <Routes>
                <Route path="/" element={<h3>Bienvenue</h3>} />
                <Route path="cars" element={<AdminCars />} />
            </Routes>
        </div>
    )
}