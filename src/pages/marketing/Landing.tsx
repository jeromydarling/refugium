import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  ArrowUpDown,
  Brain,
  Heart,
  Church,
  Building2,
  HandHelping,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Compass,
  MessageSquare,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { StaggerList } from "@/components/shared/StaggerList";
import { cardHover } from "@/lib/animations";
import { WavesDivider } from "@/components/marketing/WavesDivider";
import { MAPBOX_TOKEN, MAP_DEFAULTS, PARTNER_TYPE_COLORS } from "@/config/mapbox";
import { partners } from "@/data";

// ── Mini Browser Chrome ─────────────────────────────────────
function BrowserChrome({
  title,
  url,
  children,
}: {
  title: string;
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl shadow-xl border border-border/40">
      {/* Title bar */}
      <div className="flex items-center gap-2 bg-muted/80 px-3 py-2 border-b border-border/30">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="flex-1 text-center text-xs font-medium text-muted-foreground truncate">
          {title}
        </span>
      </div>
      {/* URL bar */}
      <div className="bg-muted/50 px-3 py-1.5 border-b border-border/20">
        <div className="mx-auto max-w-[90%] rounded-md bg-background/80 px-3 py-1 text-[10px] text-muted-foreground/60 text-center truncate">
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="max-h-[320px] overflow-hidden bg-background">{children}</div>
    </div>
  );
}

