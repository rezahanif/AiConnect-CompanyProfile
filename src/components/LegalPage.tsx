import type { ReactNode } from "react"
import { mailtoHref } from "../data"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Eyebrow } from "./ui"

export type LegalSection = {
  id: string
  title: string
  content: ReactNode
}

const CONTACT_EMAIL = mailtoHref.replace(/^mailto:([^?]+).*/, "$1")

export function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}: {
  eyebrow: string
  title: string
  description: string
  lastUpdated: string
  sections: LegalSection[]
}) {
  return (
    <div className="min-h-screen bg-ink text-text">
      <Header />
      <main className="px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-muted">
            {description}
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Last updated: {lastUpdated}
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
            <nav aria-label="On this page" className="hidden lg:block">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Contents
              </h2>
              <ul className="mt-4 space-y-2.5 border-l border-hairline">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-[13px] leading-relaxed text-muted transition-colors hover:border-violet hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70"
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 border-b border-hairline pb-10 pt-4 first:pt-0"
                >
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span className="mr-2 font-mono text-[15px] text-muted">
                      {i + 1}.
                    </span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4">{s.content}</div>
                </section>
              ))}

              <section id="contact" className="scroll-mt-24 pb-2 pt-10">
                <h2 className="text-2xl font-bold tracking-tight">
                  <span className="mr-2 font-mono text-[15px] text-muted">
                    {sections.length + 1}.
                  </span>
                  Contact
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-muted">
                  Questions about these {eyebrow.toLowerCase()}? Email us at{" "}
                  <a
                    href={mailtoHref}
                    className="text-violet transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
