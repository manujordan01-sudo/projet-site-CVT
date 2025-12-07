import { Routes, Route } from 'react-router-dom'
import Cars from './pages/cars'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Navbar from './components/navbar'
export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Cars />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </div>
    )
}