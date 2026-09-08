# AiConnect Company Profile — Release Notes (Website)

## Production build

```bash
corepack enable            # or: npm i -g pnpm@10.34.3
pnpm install
pnpm build
```

Output: `dist/` — static site (Vite 8 + React 19). Host `dist/` on any
static host (Cloudflare Pages, R2 + custom domain, nginx, S3…).

- `base` path: `vite.config.ts` reads `FIGMA_PUBLIC_URL`; unset = `/`.
- No server runtime. No environment variables required at build time today.

## Local verification

```bash
pnpm test     # node --test with TS type-stripping (src/releases.test.ts)
pnpm build
```

## Release metadata

Source of truth: the live **GitHub Releases API** for
`rezahanif/AICONNECT-RELEASE`, via `GitHubReleaseProvider` in
`src/releases.ts` (exported as `releaseProvider`). On page load it calls
`GET https://api.github.com/repos/rezahanif/AICONNECT-RELEASE/releases/latest`,
picks the first asset whose name ends in `.exe`, and builds a
`ReleaseInfo` from `tag_name` (version), `published_at`, and the
asset's `browser_download_url` / `size` / `digest`. This means:

- **No manual filename sync needed.** Publishing a new GitHub Release
  (any tag, any asset filename ending in `.exe`) is picked up
  automatically — no code change or redeploy required to update the
  button's version/URL.
- **Publishing a release is still required.** The button reads
  `releases/latest`, i.e. the most recent *non-prerelease,
  non-draft* release. A draft or prerelease-flagged release, or a
  file merely committed into the repo's tree, will not appear here.
- If the fetch fails or the latest release has no `.exe` asset, the UI
  shows an error state with a Retry button
  (`src/components/Download.tsx`) — it does not silently fall back to
  stale data.
- macOS and Linux have been removed from site downloads; Windows is
  currently the only platform this provider looks for.
- `STATIC_RELEASES` / `StaticReleaseProvider` still exist — used only
  as the pre-fetch initial-paint seed and in tests. Never the
  download-time source of truth.
- Checksum/signature values are display-only; the browser is never the
  artifact security authority.

### 404 history (fixed 2026-09-08)

The button 404'd twice while wiring this up, for two different
reasons — worth knowing if it happens again:
1. The `.exe` was committed into the repo's file tree (a folder named
   `releases/`) instead of uploaded as an actual GitHub Release asset.
   The `/releases/...` API and download URLs only resolve real
   Releases, not repo file paths.
2. After a real Release was published, the site's `downloadUrl` still
   hardcoded an old asset filename (`AiConnect-Setup.exe`) that didn't
   match the uploaded asset's actual name
   (`AI.CONNECT_1.0.0_x64-setup.exe`) — GitHub's download redirect
   404s on any filename mismatch. `GitHubReleaseProvider` (above)
   removes this failure mode going forward by reading the asset name
   from the API instead of hardcoding it.

## Provider swap (future API)

`src/releases.ts` exports `releaseProvider: ReleaseProvider`.

Today: `GitHubReleaseProvider`, reading GitHub Releases directly.

When Agent 1's marketplace/download API contract exists, add a
`MarketplaceReleaseProvider implements ReleaseProvider` and swap the
export. UI components (`src/components/Download.tsx`) only depend on
`ReleaseProvider` + `ReleaseInfo` — no UI redesign needed.

## CI / deployment

- No CI workflow yet (DEFERRED — add when release pipeline exists).
- Suggested future: `.github/workflows/build.yml` → `pnpm build` →
  upload `dist/` artifact / deploy to Pages. Keep out of repo until
  the release pipeline owner confirms the target.
