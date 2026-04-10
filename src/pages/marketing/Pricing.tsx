import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { scaleIn } from "@/lib/animations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Users,
  Shield,
  ArrowUpDown,
  Brain,
  Infinity as InfinityIcon,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: Users, label: "People -- full household recovery module" },
  { icon: Shield, label: "Refuge -- trusted partner directory" },
  { icon: ArrowUpDown, label: "Flow -- volunteer coordination" },
  { icon: Brain, label: "NRI -- Narrative Relationship Intelligence" },
  { icon: InfinityIcon, label: "Unlimited users and team members" },
  { icon: Layers, label: "No tiers, no feature gates, no add-ons" },
];

const faqs = [
  {
    question: "Why one flat price instead of tiers?",
    answer:
      "Because the organizations doing this work shouldn't have to calculate whether they can afford the feature that would help a family. Every team gets the full platform -- People, Refuge, Flow, and NRI -- for one price. Dignity shouldn't be a premium feature.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You can explore the full platform with the interactive demo -- no signup, no credit card. When you're ready to use Refugium with your own data, we offer a 30-day free trial with complete access to every feature.",
  },
  {
    question: "What does 'unlimited users' mean?",
    answer:
      "It means exactly what it says. Add your entire team -- case managers, volunteers, coordinators, board members -- without worrying about per-seat costs. The $49/month covers your entire organization, no matter how many people need access.",
  },
  {
    question: "Can we get a discount for being a nonprofit?",
    answer:
      "The $49/month price is already designed with small nonprofits and faith-based organizations in mind. It's our way of keeping the platform accessible to the teams who need it most. If your organization is in genuine financial hardship, reach out to us -- we'll find a way.",
  },
];

export default function Pricing() {
  return (
    <div>
      {/* Header */}
      <AnimatedSection className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Simple, honest pricing.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            One price. One app. Everything included. Because the work you do
            is too important for pricing games.
          </p>
        </div>
      </AnimatedSection>

      {/* Pricing Card */}
      <AnimatedSection className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-lg">
            <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="pb-4 pt-10 text-center">
              <Badge variant="secondary" className="mx-auto mb-4 w-fit">
                Everything included
              </Badge>
              <CardTitle className="font-serif text-5xl font-bold text-foreground">
                $49
                <span className="text-2xl font-normal text-muted-foreground">
                  /month
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Per organization. Flat. No surprises.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-2">
              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-8 pb-10 pt-8">
              <Button asChild size="lg" className="w-full">
                <Link to="/demo">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                30-day free trial. No credit card required.
              </p>
            </CardFooter>
          </Card>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-foreground">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </AnimatedSection>

      {/* Bottom CTA */}
      <AnimatedSection className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Questions about pricing?
          </h2>
          <p className="mt-4 text-muted-foreground">
            We're happy to talk. Reach out anytime.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AnimatedSection>
    </div>
  );
}
