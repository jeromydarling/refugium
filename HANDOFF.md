# Refugium — Lovable Handoff Guide

## What Is Refugium?

Refugium is a survivor-centered disaster recovery platform. It helps small humanitarian organizations — parishes, LTRGs, local nonprofits — navigate the long tail of recovery after a disaster. The app tracks households from displacement to renewal, connects them with resources, and uses NRI (Narrative Relationship Intelligence) to surface what matters.

**Live demo:** https://jeromydarling.github.io/refugium/
**Survivor portal example:** https://jeromydarling.github.io/refugium/r/hh-001

---

## Architecture Overview

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui (Radix)
- **Animation:** Framer Motion v12
- **Maps:** Mapbox GL JS with custom vintage style
- **Charts/PDF:** jsPDF, Recharts
- **State:** TanStack React Query + React Context
- **Routing:** React Router 6

### What's Demo vs What's Real

| Layer | Current (Demo) | Lovable Target |
|-------|---------------|----------------|
| **Data** | `src/data/*.ts` — static TypeScript arrays | Supabase tables |
| **Auth** | `DemoModeContext` — no real auth | Supabase Auth |
| **API calls** | `src/services/resourceApi.ts` — mock responses with `setTimeout` | Supabase Edge Functions calling real APIs |
| **AI/NRI chat** | `src/components/demo/NriCompass.tsx` — hardcoded responses | Gemini Flash via Edge Function |
| **File uploads** | Not implemented | Supabase Storage |
| **Notifications** | Not implemented | Supabase Realtime + push |

### Key Directories

```
src/
  pages/
    demo/           # 19 demo app pages (the main app)
    marketing/       # 8 marketing site pages
    SurvivorPortal.tsx  # Secret-link portal for survivors
  components/
    demo/            # Demo-specific (NriCompass, NewCaseWizard, WeeklyRhythm, etc.)
    people/          # Household cards, timeline, meaning map, renewal trail
    refuge/          # Partner/resource cards
    flow/            # Volunteer/task cards
    nri/             # NRI signal cards, insight drawer
    map/             # Mapbox components
    marketing/       # Marketing layout, decorative elements
    shared/          # AnimatedSection, StaggerList
    ui/              # 56 shadcn components (DO NOT MODIFY)
    
    # CROS components kept for adaptation:
    layout/          # MainLayout, Sidebar, Header (for real app shell)
    auth/            # ProtectedRoute, login forms
    dashboard/       # 33 dashboard card components
    calendar/        # Month/week views, Google Calendar sync
    contacts/        # Contact cards, meeting history
    reports/         # Report sections, PDF templates
    volunteers/      # Volunteer management UI
    settings/        # Integration cards, feature toggles
    admin/           # Admin panels
    operator/        # Gardener/operator console
    ai/              # AIChatButton, AIChatDrawer, compass system
    compass/         # Compass nudges, Providence, seasonal echoes
    relatio/         # Integration connectors, migration assistant
    # ... and 30+ more subdirectories
  
  data/              # Mock data (15 households, 30 needs, etc.)
  services/          # API service layer with typed interfaces
  lib/
    animations.ts    # Framer Motion variants
    utils.ts         # cn() utility
    nri/             # Guardrails, narrative signals, archetype builder
    relatio/         # Connector definitions (disasterConnectors.ts)
  hooks/             # useIsDesktop, use-mobile, use-toast + 300 CROS hooks
  contexts/          # DemoModeContext + 7 CROS contexts (Auth, Tenant, etc.)
  config/            # brand.ts, mapbox.ts
```

---

## Supabase Migration Guide

### Database Tables Needed

**Core tables (new):**

