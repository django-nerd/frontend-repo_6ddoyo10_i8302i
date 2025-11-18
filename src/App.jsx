import { useEffect, useState } from 'react'
import Header from './components/Header'
import GigList from './components/GigList'
import ModelList from './components/ModelList'
import { PostGigForm, CreateModelForm, Styles } from './components/Forms'

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [view, setView] = useState('gigs')
  const [applyGig, setApplyGig] = useState(null)

  useEffect(() => {
    const handler = (e) => setApplyGig(e.detail)
    window.addEventListener('applyToGig', handler)
    return () => window.removeEventListener('applyToGig', handler)
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-50">
      <Styles />
      <Header onNavigate={setView} />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Find Hostesses for Your Club Night</h1>
          <p className="text-blue-300/80 mt-2">Club owners post gigs. Models create profiles and apply. Simple.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            {view === 'gigs' && <GigList backend={backend} />}
            {view === 'models' && <ModelList backend={backend} />}
          </div>
          <div className="space-y-6">
            {view === 'post' && <PostGigForm backend={backend} onPosted={() => window.location.reload()} />}
            {view === 'profile' && <CreateModelForm backend={backend} onCreated={() => window.location.reload()} />}

            {view !== 'post' && view !== 'profile' && (
              <div className="bg-slate-800/60 border border-white/10 p-5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Get Started</h3>
                <p className="text-blue-200/80 text-sm">- Club owners: Post a gig to receive applications.<br/>- Models: Create a profile to appear in searches.</p>
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
              <input name="modelId" placeholder="Your Model ID" className="input" />
              <textarea name="message" placeholder="Message (optional)" className="input" rows={3}></textarea>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setApplyGig(null)} className="px-3 py-2 rounded bg-slate-700 text-white">Cancel</button>
                <button className="btn-primary">Send Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-10 text-center text-blue-300/60 text-sm">
        © {new Date().getFullYear()} Hostess Board
      </footer>
    </div>
  )
}

export default App
