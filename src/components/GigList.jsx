import { useEffect, useState } from 'react'

function GigCard({ gig, onApply }) {
  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5 hover:border-blue-400/40 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-lg">{gig.title}</h3>
        <span className="text-xs text-blue-300/80 bg-blue-500/10 px-2 py-1 rounded">{gig.city}</span>
      </div>
      <p className="text-blue-200/80 text-sm mb-2">{gig.club_name} • {gig.date}</p>
      {gig.pay && <p className="text-blue-100 text-sm mb-2">Pay: {gig.pay}</p>}
      {gig.requirements && gig.requirements.length > 0 && (
        <p className="text-blue-300/80 text-xs">Req: {gig.requirements.join(', ')}</p>
      )}
      <div className="mt-4 flex gap-2">
        <button onClick={() => onApply(gig)} className="px-3 py-1.5 rounded bg-blue-500 text-white text-sm hover:bg-blue-600">Apply</button>
      </div>
    </div>
  )
}

export default function GigList({ backend }) {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchGigs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/gigs`)
      const data = await res.json()
      setGigs(data)
    } catch (e) {
      setError('Could not load gigs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGigs() }, [])

  const onApply = (gig) => {
    const evt = new CustomEvent('applyToGig', { detail: gig })
    window.dispatchEvent(evt)
  }

  if (loading) return <p className="text-blue-200">Loading gigs...</p>
  if (error) return <p className="text-red-300">{error}</p>

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {gigs.map(g => <GigCard key={g.id} gig={g} onApply={onApply} />)}
      {gigs.length === 0 && (
        <div className="text-blue-200/80">No gigs yet. Be the first to post.</div>
      )}
    </div>
  )
}
