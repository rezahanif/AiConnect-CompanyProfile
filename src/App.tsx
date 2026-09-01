import { useEffect } from 'react'
import { Footer, FinalCTA } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { InstallInstructions } from './components/InstallInstructions'
import { Pricing } from './components/Pricing'
import {
  ConnectorGridVisual,
  CrossModelVisual,
  EcosystemStrip,
  FeatureSection,
  GuideShowcaseVisual,
  ModelRowVisual,
  SkillShowcaseVisual,
  ValueDiagram,
  WorkWithAI,
} from './components/sections'
import { Eyebrow, Reveal } from './components/ui'
import { mailtoHref } from './data'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-fade-in').forEach((el) => el.classList.add('visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    document.querySelectorAll('.scroll-fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div id="top" className="relative min-h-screen bg-ink text-text">
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <EcosystemStrip />
          <WorkWithAI />

          <FeatureSection
            id="connectors"
            eyebrow="Switch AI, keep working"
            title="Continue where another AI stopped."
            body="When you switch to a different AI, the new model reads your saved project context — decisions made, files edited, results — so it knows exactly where to continue. No re-explaining needed."
            visual={<CrossModelVisual />}
          />

          <FeatureSection
            eyebrow="Model choice"
            title="Use the AI model that fits the task."
            body="Switch between AI models without losing the project context that matters. AiConnect isn't owned by one AI company — it works with compatible AI agents and models."
            visual={<ModelRowVisual />}
            flip
          />

          <FeatureSection
            eyebrow="Connectors"
            title="Give AI access to the software that does the real work."
            body="Connect engineering software through an expanding connector library — BIM, CAD, GIS, photogrammetry, spreadsheets, and documents. Missing something you need?"
            visual={<ConnectorGridVisual />}
          >
            <a
              href={mailtoHref}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-4px_rgba(59,130,246,0.6)]"
            >
              Request a connector →
            </a>
          </FeatureSection>

          <FeatureSection
            id="skills"
            eyebrow="Reusable workflows"
            title="Repeat a task once, automate it forever."
            body="Connectors are only part of the system. AiConnect also provides reusable workflows for the tasks you do repeatedly — download a guided workflow and let your agent run it."
            visual={<SkillShowcaseVisual />}
            flip
          />

          <FeatureSection
            id="guides"
            eyebrow="Complete guides"
            title="Know what to do, not just what to click."
            body="Every connector comes with guidance so anyone can understand how to work with the software through AI — no need to be an AI specialist to get started."
            visual={<GuideShowcaseVisual />}
          />

          <section className="relative flex flex-col items-center justify-center px-5 py-20 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Reveal>
                <Eyebrow>How it connects</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
                  How AiConnect works
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <ValueDiagram />
              </Reveal>
            </div>
          </section>

          <Pricing />

          <FinalCTA />

          <InstallInstructions />
        </main>
        <Footer />
      </div>
    </div>
  )
}
