import { useEffect, useState } from 'react'
import { nav } from '../data'
import { BrandMark } from './ui'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a href="#top" aria-label="AiConnect home">
          <BrandMark />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              className="text-[14px] font-medium text-muted transition-colors hover:text-text"
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#download"
            className="rounded-xl px-4 py-2 text-[14px] font-semibold text-white shadow-[0_8px_28px_-10px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#3b82f6)' }}
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
        <div className="border-t border-hairline bg-ink/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-white/[0.04] hover:text-text"
              >
                {n}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#3b82f6)' }}
            >
              Download
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
