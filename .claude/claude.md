# 5 Day Sprint Framework - Claude Code Master Configuration
*Framework created by Omar Choudhry | 5daysprint.com*

## PROJECT CONTEXT
**User**: Rishi
**Project**: Airport Guide
**Project Idea**: A website database and directory of all airports internationally, including arrivals/departures, transport connections (cabs, trains, buses), local weather, contact info, parking, food & drink, and lounges. Users can search by airport name or IATA code. Each airport gets its own page, refreshed monthly. Flight info updates daily with a manual refresh button.

## TECH STACK
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first, no tailwind.config.js)
- **UI**: shadcn/ui (Tailwind v4 compatible, pre-installed)
- **Database**: Supabase (Postgres)
- **Deployment**: Vercel

## TAILWIND V4 + SHADCN/UI (CRITICAL)
- shadcn/ui officially supports Tailwind v4 (2025)
- CSS-first configuration via `@theme` directive in globals.css
- No `tailwind.config.js` — this is normal and expected
- Do NOT downgrade to v3
- `data-slot` attributes are standard v4 behavior

## MANDATORY WORKFLOW
Every response must end with:
"COMPLETION SUMMARY: [1-line summary of what was accomplished]"

## SECURITY REQUIREMENTS
- NEVER store API keys in public files (JS, config files, etc.)
- ALL secrets in `.env.local` locally, Vercel env vars in production
- Supabase Edge Functions for server-side secrets
- `process.env.VARIABLE_NAME` for all env access

## AVAILABLE ENV VARIABLES (via process.env)
- SUPABASE_PROJECT_ID, SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- VERCEL_URL, VERCEL_PROJECT_ID
- GITHUB_REPO_URL
- FIRECRAWL_API_KEY
- USER_FIRST_NAME, PROJECT_NAME, PROJECT_IDEA

Never ask Rishi to re-provide these — all available in environment variables.

## SHADCN/UI ECOSYSTEM-FIRST (MANDATORY)
Pre-installed components in `src/components/ui/`:
button, card, input, label, badge, table, tabs, select, sheet, dialog,
dropdown-menu, avatar, hover-card, separator, skeleton, sonner, navigation-menu

Before building anything custom:
1. Check `src/components/ui/` for existing components
2. Use official shadcn components AS-IS
3. Only customise when Rishi specifically requests design tweaks

## DEVELOPMENT STANDARDS
- All code properly typed (TypeScript strict)
- All components accessible (ARIA labels, keyboard nav)
- All styling responsive (mobile + desktop)
- All APIs secured (proper auth and validation)
- Test localhost before suggesting deployment

## ADDING NEW API INTEGRATIONS
1. Ask Rishi for the API key
2. Add to `.env.local`: `NEW_SERVICE_API_KEY=value`
3. Ensure `.env.local` stays in `.gitignore`
4. Use via `process.env.NEW_SERVICE_API_KEY`
5. Test the integration
6. Confirm no keys in public files
