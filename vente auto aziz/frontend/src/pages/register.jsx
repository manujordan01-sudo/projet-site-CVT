import { useState } from 'react'
import API from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await API.post('/auth/register', { name, email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        nav('/')
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold">S'inscrire</h2>
                <input className="mt-4" placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
                <input className="mt-4" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="mt-4" placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">S'inscrire</button>
            </form>
        </div>
    )
}