```sql
-- Households (the people we serve)
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  family_name TEXT NOT NULL,
  head_of_household TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  disaster_type TEXT,
  disaster_event TEXT,
  disaster_date DATE,
  current_status TEXT CHECK (current_status IN ('acute','stabilizing','rebuilding','recovered')),
  assigned_volunteer_id UUID REFERENCES volunteers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_contact TIMESTAMPTZ
);

-- Household members
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  age INTEGER,
  special_needs TEXT
);

-- Needs
CREATE TABLE needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('critical','high','medium','low')),
  status TEXT CHECK (status IN ('unmet','in_progress','met')),
  what_matters TEXT,
  referred_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery journeys
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE
);

CREATE TABLE journey_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  stage TEXT CHECK (stage IN ('intake','assessment','stabilization','repair_rebuild','closure')),
  status TEXT CHECK (status IN ('completed','active','upcoming')),
  date DATE,
  notes TEXT,
  sort_order INTEGER
);

-- Field notes (case notes)
CREATE TABLE field_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('voice','text','photo')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('church','nonprofit','government','host_family','business')),
  services TEXT[],
  address TEXT,
  phone TEXT,
  contact_person TEXT,
  capacity TEXT CHECK (capacity IN ('available','limited','full')),
  trust_level TEXT CHECK (trust_level IN ('verified','established','new')),
  notes TEXT,
  lat NUMERIC,
  lng NUMERIC
);

-- Volunteers
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  skills TEXT[],
  availability TEXT,
  total_hours NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('active','on_break','new')),
  zone TEXT
);

-- NRI signals
CREATE TABLE nri_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  household_id UUID REFERENCES households(id),
  kind TEXT CHECK (kind IN ('stalled_case','quiet_need','connection_opportunity','celebration','heads_up')),
  title TEXT NOT NULL,
  summary TEXT,
  evidence JSONB,
  strength TEXT CHECK (strength IN ('emerging','growing','strong')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  household_id UUID REFERENCES households(id),
  donor_name TEXT NOT NULL,
  amount NUMERIC,
  date DATE,
  purpose TEXT,
  type TEXT CHECK (type IN ('monetary','in_kind','service'))
);

-- Shared notes (inter-org)
CREATE TABLE shared_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meaning observations (logotherapy layer)
CREATE TABLE meaning_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  date DATE,
  author TEXT,
  pathway TEXT CHECK (pathway IN ('creative','experiential','attitudinal')),
  observation TEXT
);
```

### API Service Layer → Edge Functions

Each function in `src/services/resourceApi.ts` has a TODO comment showing the real API endpoint. Create Supabase Edge Functions:

| Mock Function | Edge Function | Real API |
|--------------|---------------|----------|
| `searchFemaDisasters(state)` | `fema-disasters` | `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries` (no auth) |
| `getActiveAlerts(state)` | `weather-alerts` | `https://api.weather.gov/alerts/active?area={state}` (User-Agent header) |
| `searchJobs(location)` | `job-search` | USAJOBS API (free key) + JSearch via RapidAPI |
| `searchSnapRetailers(zip)` | `snap-retailers` | USDA ArcGIS Feature Service (no auth) |
| `searchShelters(city, state)` | `shelter-search` | Homeless Shelter API via RapidAPI |
| `search211Services(zip)` | `social-services` | 211 API Portal (free trial key) |
| `getFairMarketRent(zip)` | `hud-fmr` | HUD User API (free Bearer token) |
| `searchTransportation(address)` | `transportation` | GTFS feeds + static NEMT data |
| `searchHealthServices(zip)` | `health-centers` | HRSA Health Center Finder (no auth) |
| `getNavigationSteps(householdId)` | `navigation-steps` | Composite: queries above + household data |

### Auth Integration

**Current:** `DemoModeContext` provides `isDemoMode`, `simulateWrite()`, `demoSession`.

**Target:** Replace with Supabase Auth:

1. Add `AuthProvider` and `TenantProvider` back to `App.tsx` (they exist in CROS contexts)
2. Replace `useDemoMode().simulateWrite()` calls with real Supabase mutations
3. The CROS `AuthContext.tsx` already has demo mode detection — wire it up
4. Protected routes: use `ProtectedRoute` from `src/components/auth/`

