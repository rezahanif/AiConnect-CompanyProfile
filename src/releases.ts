/*
 * Release metadata + provider boundary.
 *
 * The UI must never know whether releases come from a static fixture,
 * an HTTP API, a CDN, or a marketplace. Everything goes through
 * `ReleaseProvider`; `releaseProvider` below is a `GitHubReleaseProvider`
 * reading the live GitHub Releases API (see RELEASE.md).
 *
 * Platform detection here is advisory UX state — never security
 * authority. Artifact identity, checksums, and signatures belong to
 * the backend/marketplace side.
 */

export type PlatformName = 'windows' | 'macos' | 'linux'

export type ReleaseInfo = {
  version: string
  releaseDate?: string
  platform: PlatformName
  architecture?: 'x64' | 'arm64'
  downloadUrl?: string
  sizeBytes?: number
  checksum?: string
}

export interface ReleaseProvider {
  getReleases(): Promise<ReleaseInfo[]>
  getRecommendedRelease(platform: PlatformName | null): Promise<ReleaseInfo | null>
}

/* Initial-paint seed only — shown for the instant before GitHubReleaseProvider's
 * fetch resolves, then immediately superseded. Never the download-time source of
 * truth, so a stale filename here can't reintroduce the 404 class of bug. */
export const STATIC_RELEASES: ReleaseInfo[] = [
  {
    version: '1.0.0',
    releaseDate: '2026-09-07',
    platform: 'windows',
    architecture: 'x64',
    downloadUrl:
      'https://github.com/rezahanif/AICONNECT-RELEASE/releases/latest/download/AI.CONNECT_1.0.0_x64-setup.exe',
    sizeBytes: 6073714,
    checksum: 'sha256:7fda654bc633ec45809e6e323ccb637e0b0c7ecab4311e0d9bea9eec7d20b317',
  },
]

export class StaticReleaseProvider implements ReleaseProvider {
  private releases: ReleaseInfo[] = STATIC_RELEASES

  async getReleases(): Promise<ReleaseInfo[]> {
    return this.releases.map((r) => ({ ...r }))
  }

  async getRecommendedRelease(platform: PlatformName | null): Promise<ReleaseInfo | null> {
    if (!platform) return null
    const found = this.releases.find((r) => r.platform === platform)
    return found ? { ...found } : null
  }
}

const GITHUB_RELEASE_REPO = 'rezahanif/AICONNECT-RELEASE'

/** Live GitHub Releases API — the actual source of truth for version/downloadUrl,
 * so a published release's real asset filename is always what ships to users. */
export class GitHubReleaseProvider implements ReleaseProvider {
  constructor(private repo: string = GITHUB_RELEASE_REPO) {}

  async getReleases(): Promise<ReleaseInfo[]> {
    const res = await fetch(`https://api.github.com/repos/${this.repo}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) throw new Error(`GitHub releases fetch failed: ${res.status}`)
    const data = await res.json()

    const asset = (data.assets ?? []).find((a: { name: string }) => /\.exe$/i.test(a.name))
    if (!asset) throw new Error('Latest GitHub release has no Windows .exe asset')

    const release: ReleaseInfo = {
      version: String(data.tag_name ?? '').replace(/^v/, '') || 'unknown',
      releaseDate: typeof data.published_at === 'string' ? data.published_at.slice(0, 10) : undefined,
      platform: 'windows',
      architecture: /arm64|aarch64/i.test(asset.name) ? 'arm64' : 'x64',
      downloadUrl: asset.browser_download_url,
      sizeBytes: asset.size,
      checksum: asset.digest,
    }
    return [release]
  }

  async getRecommendedRelease(platform: PlatformName | null): Promise<ReleaseInfo | null> {
    if (!platform) return null
    const releases = await this.getReleases()
    return releases.find((r) => r.platform === platform) ?? null
  }
}

export const releaseProvider: ReleaseProvider = new GitHubReleaseProvider()

/* --- platform detection (advisory UX only) ---------------------------- */

export function detectPlatform(ua: string, platform?: string): PlatformName | null {
  const p = (platform ?? '').toLowerCase()
  if (/iphone|ipad|ipod|android/i.test(ua) || p === 'android' || /ios/i.test(p)) return null
  if (p.includes('win') || /windows|win64|win32/i.test(ua)) return 'windows'
  if (p.includes('mac') || /macintosh|mac os/i.test(ua)) return 'macos'
  if (p.includes('linux') || /linux/i.test(ua)) return 'linux'
  return null
}

export function detectArchitecture(ua: string): 'x64' | 'arm64' | undefined {
  if (/arm64|aarch64/i.test(ua)) return 'arm64'
  if (/x86_64|amd64|win64|wow64|i686|i386/i.test(ua)) return 'x64'
  return undefined
}

/* --- pure helpers (unit-tested) --------------------------------------- */

export function platformLabel(p: PlatformName): string {
  return p === 'windows' ? 'Windows' : p === 'macos' ? 'macOS' : 'Linux'
}

export function archLabel(a?: 'x64' | 'arm64'): string | undefined {
  return a === 'arm64' ? 'ARM64' : a === 'x64' ? 'x64' : undefined
}

export function releaseForPlatform(releases: ReleaseInfo[], p: PlatformName): ReleaseInfo | undefined {
  return releases.find((r) => r.platform === p)
}

export function latestVersion(releases: ReleaseInfo[]): string | null {
  return releases[0]?.version ?? null
}

/** A release is downloadable only when it carries a real URL. */
export function isAvailable(release: ReleaseInfo | undefined): boolean {
  return Boolean(release && release.downloadUrl)
}
