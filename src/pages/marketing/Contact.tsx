import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We'd love to hear from you. Whether you have a question about
            Refugium, need help getting started, or just want to say hello --
            we're here.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Info sidebar */}
            <div className="space-y-8 lg:col-span-2">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Reach out directly
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The best way to reach us is by email. We respond to every
                  message personally -- usually within one business day.
                </p>
              </div>

              <div className="flex items-start gap-4 rounded-lg bg-muted/40 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a
                    href="mailto:info@refugium.app"
                    className="text-sm text-primary hover:underline"
                  >
                    info@refugium.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg bg-muted/40 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Demo questions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tried the demo and have questions? We'd love to walk you
                    through anything you saw.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Send us a message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          autoComplete="name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.org"
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">
                        Organization{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="organization"
                        placeholder="Your organization"
                        autoComplete="organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      This form is for demonstration purposes. To reach us
                      now, email{" "}
                      <a
                        href="mailto:info@refugium.app"
                        className="text-primary hover:underline"
                      >
                        info@refugium.app
                      </a>
                      .
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
