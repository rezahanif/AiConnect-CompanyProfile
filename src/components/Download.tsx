import { useEffect, useMemo, useState } from 'react'
import {
  STATIC_RELEASES,
  archLabel,
  detectArchitecture,
  detectPlatform,
  isAvailable,
  latestVersion,
  platformLabel,
  releaseForPlatform,
  releaseProvider,
  type PlatformName,
  type ReleaseInfo,
} from '../releases'
import { DownloadButton, type OS } from './ui'

type DownloadStatus = 'loading' | 'ready' | 'error'

const OS_BY_PLATFORM: Record<PlatformName, OS> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
}
const PLATFORM_ORDER: PlatformName[] = ['windows', 'linux']

export function useReleases() {
  const [status, setStatus] = useState<DownloadStatus>('ready')
  const [releases, setReleases] = useState<ReleaseInfo[]>(STATIC_RELEASES)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    releaseProvider
      .getReleases()
      .then((r) => {
        if (!cancelled) {
          setReleases(r)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return { status, releases, retry: () => setReloadKey((k) => k + 1) }
}

export function DownloadPicker({ showVersion = false }: { showVersion?: boolean }) {
  const { status, releases, retry } = useReleases()
  const [selected, setSelected] = useState<PlatformName | null>(null)

  const detected = useMemo(
    () => detectPlatform(navigator.userAgent, navigator.platform),
    [],
  )
  const arch = useMemo(() => detectArchitecture(navigator.userAgent), [])
  const validDetected = detected && PLATFORM_ORDER.includes(detected) ? detected : null
  const active = selected ?? validDetected ?? 'windows'

  const version = latestVersion(releases)
  const archLine = archLabel(arch)

  if (status === 'error') {
    return (
      <div className="mx-auto mt-9 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-hairline bg-white/[0.03] px-5 py-4 text-center">
        <p className="text-[14px] leading-relaxed text-muted">
          We couldn't retrieve the latest release. Please try again or choose a
          platform manually.
        </p>
        <button
          type="button"
          onClick={retry}
          className="rounded-xl border border-hairline bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-text transition-colors hover:border-violet/50 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="mt-9">
      {validDetected && (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-bright">
          {selected && selected !== validDetected
            ? `You selected ${platformLabel(selected)} · ${platformLabel(validDetected)} detected on this device`
            : 'Recommended for your device'}
        </p>
      )}
      <div className="mx-auto flex max-w-xs flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
        {PLATFORM_ORDER.map((p) => {
          const release = releaseForPlatform(releases, p)
          const state = isAvailable(release) ? 'available' : 'unavailable'
          return (
            <DownloadButton
              key={p}
              os={OS_BY_PLATFORM[p]}
              variant={active === p ? 'primary' : 'ghost'}
              state={state}
              release={release}
              selected={active === p}
              archLine={active === p ? archLine : undefined}
              onSelect={() => setSelected(p)}
            />
          )
        })}
      </div>
      <p className="mt-4 font-mono text-[12px] text-muted">
        {version && (
          <>
            Latest version · {version}
            <span className="mx-2 text-hairline">|</span>
          </>
        )}
        2 weeks trial · Windows &amp; Linux
      </p>
    </div>
  )
}
