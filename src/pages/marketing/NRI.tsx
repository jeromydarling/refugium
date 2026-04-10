import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Brain,
  Eye,
  AlertTriangle,
  Lightbulb,
  ShieldOff,
  Bot,
  Database,
  Compass,
  TrendingUp,
  Clock,
  Users,
  Link2,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const nriDoes = [
  {
    icon: Eye,
    title: "Pattern recognition",
    description:
      "NRI watches for patterns across your entire caseload -- recurring needs, seasonal trends, and demographic clusters that would take weeks to notice manually.",
  },
  {
    icon: AlertTriangle,
    title: "Stalled case detection",
    description:
      "When a family's recovery has gone quiet for too long, NRI surfaces it gently. Not an alarm -- a nudge for your team to check in.",
  },
  {
    icon: Lightbulb,
    title: "Quiet signal surfacing",
    description:
      "The subtle things: a volunteer who's been overextended, a resource that keeps running out, a partner who hasn't responded in weeks. NRI notices so you can discern.",
  },
];

const nriDoesNot = [
  {
    icon: Bot,
    title: "No chatbot",
    description:
      "NRI is not a conversational AI. It doesn't talk to survivors or make recommendations without human discernment.",
  },
  {
    icon: ShieldOff,
    title: "No automated decisions",
    description:
      "NRI never closes a case, denies a resource, or changes a status. Every action requires a human being making a thoughtful choice.",
  },
  {
    icon: Database,
    title: "No data harvesting",
    description:
      "Your data stays yours. NRI works within your organization's data boundary. Nothing is sold, shared, or used to train external models.",
  },
];

const signalTypes = [
  {
    icon: Clock,
    title: "Stalled progress",
    description:
      "A household that hasn't had any activity, referral, or contact in a configurable number of days.",
  },
  {
    icon: TrendingUp,
    title: "Recurring patterns",
    description:
      "The same unmet need appearing across multiple households -- suggesting a systemic gap, not just an individual one.",
  },
  {
    icon: Users,
    title: "Capacity alerts",
    description:
      "A volunteer whose task count has crossed a threshold, or a team that's been short-staffed for consecutive weeks.",
  },
  {
    icon: Link2,
    title: "Connection opportunities",
    description:
      "Two households with complementary needs and resources -- a connection your team might not have thought to make.",
  },
];

export default function NRI() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-6">
            Narrative Relationship Intelligence
          </Badge>
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            The quiet engine that notices what humans miss.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            NRI is Refugium's pattern-detection layer. It watches the data your
            team already enters and surfaces signals worth paying attention
            to -- gently, respectfully, and always in service of human
            discernment.
          </p>
        </div>
      </section>

      {/* What NRI Does */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              What NRI does
            </h2>
            <p className="mt-3 text-muted-foreground">
              Careful attention at scale -- not artificial intelligence, but
              augmented attentiveness.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {nriDoes.map((item) => (
              <Card
                key={item.title}
                className="border-none bg-muted/40 shadow-sm"
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What NRI Does NOT */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              What NRI does not do
            </h2>
            <p className="mt-3 text-muted-foreground">
              Boundaries matter. Here is what NRI will never be.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {nriDoesNot.map((item) => (
              <Card
                key={item.title}
                className="border border-destructive/20 bg-background shadow-sm"
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <item.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Ignatian Principle */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-8 sm:p-12">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  Discernment before automation
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  In the Ignatian tradition, discernment is the practice of
                  paying attention to what matters before choosing how to
                  act. NRI is built on this principle. It never automates a
                  decision that belongs to a human being. Instead, it does
                  the patient work of noticing -- and then presents what it
                  finds to a person who can bring wisdom, context, and
                  compassion to the moment. Technology serves discernment.
                  Discernment serves the person.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Types */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              How NRI works: Signal types
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              NRI continuously monitors your organization's data and
              generates signals in four categories. Each signal is presented
              to your team for review -- never acted on automatically.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {signalTypes.map((signal) => (
              <div
                key={signal.title}
                className="flex gap-4 rounded-xl bg-background p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <signal.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {signal.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {signal.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* At a Glance: Does vs Doesn't */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-foreground sm:text-4xl">
            NRI at a glance
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-primary">
                <CheckCircle2 className="h-5 w-5" />
                NRI will
              </h3>
              <ul className="space-y-3">
                {[
                  "Surface patterns in your existing data",
                  "Flag cases that may need attention",
                  "Highlight resource gaps and trends",
                  "Suggest connections between people and partners",
                  "Respect every data boundary you set",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-destructive">
                <XCircle className="h-5 w-5" />
                NRI will never
              </h3>
              <ul className="space-y-3">
                {[
                  "Make decisions on behalf of your team",
                  "Contact survivors directly",
                  "Share data outside your organization",
                  "Replace human judgment or discernment",
                  "Optimize for speed over dignity",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-primary/5 to-primary/15 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            See NRI in action
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore the demo to see how NRI surfaces signals across a sample
            caseload. No signup required.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/demo">
              Try the Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
