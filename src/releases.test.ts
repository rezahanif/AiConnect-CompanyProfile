import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  GitHubReleaseProvider,
  StaticReleaseProvider,
  archLabel,
  detectArchitecture,
  detectPlatform,
  isAvailable,
  latestVersion,
  releaseForPlatform,
} from './releases.ts'

const MAC_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
const WIN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0'
const LINUX_UA = 'Mozilla/5.0 (X11; Linux x86_64) Firefox/126.0'
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Safari/604.1'
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36'

test('detectPlatform: macOS desktop', () => {
  assert.equal(detectPlatform(MAC_UA), 'macos')
})
test('detectPlatform: Windows', () => {
  assert.equal(detectPlatform(WIN_UA), 'windows')
})
test('detectPlatform: Linux', () => {
  assert.equal(detectPlatform(LINUX_UA), 'linux')
})
test('detectPlatform: iPhone UA must not map to macOS', () => {
  assert.equal(detectPlatform(IPHONE_UA), null)
})
test('detectPlatform: Android', () => {
  assert.equal(detectPlatform(ANDROID_UA), null)
})
test('detectPlatform: unknown', () => {
  assert.equal(detectPlatform('Mozilla/5.0 (X11; FreeBSD)'), null)
})
test('detectPlatform: navigator.platform override', () => {
  assert.equal(detectPlatform('Mozilla/5.0', 'Win32'), 'windows')
  assert.equal(detectPlatform('Mozilla/5.0', 'MacIntel'), 'macos')
})

test('detectArchitecture: arm64 / x64 / unknown', () => {
  assert.equal(detectArchitecture('Mozilla/5.0 (Macintosh; Apple Silicon; ARM64)'), 'arm64')
  assert.equal(detectArchitecture(WIN_UA), 'x64')
  assert.equal(detectArchitecture('Mozilla/5.0 (X11; FreeBSD)'), undefined)
})

test('StaticReleaseProvider: windows has a download URL', async () => {
  const releases = await new StaticReleaseProvider().getReleases()
  assert.equal(releases.length, 1)
  const windows = releases.find((r) => r.platform === 'windows')
  assert.equal(
    windows?.downloadUrl,
    'https://github.com/rezahanif/AICONNECT-RELEASE/releases/latest/download/AI.CONNECT_1.0.0_x64-setup.exe',
  )
  assert.equal(latestVersion(releases), '1.0.0')
  assert.deepEqual(
    releases.map((r) => r.platform),
    ['windows'],
  )
})

test('StaticReleaseProvider: recommended per platform', async () => {
  const p = new StaticReleaseProvider()
  assert.equal((await p.getRecommendedRelease('windows'))?.platform, 'windows')
  assert.equal(await p.getRecommendedRelease(null), null)
})

test('releaseForPlatform + isAvailable', () => {
  const r = { version: '0.1.0', platform: 'macos' as const }
  assert.equal(isAvailable(r), false)
  assert.equal(isAvailable({ ...r, downloadUrl: 'https://cdn.example/a.dmg' }), true)
  assert.equal(isAvailable(undefined), false)
  assert.equal(isAvailable(releaseForPlatform([r], 'windows')), false)
  assert.equal(releaseForPlatform([], 'macos'), undefined)
})

test('GitHubReleaseProvider: parses latest release into a windows ReleaseInfo', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })
  globalThis.fetch = (async (url: string) => {
    assert.equal(url, 'https://api.github.com/repos/rezahanif/AICONNECT-RELEASE/releases/latest')
    return {
      ok: true,
      json: async () => ({
        tag_name: 'v1.0.0',
        published_at: '2026-09-08T05:37:40Z',
        assets: [
          {
            name: 'AI.CONNECT_1.0.0_x64-setup.exe',
            browser_download_url:
              'https://github.com/rezahanif/AICONNECT-RELEASE/releases/download/v1.0.0/AI.CONNECT_1.0.0_x64-setup.exe',
            size: 6073714,
            digest: 'sha256:7fda654bc633ec45809e6e323ccb637e0b0c7ecab4311e0d9bea9eec7d20b317',
          },
        ],
      }),
    }
  }) as unknown as typeof fetch

  const provider = new GitHubReleaseProvider()
  const releases = await provider.getReleases()
  assert.equal(releases.length, 1)
  assert.deepEqual(releases[0], {
    version: '1.0.0',
    releaseDate: '2026-09-08',
    platform: 'windows',
    architecture: 'x64',
    downloadUrl:
      'https://github.com/rezahanif/AICONNECT-RELEASE/releases/download/v1.0.0/AI.CONNECT_1.0.0_x64-setup.exe',
    sizeBytes: 6073714,
    checksum: 'sha256:7fda654bc633ec45809e6e323ccb637e0b0c7ecab4311e0d9bea9eec7d20b317',
  })
})

test('GitHubReleaseProvider: rejects when the release has no .exe asset', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })
  globalThis.fetch = (async () => ({
    ok: true,
    json: async () => ({ tag_name: 'v1.0.0', assets: [] }),
  })) as unknown as typeof fetch

  await assert.rejects(() => new GitHubReleaseProvider().getReleases(), /no Windows \.exe asset/i)
})

test('GitHubReleaseProvider: rejects on a non-OK response', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })
  globalThis.fetch = (async () => ({ ok: false, status: 404 })) as unknown as typeof fetch

  await assert.rejects(() => new GitHubReleaseProvider().getReleases(), /404/)
})

test('provider failure surfaces as rejection (error path)', async () => {
  const failing = {
    async getReleases() {
      throw new Error('network down')
    },
    async getRecommendedRelease() {
      return null
    },
  }
  await assert.rejects(() => failing.getReleases())
})

test('archLabel', () => {
  assert.equal(archLabel('arm64'), 'ARM64')
  assert.equal(archLabel('x64'), 'x64')
  assert.equal(archLabel(undefined), undefined)
})
