This is a Next.js ecommerce project for shoe-otah with Supabase authentication.

## Quick Start

1. Install dependencies.

	npm install

2. Create your local environment file.

	Copy `.env.example` to `.env.local` and set:

	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

3. Start development server.

	npm run dev

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: starts Next.js with Webpack (recommended on this Windows setup)
- `npm run dev:turbo`: starts with Turbopack
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: run ESLint

## Supabase Auth Flow

- Register page: `/register`
- Login page: `/login`
- Admin page: `/admin` (protected; redirects to login when unauthenticated)

Auth/session implementation details:

- Browser client helper: `lib/supabase/client.ts`
- Server client helper: `lib/supabase/server.ts`
- Session refresh proxy: `proxy.ts` + `lib/supabase/proxy.ts`

## Windows Turbopack/SWC Troubleshooting

If you see an error like:

`@next/swc-win32-x64-msvc ... is not a valid Win32 application`

Use `npm run dev` (Webpack mode), which avoids this Turbopack native-binding requirement.

If you want Turbopack later, reinstall dependencies after cleaning:

1. Delete `.next` and `node_modules`
2. Run `npm install`
3. Retry `npm run dev:turbo`

## Notes

- In Supabase dashboard, enable Email provider under Authentication.
- If email confirmation is enabled, users must verify before full access.

## References

- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
