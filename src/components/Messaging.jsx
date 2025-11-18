import { useEffect, useMemo, useRef, useState } from 'react'

function Warning({ show }) {
  if (!show) return null
  return (
    <div className="text-amber-200 text-xs bg-amber-500/10 border border-amber-400/30 px-2 py-1 rounded">
      Keep communication secure: All official scheduling and contact must remain in-app.
    </div>
  )
}

export default function Messaging({ backend }) {
  const [threadId, setThreadId] = useState('demo-thread')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [piiWarning, setPiiWarning] = useState(false)
  const [role, setRole] = useState('talent')
  const [sender, setSender] = useState('talent-123')
  const [recipient, setRecipient] = useState('client-xyz')
  const scroller = useRef(null)

  useEffect(() => {
    const nav = (e) => {
      if (e.detail?.thread) setThreadId(e.detail.thread)
    }
    window.addEventListener('openThread', nav)
    return () => window.removeEventListener('openThread', nav)
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${backend}/api/messages?thread_id=${encodeURIComponent(threadId)}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
      setTimeout(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }), 50)
    } catch { /* noop */ }
  }
  useEffect(() => { fetchMessages() }, [threadId])

  useEffect(() => {
    const hasPII = /\b\+?1?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}\b|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|instagram\.com|@[A-Za-z0-9_]{3,}/i.test(text)
    setPiiWarning(hasPII)
  }, [text])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const payload = { thread_id: threadId, sender_role: role, sender_id: sender, recipient_id: recipient, text }
    try {
      const res = await fetch(`${backend}/api/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json().catch(()=>({}))
      setText('')
      fetchMessages()
    } catch { /* noop */ }
  }

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-white/10">
        <div className="text-white font-semibold">Thread: {threadId}</div>
        <div className="flex items-center gap-2 text-xs text-blue-200">
          <span>Info</span>
          <button onClick={()=>alert('Contract view would open (mock).')} className="px-2 py-1 rounded bg-slate-800 text-white/80">Contract</button>
          <button onClick={()=>alert('Reported to admin (mock).')} className="px-2 py-1 rounded bg-red-600 text-white">Report</button>
        </div>
      </div>

      <div ref={scroller} className="h-72 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] ${m.sender_role==='talent'?'ml-auto text-right':''}`}>
            <div className={`${m.sender_role==='talent'?'bg-blue-600/80':'bg-slate-700/80'} text-white rounded-lg px-3 py-2 text-sm`}>{m.text}</div>
            <div className="text-[10px] text-blue-200/70 mt-0.5">{m.created_at?.slice(0,19).replace('T',' ')||''}{m.pii_flag? ' • safety check' : ''}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-blue-200/70 text-sm">No messages yet.</div>
        )}
      </div>

      <form onSubmit={send} className="p-3 border-t border-white/10 space-y-2">
        <Warning show={piiWarning} />
        <div className="flex gap-2 items-stretch">
          <select value={role} onChange={e=>setRole(e.target.value)} className="bg-slate-900/60 border border-white/10 text-blue-100 text-xs rounded px-2">
            <option value="talent">Talent</option>
            <option value="client">Client</option>
          </select>
          <input placeholder="Sender ID" value={sender} onChange={e=>setSender(e.target.value)} className="input" />
          <input placeholder="Recipient ID" value={recipient} onChange={e=>setRecipient(e.target.value)} className="input" />
        </div>
        <div className="flex gap-2">
          <input placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} className="input flex-1" />
          <button className="btn-primary">Send</button>
        </div>
      </form>
    </div>
  )
}
