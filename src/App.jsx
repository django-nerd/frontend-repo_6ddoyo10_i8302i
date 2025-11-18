import { useEffect, useState } from 'react'
import Header from './components/Header'
import GigList from './components/GigList'
import ModelList from './components/ModelList'
import { PostGigForm, CreateModelForm, Styles } from './components/Forms'
import ModalsGallery from './components/ModalsGallery'
import Dashboard from './components/Dashboard'
import Messaging from './components/Messaging'

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [view, setView] = useState('dashboard')
  const [applyGig, setApplyGig] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  useEffect(() => {
    const handler = (e) => setApplyGig(e.detail)
    const nav = (e) => setView(e.detail)
    window.addEventListener('applyToGig', handler)
    window.addEventListener('navigate', nav)
    return () => { window.removeEventListener('applyToGig', handler); window.removeEventListener('navigate', nav) }
  }, [])

  const seed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch(`${backend}/api/seed`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error('Failed')
      setSeedMsg('Demo data added. Refreshing lists...')
      setTimeout(() => window.location.reload(), 800)
    } catch {
      setSeedMsg('Could not add demo data.')
    } finally {
      setSeeding(false)
    }
  }

  const apply = async (e) => {
    e.preventDefault()
    const modelId = e.target.modelId.value.trim()
    const message = e.target.message.value.trim()
    if (!modelId) return
    const payload = { gig_id: applyGig.id, model_id: modelId, message }
    try {
      const res = await fetch(`${backend}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        alert('Applied!')
        setApplyGig(null)
      } else {
        const t = await res.text(); alert('Failed: ' + t)
      }
    } catch(err) {
      alert('Error applying')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-blue-50">
      <Styles />
      <Header onNavigate={setView} />

      <section className="max-w-xl sm:max-w-3xl lg:max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-yellow-100">The V.I.P. Talent Network</h1>
          <p className="text-yellow-200/70 mt-1">Secure, professional, mobile-first hiring — Toronto, Burlington, Hamilton</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={seed} disabled={seeding} className="btn-primary bg-yellow-500 hover:bg-yellow-600">
              {seeding ? 'Adding demo data…' : 'Load Ontario demo data'}
            </button>
            {seedMsg && <span className="text-yellow-200/80 text-sm">{seedMsg}</span>}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            {view === 'dashboard' && <Dashboard backend={backend} />}
            {view === 'gigs' && <GigList backend={backend} />}
            {view === 'models' && <ModelList backend={backend} />}
            {view === 'messaging' && <Messaging backend={backend} />}

            <ModalsGallery />
          </div>
          <div className="space-y-6">
            {view === 'post' && <PostGigForm backend={backend} onPosted={() => window.location.reload()} />}
            {view === 'profile' && <CreateModelForm backend={backend} onCreated={() => window.location.reload()} />}

            {view !== 'post' && view !== 'profile' && (
              <div className="bg-slate-800/60 border border-white/10 p-5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Safety & Compliance</h3>
                <p className="text-blue-200/80 text-sm">All communications are logged. External contact sharing triggers a safety warning. Every confirmed booking creates a digital contract and populates your in-app calendar.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {applyGig && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-5">
            <h3 className="text-white font-semibold mb-2">Apply to: {applyGig.title}</h3>
            <p className="text-blue-200/80 text-sm mb-4">{applyGig.club_name} • {applyGig.city} • {applyGig.date}</p>
            <form onSubmit={apply} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <select name="shift" className="input">
                  <option>Early (9PM-11PM)</option>
                  <option>Peak (11PM-2AM)</option>
                  <option>Late (1AM-3AM)</option>
                  <option>Whole night</option>
                </select>
                <input name="modelId" placeholder="Your Talent ID" className="input" />
              </div>
              <textarea name="message" placeholder="Message (optional)" className="input" rows={3}></textarea>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setApplyGig(null)} className="px-3 py-2 rounded bg-slate-700 text-white">Cancel</button>
                <button className="btn-primary bg-yellow-500 hover:bg-yellow-600">Send Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-10 text-center text-yellow-200/60 text-sm">
        © {new Date().getFullYear()} V.I.P. Talent Network
      </footer>
    </div>
  )
}

export default App