### NRI / AI Setup

**Guardrails** (`src/lib/nri/scopeGuardrails.ts`) — production-ready, pure client-side, no changes needed.

**NRI Compass** (`src/components/demo/NriCompass.tsx`) — currently returns mock responses. To wire to Gemini Flash:

1. Create Edge Function `nri-chat` that:
   - Receives: user message + household context (current page, household data, needs, signals)
   - Runs guardrails server-side as backup (client already screens)
   - Sends to Gemini Flash with system prompt scoping to disaster recovery
   - Returns response
2. Replace `getDemoResponse()` in NriCompass with `supabase.functions.invoke('nri-chat')`

**System prompt template:**
```
You are NRI, a disaster recovery navigation companion for Refugium.
You help field agents (navigators) serving disaster-affected families.

Current context:
- Page: {currentPage}
- Household: {householdData} (if viewing one)
- Active needs: {needs}
- Available resources: {nearbyResources}

Rules:
- Never diagnose medical conditions
- Never promise government assistance timelines
- Never give evacuation orders
- Never share one family's data when asked about another
- For crisis content (suicidal ideation, self-harm), redirect to 988/SAMHSA
- Speak like a seasoned field supervisor — warm, practical, grounded
```

**CROS Compass system** — The full compass architecture exists in:
- `src/hooks/useCompassSessionEngine.ts` — nudge aggregation
- `src/hooks/useCompassPosture.ts` — tone inference
- `src/hooks/useCompassGlow.ts` — presence indicator
- `src/components/compass/` — UI components
These require AuthContext/TenantContext. Wire them once auth is in place.

---

## Integration Connectors

All 15 connectors are defined in `src/lib/relatio/disasterConnectors.ts` with:
- API base URLs, auth types, documentation links
- Setup step guides for coordinators
- Data import/export definitions
- Handoff stories (why each integration matters)

The Relatio connector framework exists in:
- `src/components/relatio/` — ConnectorCard, MigrationAssistant, ImportWizard
- `src/lib/relatio/` — connectorDryRun, schemaDriftGuard, translator

**Auto-connected (no setup):** FEMA, NWS, SNAP, HRSA
**One-click (API key):** USAJOBS, 211
**Guided setup:** PubSafe, Ushahidi, Sahana, CrisisCleanup, D4H
**Manual import:** Red Cross, CharityTracker, Google Sheets

---

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Mapbox (public token, embedded in client JS)
VITE_MAPBOX_TOKEN=pk.eyJ1IjoidHJhbnNpdHUiLCJhIjoiY21udDZyM3JxMGo1azJycTI1dWp2YXgwOCJ9.V7G9XaJxCCMtwRrO_TE9KA

