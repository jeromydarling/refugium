import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, CheckCircle2, MapPin, Compass, Users, Shield,
  ArrowUpDown, Heart, Brain, Church, Building2, HandHelping,
  Clock, AlertTriangle, Zap, ExternalLink,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { StaggerList } from "@/components/shared/StaggerList";
import { WavesDivider } from "@/components/marketing/WavesDivider";
import { MAPBOX_TOKEN, MAP_DEFAULTS, PARTNER_TYPE_COLORS } from "@/config/mapbox";
import { partners } from "@/data";

// ── Stat card component ──
function StatCard({ number, label, source }: { number: string; label: string; source: string }) {
  return (
    <Card className="p-6 text-center parchment-card">
      <p className="font-serif text-4xl font-bold text-primary">{number}</p>
      <p className="text-sm text-foreground mt-2">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-2 italic">{source}</p>
    </Card>
  );
}

// ── Mini browser preview ──
function BrowserPreview({ title, url, children }: { title: string; url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
      <div className="bg-muted/60 px-3 py-2 flex items-center gap-2 border-b">
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] text-muted-foreground font-medium ml-2">{title}</span>
        <span className="text-[9px] text-muted-foreground/50 ml-auto bg-muted rounded px-2 py-0.5 truncate max-w-[120px]">{url}</span>
      </div>
      <div className="bg-background p-4 max-h-[280px] overflow-hidden">{children}</div>
    </div>
  );
}

