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
  return (
    <div id="top" className="min-h-screen bg-ink text-text">
      <Header />
      <main>
        <Hero />
        <EcosystemStrip />
        <WorkWithAI />

        <FeatureSection
          id="connectors"
          eyebrow="Cross-model continuity"
          title="Continue where another AI stopped."
          body="Your project progress is stored separately from the AI conversation, so another model can pick up the work without starting from zero. We call it the Progress Store."
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
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.03] px-4 py-2.5 text-[14px] font-semibold text-text transition-colors hover:border-violet/50 hover:bg-white/[0.06]"
          >
            Request a connector →
          </a>
        </FeatureSection>

        <FeatureSection
          id="skills"
          eyebrow="Engineering skills"
          title="Skills built for real engineering work."
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

        <section className="relative px-5 py-24 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Eyebrow>The whole system</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
                One project. Many tools. Any AI.
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
  )
}
