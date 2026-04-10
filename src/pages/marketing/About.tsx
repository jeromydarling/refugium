import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  HandHelping,
  Compass,
  Footprints,
  Network,
  Users,
  HeartHandshake,
  Globe,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const principles = [
  {
    icon: Heart,
    title: "Dignity before data",
    description:
      "Every data field, every screen, every interaction begins with the question: does this honor the dignity of the person it represents? Data serves people -- never the reverse.",
  },
  {
    icon: HandHelping,
    title: "Accompaniment over processing",
    description:
      "Refugium is not a case-processing machine. It is a tool for accompaniment -- walking with survivors over time, not pushing them through a pipeline.",
  },
  {
    icon: Compass,
    title: "Discernment before automation",
    description:
      "We automate attention, not decisions. NRI surfaces patterns for humans to discern. The moment of choice always belongs to a person, never an algorithm.",
  },
  {
    icon: Footprints,
    title: "One next faithful step",
    description:
      "Recovery is not a checklist. Refugium helps your team identify and take the one next step that makes sense for each family -- and then the next one after that.",
  },
  {
    icon: Network,
    title: "Subsidiarity in design",
    description:
      "Decisions should be made as close to the ground as possible. Refugium gives local teams the tools to act on their own knowledge, not wait for distant authorities.",
  },
  {
    icon: Users,
    title: "Solidarity as infrastructure",
    description:
      "The Refuge module isn't just a directory -- it's an expression of solidarity. Your network of trusted partners is the infrastructure of care.",
  },
  {
    icon: HeartHandshake,
    title: "Cura personalis",
    description:
      "Care for the whole person. Refugium tracks not just material needs but the full arc of recovery -- emotional, spiritual, relational -- because people are not reducible to their needs.",
  },
  {
    icon: Globe,
    title: "The common good in every screen",
    description:
      "Every feature asks: does this serve the common good? Not just the efficiency of one organization, but the flourishing of the entire community of care.",
  },
  {
    icon: ShieldCheck,
    title: "Prefer the vulnerable",
    description:
      "When design trade-offs arise, we choose in favor of the most vulnerable. If a feature makes the admin's life easier but the survivor's harder, we redesign.",
  },
  {
    icon: Sparkles,
    title: "Magis rightly understood",
    description:
      "The Ignatian 'more' is not about doing more things -- it's about doing the right things more deeply. Refugium resists feature bloat in favor of depth, presence, and care.",
  },
];

export default function About() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            About Refugium
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            See the person. Discern the need. Strengthen the refuge.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Our mission
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Refugium exists to serve the small, faithful organizations who
              stay long after the cameras leave. The local disaster recovery
              teams, faith communities, VOADs, and nonprofits who do the
              sacred, exhausting work of walking with survivors through the
              long tail of recovery.
            </p>
            <p>
              We believe that every survivor deserves to be seen as a whole
              person -- not a case number, not a data point, not a line on a
              spreadsheet. And we believe that the people who serve them
              deserve tools worthy of the work they do.
            </p>
          </div>
        </div>
      </section>

      {/* Why Refugium */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-background p-8 shadow-sm sm:p-12">
            <Badge variant="outline" className="mb-4">
              The name
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Why "Refugium"?
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                <em className="font-medium text-foreground">Refugium</em> is
                Latin for "refuge," "shelter," or "sanctuary." In ecology, a
                refugium is a place where life persists through catastrophe --
                a pocket of survival from which renewal can spread.
              </p>
              <p>
                That's the work your organization does. In the aftermath of
                disaster, you create the conditions where families can
                survive, stabilize, and eventually flourish again. You are
                the refugium.
              </p>
              <p>
                This platform is named for you -- the shelter-makers, the
                accompaniers, the ones who refuse to look away. Our job is to
                strengthen the refuge you've already built.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Product Principles */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Ignatian foundation
            </Badge>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              10 Product Principles
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rooted in Ignatian spirituality and Catholic Social Teaching,
              these principles guide every design decision, feature choice,
              and line of code in Refugium.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <Card
                key={principle.title}
                className="border-none bg-muted/40 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <principle.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-primary/5 to-primary/15 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            See the principles in practice
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore the demo and see how these values shape every screen.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </div>
      </section>
    </div>
  );
}