export default function Landing() {
  const heroMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !heroMapRef.current || mapInstanceRef.current) return;
    try {
      (mapboxgl as any).accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: heroMapRef.current,
        style: MAP_DEFAULTS.style,
        center: [-91.1871, 30.4515],
        zoom: 9,
        interactive: false,
        attributionControl: false,
      });
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.touchZoomRotate.disable();
      map.on("load", () => {
        partners.forEach((p) => {
          const el = document.createElement("div");
          el.style.cssText = `width:10px;height:10px;border-radius:50%;background:${PARTNER_TYPE_COLORS[p.type] || "#6b7280"};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)`;
          new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
        });
      });
      mapInstanceRef.current = map;
    } catch (e) { console.error("[Landing] map error:", e); }
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] bg-background">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div ref={heroMapRef} className="w-full h-full" style={{ opacity: 0.25 }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <Badge variant="secondary" className="mb-6">Survivor-centered disaster recovery</Badge>
            </motion.div>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The cameras leave. The volunteers go home. Recovery is just beginning.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              1 million Americans are displaced by disaster every year. FEMA assistance ends at 18 months.
              But recovery takes 3.5 to 5.9 years. Refugium is the compass for what comes next.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg"><Link to="/demo">Try the Demo <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="#the-gap">See Why It Matters</Link></Button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-6">Sources: Urban Institute, FEMA, ACF/OPRE</p>
          </div>
        </div>
      </section>

      <WavesDivider className="w-full h-8" />

      {/* ═══════ THE GAP ═══════ */}
      <AnimatedSection className="bg-background py-20 sm:py-28" id="the-gap">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">The gap no one talks about</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              The federal system was built for the response phase — the first 72 hours. But recovery takes years.
              And in the space between crisis and wholeness, millions of families are left to figure it out alone.
            </p>
          </div>
          <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard number="~90%" label="of FEMA individual assistance applicants are denied" source="Washington Post, 2021" />
            <StatCard number="18 mo" label="when federal disaster assistance ends — but recovery takes 3.5–5.9 years" source="Urban Institute" />
            <StatCard number="6 weeks" label="when half of all disaster donations have already been made" source="The Conversation" />
            <StatCard number="9 mo" label="when federally funded crisis counseling ends — but 16.7% have PTSD a decade later" source="FEMA / PMC" />
            <StatCard number="30+" label="federal entities a survivor must navigate, each with separate applications" source="U.S. GAO" />
            <StatCard number="16%" label="of displaced adults never return home" source="ACF/OPRE, 2023" />
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ═══════ THE COMMUNITY ANSWER ═══════ */}
      <AnimatedSection className="parchment py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="h-10 w-10 text-[hsl(var(--ignatian-gold))] mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">The state responds. The community recovers.</h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FEMA wasn't designed to walk someone to the pharmacy. A federal form can't notice that a father
            stopped talking about the future. A government database doesn't remember that Pastor David opens
            the fellowship hall within hours of any storm and his kitchen serves 200 meals.
          </p>
          <p className="mt-4 text-lg text-foreground font-serif italic">
            But a parish can. A neighbor can. A small nonprofit with 8 volunteers and 15 families can —
            if they have the right tools.
          </p>
          <p className="mt-6 text-muted-foreground">
            Refugium makes it easy for a community to rally around someone who's been knocked down —
            and stay with them until they're standing again.
          </p>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ═══════ WHAT IT LOOKS LIKE ═══════ */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Built for the field. Designed with heart.</h2>
            <p className="mt-4 text-muted-foreground">Every screen is a compass pointing toward what matters right now.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <BrowserPreview title="Recovery Roadmap" url="refugium.app/people/martinez">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {["Intake", "Assess", "Stabilize", "Rebuild", "Restored"].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] ${i < 2 ? "bg-emerald-50 text-emerald-800" : i === 2 ? "bg-primary/15 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`}>
                        {i < 2 ? "✓" : i === 2 ? "●" : "○"}
                      </div>
                      <span className="text-[8px] text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
                <Card className="p-2 border-l-2 border-l-primary text-[10px]">
                  <p className="font-medium">Get Elena's medication</p>
                  <p className="text-muted-foreground">St. Francis · 1.8mi · Bus #44</p>
                </Card>
                <Card className="p-2 border-l-2 border-l-amber-400 text-[10px]">
                  <p className="font-medium">Apply for D-SNAP</p>
                  <p className="text-muted-foreground">DCFS Office · 1.1mi · Walk-in</p>
                </Card>
              </div>
            </BrowserPreview>

            <BrowserPreview title="Resource Map" url="refugium.app/refuge">
              <div className="space-y-2">
                <p className="text-xs font-medium">15 organizations nearby</p>
                <div className="h-24 rounded-lg bg-gradient-to-br from-[hsl(var(--ignatian-cream))] to-[hsl(var(--ignatian-bg-end))] flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-[hsl(var(--ignatian-gold))]" />
                </div>
                {[{ name: "First Baptist Church", type: "church", color: "#6d5a8a" }, { name: "Catholic Charities", type: "nonprofit", color: "#5a7a9a" }, { name: "Rodriguez Host Family", type: "host_family", color: "#b07a7a" }].map(p => (
                  <div key={p.name} className="flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground ml-auto">{p.type.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </BrowserPreview>

            <BrowserPreview title="NRI Compass" url="refugium.app/compass">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[hsl(var(--ignatian-brown))]" />
                  <span className="text-xs font-semibold">NRI Compass</span>
                </div>
                <p className="text-[10px] italic text-muted-foreground">Care posture</p>
                <Card className="p-2 text-[10px]">
                  <div className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                    <p>3 families haven't been contacted in over 2 weeks.</p>
                  </div>
                </Card>
                <div className="space-y-1">
                  {["What should I focus on today?", "Which families need attention?"].map(q => (
                    <div key={q} className="text-[9px] px-2 py-1.5 rounded border text-muted-foreground">{q}</div>
                  ))}
                </div>
              </div>
            </BrowserPreview>
          </div>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ═══════ HOW IT WORKS ═══════ */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">A compass, not a clipboard</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Most disaster tools are built for the response phase. Refugium is built for recovery —
              the longer, harder, quieter work of rebuilding lives.
            </p>
          </div>
          <StaggerList className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Users, title: "See every journey", desc: "Track households from intake to restoration. NRI notices what you might miss — stalled progress, quiet needs, meaning that's fading." },
              { icon: Shield, title: "Find every resource", desc: "Jobs, medical care, transit, food, shelter, legal aid — matched to each family's specific needs, with directions and what to bring." },
              { icon: ArrowUpDown, title: "Navigate every day", desc: "Calendar, visits, weekly rhythm, Ignatian reflection. The field agent's daily companion — so no one is forgotten." },
            ].map(f => (
              <Card key={f.title} className="p-6 parchment-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </Card>
            ))}
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ═══════ EQUITY ═══════ */}
      <AnimatedSection className="parchment py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center sm:text-4xl">Disasters don't hit everyone equally</h2>
          <div className="mt-10 space-y-6">
            {[
              { stat: "46% vs 10%", text: "FEMA denial rate for low-income families vs. higher earners", src: "Texas Housers, 2018" },
              { stat: "5–10% less", text: "FEMA aid awarded to Black neighborhoods", src: "Center for American Progress" },
              { stat: "Wealth lost", text: "After major disasters, white residents gained wealth. Black, Hispanic, and Asian residents in the same counties lost it.", src: "CNN, 2023" },
            ].map(item => (
              <div key={item.stat} className="flex items-start gap-4 p-5 rounded-xl bg-background border border-border/50">
                <p className="font-serif text-2xl font-bold text-primary shrink-0 w-32 text-right">{item.stat}</p>
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">{item.src}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-muted-foreground">
            Refugium tracks every family at the household level — so the organizations doing this work can see who's falling behind and why.
          </p>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ═══════ FOR WHOM ═══════ */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Built for the organizations that stay</h2>
            <p className="mt-2 text-sm text-muted-foreground italic">
              "The Last Responders — approaching the disaster after the disaster."
              <span className="not-italic"> — Homeland Security Affairs</span>
            </p>
          </div>
          <StaggerList className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Church, title: "Faith-based disaster teams", desc: "Churches, parishes, interfaith coalitions. The ones who open their doors when the storm hits — and keep them open for years." },
              { icon: Building2, title: "Long-Term Recovery Groups", desc: "VOAD-adjacent organizations racing against dwindling public interest and resources." },
              { icon: HandHelping, title: "Local disaster relief nonprofits", desc: "Community foundations, mutual aid networks, neighborhood helpers." },
              { icon: Heart, title: "Refugee & migrant support", desc: "Organizations serving displaced people who face recovery with even fewer resources." },
            ].map(a => (
              <Card key={a.title} className="p-5 parchment-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </Card>
            ))}
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ═══════ SURVIVOR PORTAL ═══════ */}
      <AnimatedSection className="parchment py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Every person gets their own map to renewal</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A secret link — no login, no account, no burden. NRI greets them: "What do you need today?"
            Then helps them find food, medical care, jobs, transportation, legal aid — anything.
          </p>
          <div className="mt-8 inline-block parchment-card p-6 rounded-xl text-left max-w-sm mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="h-5 w-5 text-[hsl(var(--ignatian-gold))]" />
              <span className="font-serif font-bold">Hi Maria</span>
            </div>
            <p className="text-sm text-muted-foreground">What do you need today?</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {["Food", "Medical", "A ride", "Work"].map(n => (
                <div key={n} className="text-xs px-3 py-2 rounded-lg border text-center">{n}</div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" size="sm">
              <Link to="/r/hh-001">See the survivor view <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ═══════ INTEGRATIONS ═══════ */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">We're not replacing your crisis tools. We're what comes next.</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              When the response phase ends, Refugium picks up the thread — so no family is lost in the handoff.
            </p>
          </div>
          <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "PubSafe", desc: "Import volunteers and incident data" },
              { name: "Ushahidi", desc: "Turn crisis map pins into recovery journeys" },
              { name: "Sahana Eden", desc: "Import shelter registries and displaced persons" },
              { name: "CrisisCleanup", desc: "Continue the journey after cleanup is done" },
              { name: "Red Cross", desc: "Import damage assessments and case files" },
              { name: "FEMA OpenData", desc: "Auto-detect disasters and assistance programs" },
            ].map(i => (
              <Card key={i.name} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.desc}</p>
                </div>
              </Card>
            ))}
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ═══════ PRICING ═══════ */}
      <AnimatedSection className="parchment py-20 sm:py-28">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold">$49/month</h2>
          <p className="text-muted-foreground mt-2">One price. One app. For everyone.</p>
          <p className="text-sm text-muted-foreground mt-4">
            No per-user fees. No tiers. No add-ons. Because the organizations doing this work
            shouldn't have to choose between features and budget.
          </p>
          <div className="mt-6 space-y-2 text-sm text-left max-w-xs mx-auto">
            {["Unlimited users", "All features included", "NRI intelligence", "Survivor portal", "API integrations", "Cancel anytime"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8"><Link to="/demo">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">No one should have to figure out recovery alone.</h2>
          <p className="mt-4 text-muted-foreground">
            Refugium exists because neighbors helping neighbors — with the right tools — can do what no federal program ever will: see one person, know their name, and walk beside them until they're whole.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg"><Link to="/demo">Try the Demo <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/pricing">$49/month — Start Now</Link></Button>
          </div>
          <p className="mt-10 text-xs text-muted-foreground italic font-serif">
            "He who has a why to live for can bear almost any how." — Viktor Frankl
          </p>
        </div>
      </section>
    </div>
  );
}
