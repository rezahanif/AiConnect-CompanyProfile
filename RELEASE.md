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

## Release metadata (TEMPORARY)

Single source of truth: `src/releases.ts` → `STATIC_RELEASES`.

- Metadata-only fixture: version `0.1.0`, no `downloadUrl`.
- Until a real artifact exists, the UI shows the unavailable state
  ("X release currently unavailable") + installation instructions.
  That is intentional — never fabricate a download URL.
- When a real artifact lands, add `downloadUrl` (+ `sizeBytes`,
  `checksum` if desired) to the matching `STATIC_RELEASES` entry.
- Checksum/signature values in this file are display-only; the browser
  is never the artifact security authority.

## Provider swap (future API)

`src/releases.ts` exports `releaseProvider: ReleaseProvider`.

Today: `StaticReleaseProvider`.

When Agent 1's marketplace/download API contract exists, add a
`MarketplaceReleaseProvider implements ReleaseProvider` and swap the
export. UI components (`src/components/Download.tsx`) only depend on
`ReleaseProvider` + `ReleaseInfo` — no UI redesign needed.

## CI / deployment

- No CI workflow yet (DEFERRED — add when release pipeline exists).
- Suggested future: `.github/workflows/build.yml` → `pnpm build` →
  upload `dist/` artifact / deploy to Pages. Keep out of repo until
  the release pipeline owner confirms the target.
