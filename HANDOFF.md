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

## What to Keep vs Delete

### KEEP (actively used or ready to wire)
- Everything in `src/pages/demo/` — the entire demo app
- Everything in `src/pages/marketing/` — the marketing site
- `src/pages/SurvivorPortal.tsx` — survivor secret-link portal
- `src/components/demo/`, `people/`, `refuge/`, `flow/`, `nri/`, `map/`, `shared/`, `marketing/`
- `src/components/ui/` — all 56 shadcn components
- `src/data/` — mock data (reference for schema)
- `src/services/` — API service layer (reference for Edge Functions)
- `src/lib/animations.ts`, `utils.ts`, `nri/`, `relatio/`
- `src/config/`, `src/hooks/useIsDesktop.ts`, `use-mobile.tsx`, `use-toast.ts`

### KEEP (CROS code ready for adaptation)
- `src/components/layout/` — real app shell
- `src/components/auth/` — protected routes
- `src/components/dashboard/` — 33 dashboard components
- `src/components/calendar/` — Google Calendar sync
- `src/components/contacts/` — contact management
- `src/components/reports/` — report builder + PDF
- `src/components/volunteers/` — volunteer management
- `src/components/settings/` — org configuration
- `src/components/admin/`, `operator/` — admin console
- `src/components/ai/`, `compass/` — full NRI compass system
- `src/components/relatio/` — integration framework
- `src/contexts/AuthContext.tsx`, `TenantContext.tsx` — auth/tenant providers
- `src/pages/` (CROS pages) — Dashboard, CommandCenter, People, PersonDetail, Pipeline, Volunteers, Events, Calendar, Reports, Metros, etc.

### SAFE TO DELETE (after migration)
- `src/pages/demo/` — replaced by real pages once auth is wired
- `src/components/demo/DemoBanner.tsx` — demo-only
- `src/components/demo/DemoSidebar.tsx` — replaced by real Sidebar
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
