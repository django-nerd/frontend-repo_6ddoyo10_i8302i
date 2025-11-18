import { useState } from 'react'

function Header({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const nav = (key) => { onNavigate(key); setOpen(false) }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur border-b border-yellow-500/20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-yellow-500/20 border border-yellow-400/40 grid place-items-center text-yellow-200 font-bold">VIP</div>
          <span className="text-yellow-100 font-semibold tracking-tight">V.I.P. Talent Network</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => nav('dashboard')} className="text-yellow-200/80 hover:text-yellow-100">Home</button>
          <button onClick={() => nav('gigs')} className="text-yellow-200/80 hover:text-yellow-100">Jobs</button>
          <button onClick={() => nav('models')} className="text-yellow-200/80 hover:text-yellow-100">Talent</button>
          <button onClick={() => nav('messaging')} className="text-yellow-200/80 hover:text-yellow-100">Messaging</button>
          <button onClick={() => nav('post')} className="text-yellow-200/80 hover:text-yellow-100">Post a Gig</button>
          <button onClick={() => nav('profile')} className="text-yellow-200/80 hover:text-yellow-100">Create Profile</button>
          <a href="/test" className="text-yellow-200/80 hover:text-yellow-100">System</a>
        </nav>
        <button className="md:hidden text-yellow-200" onClick={() => setOpen(!open)}>
          <span className="sr-only">Toggle</span>☰
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <button onClick={() => nav('dashboard')} className="block w-full text-left text-yellow-200/90">Home</button>
          <button onClick={() => nav('gigs')} className="block w-full text-left text-yellow-200/90">Jobs</button>
          <button onClick={() => nav('models')} className="block w-full text-left text-yellow-200/90">Talent</button>
          <button onClick={() => nav('messaging')} className="block w-full text-left text-yellow-200/90">Messaging</button>
          <button onClick={() => nav('post')} className="block w-full text-left text-yellow-200/90">Post a Gig</button>
          <button onClick={() => nav('profile')} className="block w-full text-left text-yellow-200/90">Create Profile</button>
          <a href="/test" className="block w-full text-left text-yellow-200/90">System</a>
        </div>
      )}
    </header>
  )
}

export default Header
