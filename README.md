# GOIA Huqqa Lounge Digital Menu

Premium QR-ready digital menu built with Next.js, React, Tailwind CSS and Supabase.

## Run

```bash
pnpm install
pnpm dev
```

## Production

```bash
pnpm build
```

The project is configured for Vercel with `vercel.json`. Add the environment
variables from `.env.example` in Vercel before enabling Supabase-backed admin
sync.

## GOIA Video

Add the provided welcome video as:

```text
public/goia-welcome.mp4
```

The app will use it automatically on the fullscreen welcome screen.

## Supabase

Create a Supabase project, run `supabase-schema.sql`, then add:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without Supabase keys, the admin dashboard still works locally through browser storage.

For production image uploads, create a public Supabase Storage bucket named:

```text
product-images
```

The admin dashboard uploads product photos to that bucket when Supabase is configured. In local preview mode, uploaded images are stored as browser previews.
