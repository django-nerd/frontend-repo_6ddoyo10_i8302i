import { useEffect, useState } from 'react'

export default function Dashboard({ backend }) {
  const [talentId, setTalentId] = useState(localStorage.getItem('vip_talent_id') || '')
  const [status, setStatus] = useState(localStorage.getItem('vip_status') || 'Online')
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { localStorage.setItem('vip_status', status) }, [status])
  useEffect(() => { if (talentId) localStorage.setItem('vip_talent_id', talentId) }, [talentId])

  const load = async () => {
    if (!talentId) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/contracts?talent_id=${encodeURIComponent(talentId)}`)
      const data = await res.json()
      setContracts(Array.isArray(data) ? data : [])
    } catch { /* noop */ }
    setLoading(false)
  }
  useEffect(() => { load() }, [talentId])

  const check = async (id, type) => {
    setMsg('')
    try {
      const res = await fetch(`${backend}/api/contracts/${id}/${type}`, { method: 'POST' })
      if (!res.ok) throw new Error('bad')
      setMsg(type === 'checkin' ? 'Checked in' : 'Checked out')
      load()
    } catch {
      setMsg('Action failed')
    }
  }

  const pending = contracts.filter(c => c.status === 'pending').length
  const upcoming = contracts.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400/30 to-yellow-200/20 grid place-items-center text-yellow-200 font-bold">VIP</div>
          <div className="flex-1">
            <div className="text-white font-semibold">Talent Dashboard</div>
            <div className="text-yellow-200/80 text-xs">Mobile-first safety hub</div>
          </div>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-slate-900/60 border border-yellow-400/20 text-yellow-100 text-xs rounded px-2 py-1">
            <option>Online</option>
            <option>Offline</option>
            <option>On Duty</option>
          </select>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input placeholder="Your Talent ID (saved)" value={talentId} onChange={e=>setTalentId(e.target.value)} className="input" />
          <button onClick={load} className="btn-primary bg-yellow-500 hover:bg-yellow-600">Refresh</button>
        </div>
      </div>

      {pending > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-400/30 text-yellow-100 rounded-xl p-3">
          {pending} Pending Contract{pending>1?'s':''} — review & sign in Messaging (Info → Contract)
        </div>
      )}

      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
        <div className="text-white font-semibold mb-2">Upcoming Gigs</div>
        {loading && <div className="text-blue-200">Loading…</div>}
        {!loading && upcoming.length === 0 && (
          <div className="text-blue-200/80 text-sm">No upcoming gigs yet.</div>
        )}
        <div className="space-y-3">
          {upcoming.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
              <div>
                <div className="text-white text-sm font-medium">{c.venue} — {c.city}</div>
                <div className="text-blue-200/80 text-xs">{c.role} • {c.date} • Base {c.base_pay}</div>
              </div>
              <div className="flex gap-2">
                {!c.check_in && (
                  <button onClick={()=>check(c.id,'checkin')} className="px-3 py-1.5 rounded bg-emerald-500 text-white text-xs">Check-In</button>
                )}
                {c.check_in && !c.check_out && (
                  <button onClick={()=>check(c.id,'checkout')} className="px-3 py-1.5 rounded bg-fuchsia-500 text-white text-xs">Check-Out</button>
                )}
              </div>
            </div>
          ))}
        </div>
        {msg && <div className="mt-3 text-blue-200 text-sm">{msg}</div>}
      </div>

      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
        <div className="text-white font-semibold mb-2">Quick Links</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <a href="#" onClick={(e)=>{e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate',{detail:'gigs'}))}} className="bg-slate-900/50 rounded-lg p-3 text-blue-200 hover:text-white">Browse Jobs</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate',{detail:'messaging'}))}} className="bg-slate-900/50 rounded-lg p-3 text-blue-200 hover:text-white">Messaging</a>
          <a href="#" onClick={(e)=>e.preventDefault()} className="bg-slate-900/50 rounded-lg p-3 text-blue-200 hover:text-white">My Calendar</a>
        </div>
      </div>
    </div>
  )
}
