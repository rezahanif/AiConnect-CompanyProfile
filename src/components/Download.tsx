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
const PLATFORM_ORDER: PlatformName[] = ['windows']

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

  const detected = useMemo(
    () => detectPlatform(navigator.userAgent, navigator.platform),
    [],
  )
  const isWindows = detected === 'windows'

  const version = latestVersion(releases)

  if (status === 'error') {
    return (
      <div className="mx-auto mt-9 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-hairline bg-white/[0.03] px-5 py-4 text-center">
        <p className="text-[14px] leading-relaxed text-muted">
          We couldn't retrieve the latest release. Please try again.
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

  const release = releaseForPlatform(releases, 'windows')

  return (
    <div className="mt-9">
      {isWindows && (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-bright">
          Recommended for your device
        </p>
      )}
      <div className="flex items-center justify-center">
        <DownloadButton
          os="Windows"
          variant="primary"
          state="available"
          release={release}
          selected
        />
      </div>
      <p className="mt-4 font-mono text-[12px] text-muted">
        {version && (
          <>
            Latest version · {version}
            <span className="mx-2 text-hairline">|</span>
          </>
        )}
        2 weeks trial · Windows
      </p>
    </div>
  )
}
