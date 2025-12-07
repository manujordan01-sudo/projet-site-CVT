export default function SearchBar({ value, onChange }) {
    return (
        <div className="w-full">
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Rechercher..."
                className="w-full p-2 border rounded"
            />
        </div>
    )
}
