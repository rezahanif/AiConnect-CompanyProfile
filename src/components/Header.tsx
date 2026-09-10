import { useState } from 'react'
import logoUrl from '../assets/logo.webp'

const nav = ['Connectors', 'Skills', 'Guides', 'Pricing']

export function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <span className="inline-flex select-none">
      <img
        src={logoUrl}
        alt="AiConnect"
        style={{ height: size }}
        className="w-auto"
        draggable={false}
      />
    </span>
  )
}

const home = ['', '/', '/index.html'].includes(
  window.location.pathname.split('?')[0].split('#')[0].replace(/\/$/, '') || '/',
)
const anchor = (suffix: string) => (home ? suffix : `/${suffix}`)

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a href={home ? '#top' : '/'} aria-label="AiConnect home">
          <BrandMark size={42} />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n}
              href={anchor(`#${n.toLowerCase()}`)}
              className="nav-link relative text-[14px] font-medium text-muted transition-colors hover:text-text"
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={anchor('#get-download')}
            className="rounded-xl px-4 py-2 text-[14px] font-semibold text-white shadow-[0_8px_28px_-10px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}
          >
            Download
          </a>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-hairline text-text md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-hairline bg-[#06080d]/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n}
                href={anchor(`#${n.toLowerCase()}`)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-white/[0.04] hover:text-text"
              >
                {n}
              </a>
            ))}
            <a
              href={anchor('#get-download')}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}
            >
              Download
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
