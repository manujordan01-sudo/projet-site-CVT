import { Link } from 'react-router-dom'

export default function CarCard({ car }) {
    const image = car.images?.[0] ? `http://localhost:5000/${car.images[0]}` : '/placeholder-car.jpg'
    return (
        <div className="bg-white p-4 rounded shadow">
            <img src={image} alt={car.title} className="h-48 w-full object-cover rounded" />
            <h3 className="mt-2 font-semibold">{car.title}</h3>
            <p className="text-orange-600 font-bold">{car.price?.toLocaleString()} {car.currency || 'FCFA'}</p>
            <div className="mt-2 flex justify-between items-center">
                <Link to={`/cars/${car._id}`} className="text-sm underline">Voir</Link>
                <span className="text-sm text-gray-500">{car.year}</span>
            </div>
        </div>
    )
}