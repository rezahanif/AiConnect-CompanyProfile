import assert from "node:assert/strict"
import { test } from "node:test"
import {
  StaticReleaseProvider,
  archLabel,
  detectArchitecture,
  detectPlatform,
  isAvailable,
  latestVersion,
  releaseForPlatform,
} from "./releases.ts"

const MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
const WIN_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0"
const LINUX_UA = "Mozilla/5.0 (X11; Linux x86_64) Firefox/126.0"
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148 Safari/604.1"
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36"

test("detectPlatform: macOS desktop", () => {
  assert.equal(detectPlatform(MAC_UA), "macos")
})
test("detectPlatform: Windows", () => {
  assert.equal(detectPlatform(WIN_UA), "windows")
})
test("detectPlatform: Linux", () => {
  assert.equal(detectPlatform(LINUX_UA), "linux")
})
test("detectPlatform: iPhone UA must not map to macOS", () => {
  assert.equal(detectPlatform(IPHONE_UA), null)
})
test("detectPlatform: Android", () => {
  assert.equal(detectPlatform(ANDROID_UA), null)
})
test("detectPlatform: unknown", () => {
  assert.equal(detectPlatform("Mozilla/5.0 (X11; FreeBSD)"), null)
})
test("detectPlatform: navigator.platform override", () => {
  assert.equal(detectPlatform("Mozilla/5.0", "Win32"), "windows")
  assert.equal(detectPlatform("Mozilla/5.0", "MacIntel"), "macos")
})

test("detectArchitecture: arm64 / x64 / unknown", () => {
  assert.equal(
    detectArchitecture("Mozilla/5.0 (Macintosh; Apple Silicon; ARM64)"),
    "arm64",
  )
  assert.equal(detectArchitecture(WIN_UA), "x64")
  assert.equal(detectArchitecture("Mozilla/5.0 (X11; FreeBSD)"), undefined)
})

test("StaticReleaseProvider: metadata without download URLs", async () => {
  const releases = await new StaticReleaseProvider().getReleases()
  assert.equal(releases.length, 3)
  assert.ok(releases.every((r) => r.downloadUrl === undefined))
  assert.equal(latestVersion(releases), "0.1.0")
  assert.deepEqual(releases.map((r) => r.platform).sort(), [
    "linux",
    "macos",
    "windows",
  ])
})

test("StaticReleaseProvider: recommended per platform", async () => {
  const p = new StaticReleaseProvider()
  assert.equal((await p.getRecommendedRelease("macos"))?.platform, "macos")
  assert.equal((await p.getRecommendedRelease("linux"))?.platform, "linux")
  assert.equal(await p.getRecommendedRelease(null), null)
})

test("releaseForPlatform + isAvailable", () => {
  const r = { version: "0.1.0", platform: "macos" as const }
  assert.equal(isAvailable(r), false)
  assert.equal(
    isAvailable({ ...r, downloadUrl: "https://cdn.example/a.dmg" }),
    true,
  )
  assert.equal(isAvailable(undefined), false)
  assert.equal(isAvailable(releaseForPlatform([r], "windows")), false)
  assert.equal(releaseForPlatform([], "macos"), undefined)
})

test("provider failure surfaces as rejection (error path)", async () => {
  const failing = {
    async getReleases() {
      throw new Error("network down")
    },
    async getRecommendedRelease() {
      return null
    },
  }
  await assert.rejects(() => failing.getReleases())
})

test("archLabel", () => {
  assert.equal(archLabel("arm64"), "ARM64")
  assert.equal(archLabel("x64"), "x64")
  assert.equal(archLabel(undefined), undefined)
})
