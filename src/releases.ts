/*
 * Release metadata + provider boundary.
 *
 * The UI must never know whether releases come from a static fixture,
 * an HTTP API, a CDN, or a marketplace. Everything goes through
 * `ReleaseProvider`; swap `releaseProvider` below when the real
 * download API contract exists (see RELEASE.md).
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

/* TEMPORARY / STATIC FALLBACK — metadata only. downloadUrl intentionally
 * undefined until a real artifact exists: the UI must render the
 * unavailable state instead of a fake download link. */
const STATIC_RELEASES: ReleaseInfo[] = [
  { version: '0.1.0', releaseDate: '2026-08-13', platform: 'windows', architecture: 'x64' },
  { version: '0.1.0', releaseDate: '2026-08-13', platform: 'macos', architecture: 'x64' },
  { version: '0.1.0', releaseDate: '2026-08-13', platform: 'linux', architecture: 'x64' },
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

/* TEMPORARY — replace with MarketplaceReleaseProvider here only. */
export const releaseProvider: ReleaseProvider = new StaticReleaseProvider()

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
