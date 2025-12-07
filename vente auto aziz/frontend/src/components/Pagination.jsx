export default function Pagination({ page, setPage, pages }) {
    const prev = () => setPage(p => Math.max(1, p - 1))
    const next = () => setPage(p => Math.min(pages, p + 1))
    return (
        <div className="mt-4 flex items-center gap-2">
            <button onClick={prev} className="px-3 py-1 border">Préc</button>
            <span>Page {page} / {pages}</span>
            <button onClick={next} className="px-3 py-1 border">Suiv</button>
        </div>
    )
}
