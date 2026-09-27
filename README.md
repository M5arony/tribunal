# The Tribunal of Everyday Objects

A court of record for grievances against inanimate objects. The Wi-Fi, the Left Sock and Monday finally answer for their crimes.

Built for the DEV × Sanity Challenge (Path Two) with Claude Code.

- `src/` — Next.js (App Router, static export). Every page is generated at build time from GROQ queries.
- `studio/` — Sanity Studio with the schema: `defendant`, `charge`, `judge`, `grievance`, `ruling`.
- `seed/` — the full dataset as NDJSON (`make_seed.py` regenerates it).

Rulings reference earlier rulings as precedent. "Cited as precedent in" is computed with a GROQ reverse lookup, never stored.

## Run it

```bash
npm install
NEXT_PUBLIC_SANITY_PROJECT_ID=yg3w8y8q npm run dev
```

Without a project ID the site falls back to `seed/tribunal.ndjson`, so it runs offline too.

Sanity project `yg3w8y8q`, dataset `production` (public).
