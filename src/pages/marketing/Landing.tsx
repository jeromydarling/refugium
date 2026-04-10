import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function Landing() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(196_65%_30%/0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Survivor-centered disaster recovery
            </Badge>
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
      </section>

      {/* ── Problem Statement ────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            In the weeks and months after disaster, the hardest work begins.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Small organizations do sacred, exhausting work on the ground. But
            spreadsheets break down, volunteers rotate out, and families slip
            through the cracks. The people who showed up first are still
            showing up months later -- with fewer resources, less visibility,
            and no system designed for the way they actually work. Refugium
            changes that.
          </p>
        </div>
      </section>

      {/* ── Three Pillars ────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Three pillars. One platform.
            </h2>
            <p className="mt-4 text-muted-foreground">
              People, Refuge, and Flow -- designed to work together the way
              your team already does.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* People */}
            <Card className="relative overflow-hidden border-none bg-background shadow-md transition-shadow hover:shadow-lg">
              <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl font-semibold">
                  People
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Every survivor is a story, not a case number. Track
                  households, unmet needs, and recovery journeys with the
                  dignity each person deserves.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Refuge */}
            <Card className="relative overflow-hidden border-none bg-background shadow-md transition-shadow hover:shadow-lg">
              <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl font-semibold">
                  Refuge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Your trusted network is the refuge. Build and maintain a
                  living directory of partners, resources, and referral
                  pathways you can count on.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Flow */}
            <Card className="relative overflow-hidden border-none bg-background shadow-md transition-shadow hover:shadow-lg">
              <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowUpDown className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl font-semibold">
                  Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Volunteer coordination that respects capacity. Match
                  willing hands to real needs without burning anyone out.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── NRI Teaser ───────────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-8 sm:p-12 lg:p-16">
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
                  connection no one thought to make. It surfaces signals for
                  your team to discern and act on. No chatbots. No automated
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
      </section>

      {/* ── For Whom ─────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20 sm:py-28">
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
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
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
                className="flex items-start gap-4 rounded-lg bg-background p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ──────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            $49/month. One price. One app. For everyone.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No tiers, no per-seat pricing, no surprises. Every feature,
            every user, every organization.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link to="/pricing">
              See pricing details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-primary/5 to-primary/15 py-20 sm:py-28">
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
      </section>
    </div>
  );
}
