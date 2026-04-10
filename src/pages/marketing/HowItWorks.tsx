import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  Shield,
  ArrowUpDown,
  Home,
  ClipboardList,
  Route,
  Mic,
  Brain,
  Handshake,
  BookOpen,
  Link2,
  StickyNote,
  UserCheck,
  ListTodo,
  CalendarClock,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const peopleFeatures = [
  {
    icon: Home,
    title: "Household records",
    description:
      "Organize recovery around families, not isolated individuals. See the full picture of who lives together and what they share.",
  },
  {
    icon: ClipboardList,
    title: "Unmet needs tracking",
    description:
      "Capture, categorize, and follow every need -- from immediate shelter to long-term rebuilding -- so nothing is forgotten.",
  },
  {
    icon: Route,
    title: "Case journey",
    description:
      "Visualize the arc of recovery. Understand where a family has been, where they are, and what the next faithful step might be.",
  },
  {
    icon: Mic,
    title: "Voice notes",
    description:
      "Record observations in the field. Context that would be lost in a spreadsheet is preserved in the survivor's own story.",
  },
  {
    icon: Brain,
    title: "NRI signals",
    description:
      "Narrative Relationship Intelligence surfaces patterns -- stalled cases, recurring needs, hidden connections -- so your team can act.",
  },
];

const refugeFeatures = [
  {
    icon: Handshake,
    title: "Trusted partners",
    description:
      "Build a curated directory of the organizations, agencies, and people your team actually trusts and refers to.",
  },
  {
    icon: BookOpen,
    title: "Resource directory",
    description:
      "Maintain a living catalog of available resources -- housing, food, legal aid, counseling -- searchable and always current.",
  },
  {
    icon: Link2,
    title: "211 / Findhelp integration",
    description:
      "Connect to national resource databases so you can discover services beyond your immediate network.",
  },
  {
    icon: StickyNote,
    title: "Institutional memory notes",
    description:
      "Capture what your team knows about each partner -- the real story, not just the website. Wisdom that stays when staff rotate.",
  },
];

const flowFeatures = [
  {
    icon: UserCheck,
    title: "Volunteer roster",
    description:
      "Know who is available, what they can do, and how much capacity they have. Respect the people who show up.",
  },
  {
    icon: ListTodo,
    title: "Task coordination",
    description:
      "Create, assign, and track tasks that connect volunteers to real needs -- with clear context and follow-through.",
  },
  {
    icon: CalendarClock,
    title: "Shift scheduling",
    description:
      "Organize coverage across days and weeks. See gaps before they become problems.",
  },
  {
    icon: HeartPulse,
    title: "Capacity awareness",
    description:
      "Monitor volunteer workload and burnout risk. The people serving survivors deserve care too.",
  },
];

function FeatureList({
  features,
}: {
  features: { icon: React.ElementType; title: string; description: string }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="border-none bg-muted/40 shadow-sm"
        >
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            How Refugium Works
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Three integrated modules -- People, Refuge, and Flow -- designed
            to work together the way your team already does. No complexity
            you didn't ask for.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="people" className="w-full">
            <div className="mb-12 flex justify-center">
              <TabsList className="grid h-auto w-full max-w-lg grid-cols-3 gap-1 p-1">
                <TabsTrigger
                  value="people"
                  className="flex items-center gap-2 py-2.5"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">People</span>
                </TabsTrigger>
                <TabsTrigger
                  value="refuge"
                  className="flex items-center gap-2 py-2.5"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Refuge</span>
                </TabsTrigger>
                <TabsTrigger
                  value="flow"
                  className="flex items-center gap-2 py-2.5"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Flow</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="people">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  People: Household Recovery
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  Every survivor is a story, not a case number. The People
                  module organizes recovery around families and helps your
                  team see the whole person.
                </p>
              </div>
              <FeatureList features={peopleFeatures} />
            </TabsContent>

            <TabsContent value="refuge">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  Refuge: Trusted Partner Directory
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  Your trusted network is the refuge. Build a living,
                  institutional-memory-rich directory of the partners and
                  resources your team relies on.
                </p>
              </div>
              <FeatureList features={refugeFeatures} />
            </TabsContent>

            <TabsContent value="flow">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <ArrowUpDown className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  Flow: Volunteer Coordination
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                  Volunteer coordination that respects capacity. Match
                  willing hands to real needs without burning anyone out.
                </p>
              </div>
              <FeatureList features={flowFeatures} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            See it in action
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore the full platform with sample data. No signup required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/demo">
                Try the Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/nri">Learn about NRI</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Full platform access
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
