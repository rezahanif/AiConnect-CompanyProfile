import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SapBlueprint3DCanvas } from './SapBlueprint3DCanvas'

export function SapBlueprintSection({ visible = true }: { visible?: boolean }) {
  const [pulseBurst, setPulseBurst] = useState(0)
  const [simStatus, setSimStatus] = useState<
    'idle' | 'scanning_gis' | 'fea_meshing' | 'seismic_solving' | 'converged'
  >('idle')
  const [hasExecuted, setHasExecuted] = useState(false)
  const [simProgress, setSimProgress] = useState(0)
  const [contourElev, setContourElev] = useState('EL +10.0m - +48.5m')
  const [meshElements, setMeshElements] = useState('0')
  const [pgaValue, setPgaValue] = useState('0.00g')
  const [safetyFactor, setSafetyFactor] = useState('INITIALIZING')
  const [currentStageText, setCurrentStageText] = useState('')
  const simTimerRef = useRef<any>(null)

  const handleRunSimulation = () => {
    if (simStatus !== 'idle' && simStatus !== 'converged') return
    clearInterval(simTimerRef.current)

    setHasExecuted(true)
    setPulseBurst((prev) => prev + 1)
    setSimStatus('scanning_gis')
    setSimProgress(0)
    setContourElev('EL +10.0m (Datum)')
    setMeshElements('0')
    setPgaValue('0.00g')
    setSafetyFactor('ANALYZING')
    setCurrentStageText('Phase 01: Vectorizing QGIS 0.5m LiDAR Contours')

    const start = performance.now()
    const duration = 7200 // 7.2s smooth engineering analysis sequence

    simTimerRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(100, (elapsed / duration) * 100)
      setSimProgress(progress)

      if (progress < 25) {
        // Stage 1: QGIS LiDAR Contours Scan (0% - 25%)
        setSimStatus('scanning_gis')
        setCurrentStageText('Phase 01: Vectorizing QGIS 0.5m LiDAR Contours')
        const t = progress / 25
        setContourElev(`EL +${(10 + t * 38.5).toFixed(1)}m`)
        setMeshElements(Math.floor(t * 12500).toLocaleString())
        setPgaValue('0.00g')
        setSafetyFactor('PROCESSING')
      } else if (progress < 55) {
        // Stage 2: Discretizing SAP2000 Soil Mesh (25% - 55%)
        setSimStatus('fea_meshing')
        setCurrentStageText('Phase 02: Discretizing 48,200 SAP2000 Soil FEM Nodes')
        const t = (progress - 25) / 30
        setContourElev('EL +10.0m - +48.5m')
        setMeshElements(Math.floor(12500 + t * 35700).toLocaleString())
        setPgaValue((t * 0.22).toFixed(2) + 'g')
        setSafetyFactor('SOLVING STABILITY')
      } else if (progress < 85) {
        // Stage 3: Dynamic Seismic Shear Waves (55% - 85%)
        setSimStatus('seismic_solving')
        setCurrentStageText('Phase 03: Simulating Seismic Shear Wave Response')
        const t = (progress - 55) / 30
        setContourElev('EL +10.0m - +48.5m')
        setMeshElements('48,200 Elements')
        setPgaValue((0.22 + t * 0.23).toFixed(2) + 'g')
        setSafetyFactor(`SF = ${(1.15 + t * 1.30).toFixed(2)}`)
      } else {
        // Stage 4: Converged & Certified (85% - 100%)
        clearInterval(simTimerRef.current)
        setSimStatus('converged')
        setCurrentStageText('✓ Phase 04: Slope Stability & Anchors Certified')
        setSimProgress(100)
        setContourElev('EL +10.0m - +48.5m')
        setMeshElements('48,200 Elements')
        setPgaValue('0.45g (Max PGA)')
        setSafetyFactor('SF = 2.45 (STABLE)')

        setTimeout(() => {
          setSimStatus('idle')
        }, 9000)
      }
    }, 50)
  }

  return (
    <section
      id="geospatial"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-transparent px-6 py-4 sm:px-12 sm:py-5 select-none"
    >
      {/* --- CENTER STAGE: 3D High-End Topographic Contour & Geotechnical Canvas --- */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center my-auto">
        {visible && (
          <SapBlueprint3DCanvas
            pulseBurst={pulseBurst}
            simStatus={simStatus}
            simProgress={simProgress}
          />
        )}

        {/* --- LEFT OVERLAY: QGIS & SAP2000 Narrative --- */}
        <div data-layer-text className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-20 flex max-w-sm sm:max-w-md lg:max-w-lg flex-col items-start text-left">
          {/* Eyebrow */}
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CASE STUDY 03 // GEOSPATIAL &amp; GEOTECHNICAL FEA</span>
          </div>

          {/* Main Title */}
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.035em] text-white leading-[0.94]">
            QGIS
            <br />
            Topographic Blueprint
          </h2>

          {/* Lead Description - Rata Kanan Kiri (Justified) */}
          <p
            style={{ textAlign: 'justify' }}
            className="mt-4 font-sans text-sm sm:text-base lg:text-[16.5px] leading-relaxed text-muted/90 font-normal max-w-[360px] sm:max-w-[430px] text-justify"
          >
            Unify QGIS digital elevation models (DEM) geotechnical finite element analysis through AI agents. Auto-vectorize contour isolines, discretize non-linear soil strata, and simulate seismic slope stability under dynamic response spectra.
          </p>

          {/* Case Spec Pill */}
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10.5px]">
            <span className="rounded border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-sky-300 font-medium">
              QGIS 3.38 + SAP2000 v25
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">Slope Stability &amp; Soil FEA</span>
          </div>

          {/* High-Tech Capability Badges */}
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              0.5m LiDAR Isolines
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              48,200 Soil FEM Nodes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Seismic Response Spectrum
            </span>
          </div>

          {/* Real-Time Telemetry status indicator when active on left */}
          {simStatus !== 'idle' && (
            <div className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-500/25 bg-black/60 px-3.5 py-1.5 font-mono text-[10.5px] text-sky-300 backdrop-blur-md">
              <span
                className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  : 'bg-sky-400 animate-ping'
                  }`}
              />
              <span className="font-semibold">{currentStageText}</span>
              <span className="text-white/40">({Math.round(simProgress)}%)</span>
            </div>
          )}
        </div>

        {/* --- RIGHT OVERLAY: AI Agent Desktop Window (Claude Sonnet + QGIS/SAP2000 MCP Connector) --- */}
        <div data-layer-text className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex w-full max-w-[420px] xl:max-w-[450px] flex-col items-end text-left select-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090d18]/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[11px] text-white/50">AiConnect — Desktop</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_1px_#38bdf8]" />
                <span className="text-sky-400/90 font-medium">MCP:8789</span>
              </div>
            </div>

            {/* Agent Conversation Body */}
            <div className="p-4 space-y-3">
              {/* Agent Identifier Header */}
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md bg-white shadow-sm">
                  <img
                    src="/logos/logo-claude.png"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-[13px] font-semibold text-white/90">Claude · Sonnet 5.0</span>
                <span className="ml-auto rounded-full bg-sky-500/15 border border-sky-500/25 px-2 py-0.5 font-mono text-[9px] text-sky-300">
                  gis · fea agent
                </span>
              </div>

              {/* User Prompt Bubble with Interactive Action button */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/80">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    USER PROMPT
                  </span>
                  <span className="text-[9px] text-white/30">Just now</span>
                </div>
                <p className="text-white/85 text-[11.5px] leading-relaxed mb-3">
                  "Extract 0.5m topographic elevation contours from QGIS LiDAR DEM, generate 3D SAP2000 non-linear geotechnical soil mesh, and evaluate slope safety factor under 0.45g seismic load."
                </p>

                {/* SIMULATE TOPOGRAPHIC FEA Action Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRunSimulation}
                  className={`group relative w-full flex items-center justify-center gap-2 rounded-lg py-2 px-3 font-mono text-[10.5px] font-bold uppercase tracking-wider transition-all border ${simStatus === 'converged'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : simStatus === 'seismic_solving'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : simStatus === 'fea_meshing'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : simStatus === 'scanning_gis'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:from-sky-400 hover:to-blue-500'
                    }`}
                >
                  {simStatus === 'idle' && (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                      <span>SIMULATE TOPOGRAPHIC FEA SLOPE</span>
                      <span className="text-white/60 font-normal ml-0.5">↵</span>
                    </>
                  )}
                  {simStatus === 'scanning_gis' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      <span>1/4 RASTERIZING QGIS CONTOURS...</span>
                    </>
                  )}
                  {simStatus === 'fea_meshing' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                      <span>2/4 MESHING 48,200 SOIL NODES...</span>
                    </>
                  )}
                  {simStatus === 'seismic_solving' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <span>3/4 COMPUTING SEISMIC RESPONSE...</span>
                    </>
                  )}
                  {simStatus === 'converged' && (
                    <>
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>SF = 2.45 STABILIZED · RE-RUN</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Agent Response & Viewport Telemetry - Revealed ONLY after clicking RUN */}
              <AnimatePresence>
                {hasExecuted && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-3 overflow-hidden"
                  >
                    {/* Agent Response & MCP Connector Execution Bubble */}
                    <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.07] p-3 text-[12px] leading-relaxed shadow-[0_0_20px_-5px_rgba(56,189,248,0.12)]">
                      <p className="text-white/90">
                        Bridging QGIS GeoTIFF DEM to SAP2000 OAPI: Synthesizing 3D tetrahedral soil continuum, simulating dynamic response spectrum at 0.45g PGA, and verifying slope safety factor with deep rock anchors.
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-sky-500/20 pt-2 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-sky-300">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged'
                              ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                              : simStatus !== 'idle'
                                ? 'bg-sky-400 animate-pulse'
                                : 'bg-sky-400'
                              }`}
                          />
                          <span className="tracking-tight">
                            {simStatus === 'idle' && 'sap2000.connector · idle'}
                            {simStatus === 'scanning_gis' && 'qgis.gdal · extracting 0.5m isolines'}
                            {simStatus === 'fea_meshing' && 'sap2000.mesh · 48,200 solid elements'}
                            {simStatus === 'seismic_solving' && 'sap2000.dynamic · response spectrum solving'}
                            {simStatus === 'converged' && 'sap2000.fea · slope stability SF = 2.45'}
                          </span>
                        </div>
                        <span className="text-white/40">PID 8789</span>
                      </div>
                    </div>

                    {/* SAP2000 / QGIS Viewport & Live Telemetry Inspector */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#070b16]/90 p-3">
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
                        <span className="text-white/50">QGIS/SAP2000 · Hillside-FEA.sdb</span>
                        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                          GIS / GEOTECHNICAL
                        </span>
                      </div>

                      {/* Progress Bar & Phase Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span
                            className={`${simStatus === 'converged'
                              ? 'text-emerald-400 font-semibold'
                              : 'text-sky-300'
                              }`}
                          >
                            {currentStageText || 'Phase 00: Topographic Surface Ready'}
                          </span>
                          <span className="text-white/40">{Math.round(simProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <motion.div
                            className={`h-full transition-all duration-75 ${simStatus === 'converged'
                              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                              : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                              }`}
                            style={{ width: `${simStatus === 'idle' ? 100 : simProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* 4-Tile Telemetry Metrics Grid */}
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          LiDAR Elevation{' '}
                          <span className="float-right text-sky-300 font-semibold">
                            {contourElev}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Soil Continuum{' '}
                          <span className="float-right text-white font-semibold">
                            {meshElements}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Design Seismic PGA{' '}
                          <span className="float-right text-amber-300 font-semibold">
                            {pgaValue}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Slope Safety Factor{' '}
                          <span
                            className={`float-right font-semibold ${simStatus === 'converged' ? 'text-emerald-300' : 'text-sky-300'
                              }`}
                          >
                            {safetyFactor}
                          </span>
                        </div>
                      </div>

                      {/* Eurocode 7 / AASHTO Geotechnical Compliance Callout */}
                      <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1.5 font-mono text-[9px]">
                        <span className="text-emerald-300 font-medium">EUROCODE 7 / AASHTO STABILITY</span>
                        <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-emerald-300 font-bold text-[8px]">
                          PASS (SF 2.45 &gt; 1.50 REQ)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Store Footer Bar (AiConnect Brand Standard) */}
            <div className="flex items-center gap-2.5 border-t border-white/[0.07] bg-white/[0.015] px-4 py-2.5 font-mono text-[10px]">
              <span className="grid h-5 w-5 place-items-center rounded bg-sky-500/20 text-sky-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7c0-1.5 3.6-2.5 8-2.5s8 1 8 2.5-3.6 2.5-8 2.5S4 8.5 4 7Z" />
                  <path d="M4 7v10c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5V7" />
                  <path d="M4 12c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5" />
                </svg>
              </span>
              <span className="font-semibold text-white/90">Progress Store</span>
              <span className="text-white/40 hidden sm:inline">
                geotechnical parameters saved · portable across models
              </span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_1px_#28c840]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
