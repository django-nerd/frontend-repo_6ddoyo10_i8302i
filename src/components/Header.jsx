import { useState } from 'react'

function Header({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const nav = (key) => { onNavigate(key); setOpen(false) }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-400/40 grid place-items-center text-blue-300 font-bold">HB</div>
          <span className="text-white font-semibold tracking-tight">Hostess Board</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => nav('gigs')} className="text-blue-200 hover:text-white">Gigs</button>
          <button onClick={() => nav('models')} className="text-blue-200 hover:text-white">Models</button>
          <button onClick={() => nav('post')} className="text-blue-200 hover:text-white">Post a Gig</button>
          <button onClick={() => nav('profile')} className="text-blue-200 hover:text-white">Create Profile</button>
          <a href="/test" className="text-blue-200 hover:text-white">System</a>
        </nav>
        <button className="md:hidden text-blue-200" onClick={() => setOpen(!open)}>
          <span className="sr-only">Toggle</span>☰
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <button onClick={() => nav('gigs')} className="block w-full text-left text-blue-200">Gigs</button>
          <button onClick={() => nav('models')} className="block w-full text-left text-blue-200">Models</button>
          <button onClick={() => nav('post')} className="block w-full text-left text-blue-200">Post a Gig</button>
          <button onClick={() => nav('profile')} className="block w-full text-left text-blue-200">Create Profile</button>
          <a href="/test" className="block w-full text-left text-blue-200">System</a>
        </div>
      )}
    </header>
  )
}

export default Header
