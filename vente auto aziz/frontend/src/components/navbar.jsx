import { Link } from 'react-router-dom'
export default function Navbar() {
    const token = localStorage.getItem('token')
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'
    }
    return (
        <nav className="bg-white shadow p-4">
            <div className="container mx-auto flex justify-between">
                <Link to="/" className="font-bold text-xl">AutoCI</Link>
                <div className="flex gap-4 items-center">
                    <Link to="/cars">Voitures</Link>
                    {token ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={logout} className="px-3 py-1 border">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Se connecter</Link>
                            <Link to="/register">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}