import { useEffect, useState } from 'react'
import API from '../api/api'
import CarCard from '../components/carcard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
export default function Cars() {
    const [cars, setCars] = useState([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [q, setQ] = useState('')
    useEffect(() => { fetchCars() }, [page, q])
    async function fetchCars() {
        const res = await API.get('/cars', { params: { page, q, limit: 12 } })
        setCars(res.data.cars)
        setPages(res.data.pages)
    }
    return (
        <div className="container mx-auto p-4">
            <SearchBar value={q} onChange={setQ} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6
mt-6">
                {cars.map(c => <CarCard key={c._id} car={c} />)}
            </div>
            <Pagination page={page} setPage={setPage} pages={pages} />
        </div>
    )
}