// ── Mini App Preview: Recovery Roadmap ──────────────────────
function PreviewRoadmap() {
  const steps = [
    { label: "Intake", done: true },
    { label: "Assessment", done: true },
    { label: "Stabilization", current: true },
    { label: "Rebuild", done: false },
    { label: "Restored", done: false },
  ];
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-serif text-sm font-semibold text-foreground">
        Renewal Trail
      </h3>
      {/* 5-dot path */}
      <div className="flex items-center justify-between px-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-1 relative">
            {i > 0 && (
              <div
                className={`absolute top-2.5 right-full w-full h-0.5 -translate-y-1/2 ${
                  step.done || step.current ? "bg-primary/40" : "bg-border"
                }`}
                style={{ width: "calc(100% + 0.5rem)", right: "50%" }}
              />
            )}
            <div
              className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                step.done
                  ? "bg-primary text-primary-foreground"
                  : step.current
                    ? "bg-primary/20 ring-2 ring-primary text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.done ? "\u2713" : ""}
            </div>
            <span
              className={`text-[9px] leading-tight text-center ${
                step.current ? "font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {/* Connecting line behind dots */}
      <div className="relative -mt-[42px] mx-6 mb-6">
        <div className="absolute top-[10px] left-0 right-0 h-0.5 bg-border" />
      </div>
      {/* Next steps cards */}
      <div className="space-y-2 pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Next Steps
        </p>
        <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <p className="text-xs font-medium text-foreground">
            Submit insurance documentation
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Due by April 15</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
          <p className="text-xs font-medium text-foreground">
            Schedule home assessment visit
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Habitat for Humanity available
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Mini App Preview: Resource Map ──────────────────────────
function PreviewResourceMap() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="font-serif text-sm font-semibold text-foreground">
          15 organizations nearby
        </h3>
      </div>
      {/* Map placeholder */}
      <div className="h-32 rounded-lg bg-gradient-to-br from-primary/5 via-accent/5 to-muted/30 flex items-center justify-center border border-border/20">
        <div className="text-center">
          <MapPin className="h-6 w-6 text-primary/30 mx-auto" />
          <p className="text-[10px] text-muted-foreground/50 mt-1">
            Baton Rouge, LA
          </p>
        </div>
      </div>
      {/* Partner rows */}
      <div className="space-y-1.5">
        {[
          { name: "First Baptist Church", type: "church" },
          { name: "Habitat for Humanity", type: "nonprofit" },
          { name: "FEMA Recovery Center", type: "government" },
        ].map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  PARTNER_TYPE_COLORS[p.type] || "#6b7280",
              }}
            />
            <span className="text-xs text-foreground truncate">{p.name}</span>
            <span className="ml-auto text-[9px] text-muted-foreground capitalize">
              {p.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mini App Preview: NRI Compass ───────────────────────────
function PreviewNRICompass() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-primary" />
        <h3 className="font-serif text-sm font-semibold text-foreground">
          NRI Compass
        </h3>
      </div>
      <div className="rounded-lg border border-border/50 bg-primary/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Care posture
        </p>
        <div className="mt-2 rounded-md bg-background p-2.5 border border-border/30">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              3 families haven't been contacted in 2 weeks. Consider a
              check-in call before the weekend.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Quick prompts
        </p>
        <button className="w-full text-left rounded-md border border-border/40 bg-muted/20 px-3 py-2 text-xs text-foreground hover:bg-muted/40 transition-colors">
          What should I focus on today?
        </button>
        <button className="w-full text-left rounded-md border border-border/40 bg-muted/20 px-3 py-2 text-xs text-foreground hover:bg-muted/40 transition-colors">
          Which families need attention?
        </button>
      </div>
    </div>
  );
}

// ── Main Landing Page ───────────────────────────────────────
export default function Landing() {
  const heroMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !heroMapRef.current || mapInstanceRef.current) return;

    try {
      (mapboxgl as Record<string, unknown>).accessToken = MAPBOX_TOKEN;

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
      map.doubleClickZoom.disable();
      map.keyboard.disable();
      map.dragRotate.disable();
      map.touchPitch.disable();

      map.on("load", () => {
        partners.forEach((partner) => {
          const color = PARTNER_TYPE_COLORS[partner.type] || "#6b7280";
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = color;
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";

          new mapboxgl.Marker({ element: el })
            .setLngLat([partner.lng, partner.lat])
            .addTo(map);
        });
      });

      mapInstanceRef.current = map;
    } catch (e) {
      console.error("[Landing] Hero map error:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <AnimatedSection className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background">
        {/* Live map background */}
        <div
          ref={heroMapRef}
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          aria-hidden="true"
        />

        {/* Warm overlay on top of map */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Badge variant="secondary" className="mb-6">
                Survivor-centered disaster recovery
              </Badge>
            </motion.div>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              See the person. Discern the need. Strengthen the refuge.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              When the cameras leave and the long tail of recovery begins,
              Refugium helps small humanitarian organizations keep every family
              visible, connected, and moving toward wholeness.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/demo">
                  Try the Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link to="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ── Mini Browser Screenshots ─────────────────────────────── */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Built for the field. Designed with heart.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tools that respect the weight of the work your team carries every
              day.
            </p>
          </div>
          <StaggerList className="grid gap-6 md:grid-cols-3">
            <motion.div {...cardHover} className="transform-gpu md:scale-100 scale-95">
              <BrowserChrome
                title="Recovery Roadmap"
                url="app.refugium.org/households/h-001/journey"
              >
                <PreviewRoadmap />
              </BrowserChrome>
            </motion.div>
            <motion.div {...cardHover} className="transform-gpu md:scale-100 scale-95">
              <BrowserChrome
                title="Resource Map"
                url="app.refugium.org/partners/map"
              >
                <PreviewResourceMap />
              </BrowserChrome>
            </motion.div>
            <motion.div {...cardHover} className="transform-gpu md:scale-100 scale-95">
              <BrowserChrome
                title="NRI Compass"
                url="app.refugium.org/nri/compass"
              >
                <PreviewNRICompass />
              </BrowserChrome>
            </motion.div>
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ── Problem Statement ────────────────────────────────────── */}
      <AnimatedSection className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            In the weeks and months after disaster, the hardest work begins.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Small organizations do sacred, exhausting work on the ground. But
            spreadsheets break down, volunteers rotate out, and families slip
            through the cracks. The people who showed up first are still showing
            up months later -- with fewer resources, less visibility, and no
            system designed for the way they actually work. Refugium changes
            that.
          </p>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ── Three Pillars ────────────────────────────────────────── */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Three pillars. One platform.
            </h2>
            <p className="mt-4 text-muted-foreground">
              People, Refuge, and Flow -- designed to work together the way your
              team already does.
            </p>
          </div>
          <StaggerList className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "People",
                description:
                  "Every survivor is a story, not a case number. Track households, unmet needs, and recovery journeys with the dignity each person deserves.",
              },
              {
                icon: Shield,
                title: "Refuge",
                description:
                  "Your trusted network is the refuge. Build and maintain a living directory of partners, resources, and referral pathways you can count on.",
              },
              {
                icon: ArrowUpDown,
                title: "Flow",
                description:
                  "Volunteer coordination that respects capacity. Match willing hands to real needs without burning anyone out.",
              },
            ].map((pillar) => (
              <motion.div key={pillar.title} {...cardHover}>
                <Card className="relative overflow-hidden border-none bg-background shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <pillar.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-xl font-semibold">
                      {pillar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ── NRI Teaser ───────────────────────────────────────────── */}
      <AnimatedSection className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="parchment-card mx-auto max-w-4xl rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-4">
                  Narrative Relationship Intelligence
                </Badge>
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  NRI: The quiet engine that notices what humans miss.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  NRI watches for patterns across your caseload -- a family
                  whose progress has stalled, a need that keeps appearing, a
                  connection no one thought to make. It surfaces signals for your
                  team to discern and act on. No chatbots. No automated
                  decisions. Just careful attention at scale.
                </p>
                <Button asChild variant="link" className="mt-4 px-0">
                  <Link to="/nri">
                    Learn about NRI
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ── For Whom ─────────────────────────────────────────────── */}
      <AnimatedSection className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Built for organizations doing sacred work.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Refugium is designed for the teams who stay long after the
              spotlight fades.
            </p>
          </div>
          <StaggerList className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {[
              {
                icon: HandHelping,
                label: "VOAD-adjacent groups and local LTRGs",
              },
              {
                icon: Church,
                label: "Faith-based disaster recovery teams",
              },
              {
                icon: Heart,
                label: "Refugee and immigrant support organizations",
              },
              {
                icon: Building2,
                label: "Community foundations and local nonprofits",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-lg bg-muted/30 p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </StaggerList>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" flip />

      {/* ── Pricing Preview ──────────────────────────────────────── */}
      <AnimatedSection className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            $49/month. One price. One app. For everyone.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No tiers, no per-seat pricing, no surprises. Every feature, every
            user, every organization.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link to="/pricing">
              See pricing details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AnimatedSection>

      <WavesDivider className="w-full h-8" />

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <AnimatedSection className="bg-primary/5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Ready to strengthen the refuge?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            See how Refugium can help your team keep every family visible,
            connected, and moving forward.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/demo">
                Try the Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Full platform access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Cancel anytime
            </span>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