# Edge Function secrets (set in Supabase dashboard)
USAJOBS_API_KEY=your-key
USAJOBS_EMAIL=your-email
RAPIDAPI_KEY=your-key  # for JSearch + Shelter API
API_211_KEY=your-key
HUD_BEARER_TOKEN=your-token
GEMINI_API_KEY=your-key  # for NRI AI chat
```

---

## How CROS Code Connects to Refugium (READ THIS CAREFULLY)

This repo contains TWO codebases layered on top of each other:

1. **Refugium demo layer** — the pages, components, and mock data you see when you run the app. This is the working demo. It lives in `src/pages/demo/`, `src/components/demo/`, and `src/data/`.

2. **CROS production layer** — a complete, battle-tested CRM framework with auth, tenancy, AI chat, calendar sync, reports, and 300+ hooks. It is DORMANT — not broken, not dead code. It was the original app that Refugium was built on top of. It lives in `src/contexts/`, `src/components/layout/`, `src/components/auth/`, `src/components/ai/`, `src/hooks/`, and `src/pages/` (non-demo pages).

**The CROS layer is NOT scaffolding to be rewritten. It is working code to be ACTIVATED.**

### The Migration Pattern: Demo → CROS

For each feature area, you are NOT building from scratch. You are swapping the demo mock version for the CROS real version. Here is exactly how:

#### Auth: `DemoModeContext` → `AuthContext` + `TenantContext`

| Demo (current) | CROS (activate this) |
|---|---|
| `src/contexts/DemoModeContext.tsx` — fake auth, `simulateWrite()` | `src/contexts/AuthContext.tsx` — real Supabase auth with session management |
| No login page — "Skip" button bypasses | `src/components/auth/LoginForm.tsx`, `SignupForm.tsx` — real forms |
| No route protection | `src/components/auth/ProtectedRoute.tsx` — wraps routes, checks auth |
| `useDemoMode()` hook | `useAuth()` hook from AuthContext |
| `demoSession.organization` | `useTenant()` → real tenant from `TenantContext.tsx` |

**What to do:** In `App.tsx`, add `<AuthProvider>` and `<TenantProvider>` wrapping the app. Replace `useDemoMode()` calls with `useAuth()`. Wrap app routes in `<ProtectedRoute>`.

#### App Shell: `DemoSidebar` + `DemoApp` → `MainLayout` + `Sidebar`

| Demo (current) | CROS (activate this) |
|---|---|
| `src/components/demo/DemoSidebar.tsx` — hardcoded nav groups | `src/components/layout/Sidebar.tsx` — dynamic nav from tenant config |
| `src/pages/demo/DemoApp.tsx` — demo shell with bottom tabs | `src/components/layout/MainLayout.tsx` — production shell with header, sidebar, breadcrumbs |
| `src/components/demo/DemoBanner.tsx` — "Read-only" banner | Not needed — remove in production |

**What to do:** Replace the `DemoApp` layout with `MainLayout`. The sidebar nav structure from `DemoSidebar` (Journeys, Partners, My Day, Stewardship groups) should be ported into the real Sidebar component.

#### AI Chat: `NriCompass` → `AIChatDrawer` + Compass System

| Demo (current) | CROS (activate this) |
|---|---|
| `src/components/demo/NriCompass.tsx` — hardcoded mock responses | `src/components/ai/AIChatDrawer.tsx` — real chat UI with streaming |
| `getDemoResponse()` function | `src/hooks/useAIChatSession.ts` — manages chat sessions |
| Simple posture inference | `src/hooks/useCompassPosture.ts` — full posture inference from context |
| Manual nudge generation | `src/hooks/useCompassSessionEngine.ts` — real nudge aggregation |
| No AI backend | Supabase Edge Function `nri-chat` → Gemini Flash API |

**What to do:** Keep the `NriCompass` UI pattern (the drawer, the posture indicator, the nudge panel) but swap `getDemoResponse()` for a real call to the Edge Function. The CROS hooks (`useCompassSessionEngine`, `useCompassPosture`, `useCompassGlow`) handle all the intelligence — they just need `AuthContext` to be active.

#### Pages: `src/pages/demo/*` → Real pages with hooks

Each demo page has a CROS equivalent or can be upgraded in-place:

| Demo Page | What It Does | How to Upgrade |
|---|---|---|
| `OrgDashboard.tsx` | Dashboard with Now/Trends tabs | Replace `useMemo(() => computeKPIs())` with `useHouseholds()` + `useNeeds()` Supabase hooks |
| `PeopleTab.tsx` | Household list with search/filter | Replace `import { households } from '@/data'` with `useHouseholds()` hook |
| `PersonDetailPage.tsx` | Full household detail with trail, map, needs | Replace `getHousehold(id)` with `useHousehold(id)` hook; replace `getNeedsForHousehold(id)` with `useNeeds(id)` hook |
| `RefugeTab.tsx` | Partner list with map | Replace `import { partners } from '@/data'` with `usePartners()` hook |
| `FlowTab.tsx` | Tasks + volunteers + schedule | Replace mock `DEMO_TASKS` with `useTasks()` hook |
| `BoardView.tsx` | Kanban by journey stage | Replace `households` import with `useHouseholds()` |
| `CalendarView.tsx` | Monthly calendar | CROS has `src/components/calendar/` with Google Calendar sync — USE IT |
| `ReportsPage.tsx` | PDF/CSV reports | CROS has `src/components/reports/` with full report builder — USE IT |
| `ProvisionsPage.tsx` | Supplies + donations | Replace `donations` import with `useDonations()` hook |

**The pattern is always the same:**
1. Keep the demo page's UI (it's already designed and working)
2. Replace `import { X } from '@/data'` with a Supabase hook
3. Each hook should check `isDemoMode` and return mock data as fallback
4. Replace `simulateWrite('...')` calls with real Supabase mutations (`supabase.from('table').insert(...)`)

#### Hooks: 300+ CROS hooks exist — DON'T REBUILD THEM

The `src/hooks/` directory has 300+ hooks. Many are CROS-specific and won't be needed, but these are directly usable:

| Hook | Purpose | Dependency |
|---|---|---|
| `useAuth()` | Current user, login/logout | `AuthContext` |
| `useTenant()` | Current org context | `TenantContext` |
| `useCompassSessionEngine()` | NRI nudge aggregation | Auth + Tenant |
| `useCompassPosture()` | AI tone inference | Auth |
| `useCompassGlow()` | Compass presence indicator | Auth |
| `useIsMobile()` | < 768px breakpoint | None |
| `useIsDesktop()` | >= 1024px breakpoint | None |
| `usePrintMode()` | Print media query | None |
| `use-toast` | Toast notifications | None |

**Do NOT rewrite these hooks.** If a hook fails because `AuthContext` doesn't exist yet, the fix is to add `AuthProvider` — not to rewrite the hook.

#### Contexts: 7 CROS contexts exist

| Context | File | When to Activate |
|---|---|---|
| `AuthContext` | `src/contexts/AuthContext.tsx` | Immediately — this is the foundation |
| `TenantContext` | `src/contexts/TenantContext.tsx` | Immediately — after auth |
| `DemoModeContext` | `src/contexts/DemoModeContext.tsx` | Keep as-is for demo mode fallback |
| `ImpersonationContext` | `src/contexts/ImpersonationContext.tsx` | After admin console is wired |
| `ViewModeContext` | `src/contexts/ViewModeContext.tsx` | After role-based views are needed |
| `NotificationContext` | `src/contexts/NotificationContext.tsx` | After Supabase Realtime is configured |
| `OnboardingContext` | `src/contexts/OnboardingContext.tsx` | After signup flow is wired |

### What NOT to Do

- **DO NOT** delete CROS files because they have TypeScript errors when `AuthContext` isn't provided. Fix the provider chain instead.
- **DO NOT** rewrite hooks that already exist. If `useCompassSessionEngine` throws because it can't find auth, the answer is to add `AuthProvider`, not to write a new hook.
- **DO NOT** create new page components for features that already have demo pages. Upgrade the demo page in place.
- **DO NOT** create a new sidebar component. Port the nav structure into the existing `Sidebar.tsx`.
- **DO NOT** build a new AI chat component. The `AIChatDrawer` exists — wire it to the Edge Function.
- **DO NOT** build new calendar, reports, or volunteer management UI. These exist in CROS `src/components/` — adapt them.

### The Correct Activation Order

1. **Add `AuthProvider` + `TenantProvider`** to `App.tsx` (wrap the router)
2. **Wire Login/Signup** to real Supabase Auth
3. **Add `ProtectedRoute`** to all app routes
4. **Create Supabase hooks** (`useHouseholds`, `useNeeds`, `usePartners`, `useVolunteers`, `useDonations`, `useSignals`) — each with `isDemoMode` fallback
5. **Swap imports** in each demo page: `from '@/data'` → the new hook
6. **Swap `simulateWrite()`** calls → real Supabase mutations
7. **Wire NRI chat** to Edge Function (keep `NriCompass` UI, replace `getDemoResponse()`)
8. **Activate CROS calendar** component with Google Calendar sync
9. **Activate CROS reports** component with real data
10. **Configure Stripe, Gmail, external APIs** via dashboard secrets

---

## What to Keep vs Delete

### KEEP (actively used — the demo app)
- Everything in `src/pages/demo/` — upgrade these pages in place
- Everything in `src/pages/marketing/` — the marketing site
- `src/pages/SurvivorPortal.tsx` — survivor secret-link portal
- `src/components/demo/`, `people/`, `refuge/`, `flow/`, `nri/`, `map/`, `shared/`, `marketing/`
- `src/components/ui/` — all 56 shadcn components (DO NOT MODIFY)
- `src/data/` — mock data (reference for schema + demo mode fallback)
- `src/services/` — API service layer (reference for Edge Functions)
- `src/lib/animations.ts`, `utils.ts`, `nri/`, `relatio/`
- `src/config/`, `src/hooks/useIsDesktop.ts`, `use-mobile.tsx`, `use-toast.ts`

### KEEP (CROS code — ACTIVATE, don't rewrite)
- `src/contexts/AuthContext.tsx`, `TenantContext.tsx` — auth/tenant providers
- `src/components/layout/` — real app shell (MainLayout, Sidebar, Header)
- `src/components/auth/` — ProtectedRoute, login/signup forms
- `src/components/ai/`, `compass/` — full NRI compass system
- `src/components/calendar/` — month/week views, Google Calendar sync
- `src/components/reports/` — report builder + PDF templates
- `src/components/volunteers/` — volunteer management UI
- `src/components/settings/` — integration cards, feature toggles
- `src/components/relatio/` — integration connectors, migration assistant
- `src/components/dashboard/` — 33 dashboard card components
- `src/hooks/useCompass*.ts`, `useAuth.ts`, `useTenant.ts` — core hooks

### SAFE TO DELETE (only after real auth is working)
- `src/components/demo/DemoBanner.tsx` — demo-only indicator
- `src/components/demo/DemoGuidedTour.tsx` — CROS-specific
- `src/components/demo/DemoSessionExpiry.tsx` — CROS-specific
- `src/components/demo/DemoActivityPulse.tsx` — CROS-specific

---

## Key Design Decisions

### Meaning Layer (Logotherapy)
Viktor Frankl's logotherapy is woven invisibly throughout:
- Need categories have `whatMatters` prompts (values-first intake)
- Needs can carry `whatMatters` field observations from field agents
- NRI signals detect meaning-related patterns without clinical terminology
- Daily Examen integrates whole-person care questions
- Meaning observations stored per household (creative/experiential/attitudinal pathways)
- A logotherapist would recognize it instantly. Everyone else thinks it's just a thoughtful app.

### Ignatian Foundation
The five daily movements (See, Discern, Act, Accompany, Restore) guide the weekly rhythm.
The 10 product principles from the knowledge transfer document inform every design decision.
The compass posture system adjusts NRI's tone based on context.

### Vintage Cartography Aesthetic
- Mapbox style: `mapbox://styles/transitu/cmns7i5r4000001si3upk9hai`
- CSS: Ignatian warm palette (cream, brown, gold, tan)
- Cards: `parchment-card` class, `field-note` class for italic serif
- Colors: muted vintage tones (emerald-50, sky-50, amber-50, stone-100)
- The Renewal Trail uses an organic SVG path with compass rose watermark

### "Refuge" not "Case"
We deliberately renamed "case" to "refuge" throughout. Each person/family served IS a refuge — the app helps organizations become that refuge.

### The Navigator Model
Field agents are "navigators," not case managers. The app is a compass, not a clipboard. Every screen points toward what matters right now.

### Survivor Portal
Accessed via `/r/:householdId` — no auth, no login. NRI greets them: "What do you need today?" Shows their community (by name), journey trail, resource map, and self-report checklist.

---

## Implementation Checklist — DO NOT SKIP

**"It compiles" is not "it works."** After building, audit every item below. A clean build with zero TypeScript errors does NOT mean the app is functional. Each of these has been missed in prior AI-assisted builds.

### 1. Auth Must Be Real (CRITICAL — Security)

- [ ] `Login.tsx` MUST call `supabase.auth.signInWithPassword()` — not just `navigate('/dashboard')`
- [ ] `Signup.tsx` MUST call `supabase.auth.signUp()` — not just `navigate('/onboarding')`
- [ ] Signup flow MUST create a tenant record and user profile in the database
- [ ] Add a "Check your email" verification screen after signup
- [ ] Add a "Forgot password?" link on the Login page → wire to `supabase.auth.resetPasswordForEmail()`
- [ ] Verify that visiting `/dashboard` directly WITHOUT being logged in redirects to `/login`

### 2. Route Protection (CRITICAL — Security)

- [ ] EVERY app route (`/dashboard`, `/people`, `/people/:id`, etc.) MUST be wrapped in a `<ProtectedRoute>` that checks `supabase.auth.getUser()` before rendering
- [ ] The existing `src/components/auth/ProtectedRoute.tsx` from CROS already does this — USE IT
- [ ] Unauthenticated users must be redirected to `/login`, not shown a blank page
- [ ] The survivor portal (`/r/:id`) is the ONLY route that should be accessible without auth

### 3. No Page Should Import Mock Data Directly

- [ ] Every page that displays data MUST go through a Supabase hook (e.g., `useHouseholds()`, `useNeeds()`)
- [ ] Each hook MUST have a mock fallback for demo mode: `if (isDemoMode) return mockData`
- [ ] Search the entire codebase for `from '@/data'` or `from '../data'` — any page-level import is a bug
- [ ] The `src/data/*.ts` files are REFERENCE ONLY for schema shape — they should not be imported by production pages

### 4. No "Coming Soon" Stubs in Production

- [ ] Search the entire codebase for `"Coming Soon"`, `"coming soon"`, `toast("Coming`)
- [ ] Every button that exists in the UI MUST do something real or be removed
- [ ] If a feature isn't ready, remove the button entirely — don't show a broken promise
- [ ] Specifically check: "Add Employer", "New Placement", "Match Mentor", and any similar CTA buttons

### 5. Database Security (CRITICAL)

- [ ] Review ALL RLS policies — any policy with `USING (true)` for INSERT/UPDATE/DELETE is a security hole
- [ ] Every write policy MUST scope to the authenticated user's tenant: `USING (tenant_id = auth.jwt() ->> 'tenant_id')`
- [ ] Check for `SECURITY DEFINER` views — these bypass RLS. Convert to `SECURITY INVOKER` unless there's a specific reason
- [ ] Run `SELECT * FROM pg_policies` and verify every table has appropriate read/write policies

### 6. API Keys and Secrets

- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` — set in `.env`
- [ ] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` — set in Supabase dashboard secrets (not `.env`)
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — set in Supabase dashboard secrets
- [ ] `GEMINI_API_KEY` — set in Supabase dashboard secrets (for NRI AI chat)
- [ ] `USAJOBS_API_KEY`, `RAPIDAPI_KEY`, `API_211_KEY`, `HUD_BEARER_TOKEN` — set in Supabase dashboard secrets
- [ ] Verify that NO secret keys are in client-side code (`VITE_` prefix = client-visible)
- [ ] If Stripe checkout buttons exist, verify they don't error silently when keys are missing — show a clear error

### 7. Demo Mode Must Actually Work

- [ ] `DemoGatePage.tsx` collects name/email — these MUST be persisted (even to localStorage) and used throughout the session
- [ ] Demo mode MUST create a temporary context (not a real tenant) so demo users can't see or affect real data
- [ ] `simulateWrite()` calls must show realistic toasts, not generic "saved" messages
- [ ] All demo pages must be navigable without auth — demo mode bypasses login

### 8. Onboarding Flow

- [ ] After signup, the onboarding flow MUST create: (1) a tenant record, (2) a user profile linked to that tenant, (3) default settings
- [ ] The onboarding form should collect: organization name, organization type, and at minimum the user's role
- [ ] After onboarding completes, redirect to `/dashboard` with the new tenant context active
- [ ] If a user visits `/onboarding` but already has a tenant, redirect them to `/dashboard`

### 9. Mobile Responsiveness

- [ ] Test at 360px viewport width (smallest common phone)
- [ ] Sidebar navigation needs a hamburger menu pattern on mobile (this is already built in the demo — port it)
- [ ] Bottom tab bar on mobile is already built — verify it renders on all app routes
- [ ] Forms, cards, and tables must not overflow horizontally on mobile
- [ ] The NRI Compass button must be accessible on both mobile and desktop

### 10. Data Export

- [ ] People list needs CSV export button
- [ ] Household detail page needs PDF export (already built with jsPDF — verify it works with real data)
- [ ] Reports page needs both PDF and CSV export
- [ ] Case notes should be exportable for funder compliance reports

### 11. Notification & Communication

- [ ] Add a notification bell/icon to the header or sidebar
- [ ] NRI signals should appear as in-app notifications, not just on the dashboard
- [ ] If Supabase Realtime is configured, wire it to push new signals/notes to connected clients

### 12. Audit Trail

- [ ] Case notes MUST have `created_at` and `updated_at` timestamps
- [ ] If case notes are editable, store edit history (for compliance — 42 CFR Part 2 may apply)
- [ ] Log who changed a household's status and when
- [ ] The `field_notes` table already has `created_at` — add `updated_at` and `updated_by`

### 13. Final Verification Checklist

Run these checks AFTER you think you're done:

```bash
# 1. Check for mock data imports in pages (should be zero)
grep -r "from '@/data'" src/pages/ --include="*.tsx" | grep -v "demo/" | grep -v ".test."

# 2. Check for "Coming Soon" stubs
grep -ri "coming soon" src/ --include="*.tsx"

# 3. Check for navigate-only auth (fake login)
grep -rn "navigate.*dashboard" src/pages/**/Login.tsx src/pages/**/Signup.tsx

