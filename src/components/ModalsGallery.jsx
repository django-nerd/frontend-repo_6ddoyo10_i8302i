import { useState } from 'react'

const modalBase = "fixed inset-0 bg-black/60 grid place-items-center p-4"
const panelBase = "bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-5 shadow-xl"

function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null
  return (
    <div className={modalBase}>
      <div className={panelBase}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-blue-200 hover:text-white">✕</button>
        </div>
        <div className="text-blue-200/90 text-sm space-y-3">
          {children}
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          {actions || (
            <>
              <button onClick={onClose} className="px-3 py-2 rounded bg-slate-700 text-white">Close</button>
              <button onClick={onClose} className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Confirm</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ModalsGallery() {
  const [open, setOpen] = useState(Array(10).fill(false))
  const toggle = (i, v) => setOpen(prev => prev.map((x, idx) => idx===i ? (v ?? !x) : x))

  const items = [
    { title: 'Gig Details', body: <p>Full overview of the gig: timing, pay, dress code, and requirements.</p> },
    { title: 'Apply to Gig', body: <p>Quick form to send a short message and your profile link to the club.</p> },
    { title: 'Schedule Options', body: <p>Select availability: few hours (shift blocks) or entire night coverage.</p> },
    { title: 'Confirm Hire', body: <p>Club confirms selected models and assigns shift duration.</p> },
    { title: 'Payment Terms', body: <p>Set rate: hourly or flat-night. Include tips/bonus notes.</p> },
    { title: 'Message Thread', body: <p>Chat-style messages between club and model for final details.</p> },
    { title: 'Upload ID / Documents', body: <p>Secure upload placeholders for age verification and agreements.</p> },
    { title: 'Report/Flag Posting', body: <p>Lightweight form to report inappropriate or duplicate gigs.</p> },
    { title: 'Share Gig', body: <p>Copy link and quick share to social channels to invite more applicants.</p> },
    { title: 'Success / Toast', body: <p>Friendly confirmation state after an action completes.</p> },
  ]

  return (
    <section className="space-y-4">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-2">Modal Mockups</h3>
        <p className="text-blue-300/80 text-sm mb-4">Ten example modals that represent key flows in the hiring journey. These are visual mockups to illustrate UX; they are not wired to data.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((it, i) => (
            <button key={i} onClick={() => toggle(i, true)} className="w-full px-3 py-2 text-left rounded-lg bg-slate-900/60 border border-white/10 hover:border-blue-400/40 text-blue-100">
              • {i+1}. {it.title}
            </button>
          ))}
        </div>
      </div>

      {items.map((it, i) => (
        <Modal key={i} open={open[i]} title={it.title} onClose={() => toggle(i, false)}>
          {it.body}
          {i === 2 && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-blue-300/90">Shift</label>
                <label className="text-xs text-blue-300/90">Duration</label>
                <select className="input">
                  <option>Early (9PM-11PM)</option>
                  <option>Peak (11PM-2AM)</option>
                  <option>Late (1AM-3AM)</option>
                </select>
                <select className="input">
                  <option>Few hours</option>
                  <option>Whole night</option>
                </select>
              </div>
            </div>
          )}
          {i === 4 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input className="input" placeholder="Hourly e.g. $45/hr" />
              <input className="input" placeholder="Flat night e.g. $300" />
            </div>
          )}
        </Modal>
      ))}
    </section>
  )
}
