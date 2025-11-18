import { useEffect, useState } from 'react'

function ModelCard({ m }) {
  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5 hover:border-blue-400/40 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500/40 to-fuchsia-500/40 grid place-items-center text-white font-semibold">
          {m.name?.slice(0,1)?.toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-semibold">{m.name}</h3>
          <p className="text-blue-200/80 text-sm">{m.city} • {m.experience_years || 0} yrs exp</p>
        </div>
      </div>
      {m.skills && m.skills.length>0 && (
        <div className="flex flex-wrap gap-1.5">
          {m.skills.map((s, i) => (
            <span key={i} className="text-xs text-blue-300/90 bg-blue-500/10 px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ModelList({ backend }) {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchModels = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/models`)
      const data = await res.json()
      setModels(data)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchModels() }, [])

  if (loading) return <p className="text-blue-200">Loading models...</p>

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {models.map(m => <ModelCard key={m.id} m={m} />)}
      {models.length === 0 && (
        <div className="text-blue-200/80">No models yet. Create a profile to appear here.</div>
      )}
    </div>
  )
}
