import { useEffect, useState } from 'react'

export function PostGigForm({ backend, onPosted }) {
  const [form, setForm] = useState({ title: '', club_name: '', city: '', date: '', pay: '', requirements: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const payload = {
      ...form,
      requirements: form.requirements ? form.requirements.split(',').map(s => s.trim()).filter(Boolean) : []
    }
    try {
      const res = await fetch(`${backend}/api/gigs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed')
      setMsg('Gig posted successfully!')
      setForm({ title: '', club_name: '', city: '', date: '', pay: '', requirements: '' })
      onPosted && onPosted()
    } catch (e) {
      setMsg('Could not post gig')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-slate-800/60 border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold">Post a Gig</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input required placeholder="Title e.g. VIP Hostess" className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input required placeholder="Club name" className="input" value={form.club_name} onChange={e=>setForm({...form,club_name:e.target.value})} />
        <input required placeholder="City" className="input" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
        <input required placeholder="Date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <input placeholder="Pay (optional)" className="input" value={form.pay} onChange={e=>setForm({...form,pay:e.target.value})} />
        <input placeholder="Requirements (comma separated)" className="input" value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})} />
      </div>
      <button disabled={loading} className="btn-primary">{loading? 'Posting...' : 'Post Gig'}</button>
      {msg && <p className="text-blue-200 text-sm">{msg}</p>}
    </form>
  )
}

export function CreateModelForm({ backend, onCreated }) {
  const [form, setForm] = useState({ name: '', city: '', skills: '', experience_years: 0, hourly_rate: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const payload = {
      ...form,
      experience_years: Number(form.experience_years || 0),
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : undefined,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : []
    }
    try {
      const res = await fetch(`${backend}/api/models`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed')
      setMsg('Profile created!')
      setForm({ name: '', city: '', skills: '', experience_years: 0, hourly_rate: '' })
      onCreated && onCreated()
    } catch (e) {
      setMsg('Could not create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-slate-800/60 border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold">Create Model Profile</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input required placeholder="Full name" className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input required placeholder="City" className="input" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
        <input placeholder="Skills (comma separated)" className="input" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
        <input type="number" placeholder="Experience (years)" className="input" value={form.experience_years} onChange={e=>setForm({...form,experience_years:e.target.value})} />
        <input type="number" placeholder="Hourly Rate (optional)" className="input" value={form.hourly_rate} onChange={e=>setForm({...form,hourly_rate:e.target.value})} />
      </div>
      <button disabled={loading} className="btn-primary">{loading? 'Creating...' : 'Create Profile'}</button>
      {msg && <p className="text-blue-200 text-sm">{msg}</p>}
    </form>
  )
}

// simple utility styles
export function Styles() {
  return (
    <style>{`
      .input { @apply w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40; }
      .btn-primary { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors; }
    `}</style>
  )
}