# 4. Check for USING (true) in RLS policies
# Run in Supabase SQL editor:
# SELECT tablename, policyname, qual FROM pg_policies WHERE qual = 'true';

# 5. Check for missing route protection
grep -rn "<Route" src/ --include="*.tsx" | grep -v "ProtectedRoute" | grep -v "marketing" | grep -v "demo" | grep -v "SurvivorPortal"

# 6. Verify no secrets in client code
grep -rn "sk_live\|sk_test\|secret_key\|GOOGLE_CLIENT_SECRET" src/ --include="*.ts" --include="*.tsx"
```

---

## Testing the Demo

1. Marketing site: `/`
2. Enter demo: `/demo` → click "Skip — enter as guest"
3. Dashboard: `/demo/app/dashboard`
4. Open a refuge: click "Open Refuge" FAB → walk through wizard
5. View household: People → click any family → see Renewal Trail
6. NRI Compass: click compass button (bottom-left) → ask a question
7. Survivor portal: `/r/hh-001` → tap "Food" → see NRI response
8. Board view: `/demo/app/board` → see Kanban columns
9. Calendar: `/demo/app/calendar` → click days
10. All sidebar items are functional with demo content

---

## Contact

Built by Claude (Anthropic) in collaboration with the founder.
Patent application: CROS (Communal Relationship Operating System).
Knowledge transfer document: `Refugium Knowledge Transfer.pdf` in repo root.
Logotherapy references: 4 PDFs in repo root (Hutzell workbook, IFL journals).
