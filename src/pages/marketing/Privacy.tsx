export default function Privacy() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  1. Introduction
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Refugium ("we," "our," or "us") is committed to protecting
                  the privacy of the individuals and organizations who use
                  our platform. This Privacy Policy explains how we collect,
                  use, store, and protect your information when you use
                  Refugium's services. Given the sensitive nature of disaster
                  recovery data, we hold ourselves to the highest standards
                  of data stewardship.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  2. Information We Collect
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We collect information you provide directly when using
                  Refugium, including account registration details
                  (name, email, organization), data entered into the
                  platform (household records, case notes, partner
                  information, volunteer details), and communications with
                  our team. We also collect limited technical information
                  such as browser type, device information, and usage
                  patterns to improve the platform.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  3. How We Use Your Information
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We use the information you provide to operate and maintain
                  the Refugium platform, provide NRI (Narrative Relationship
                  Intelligence) pattern detection within your organization's
                  data boundary, send service-related communications, and
                  improve the platform's functionality and user experience.
                  We do not use your data to train machine learning models
                  outside your organization.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  4. Data Sharing and Disclosure
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We do not sell, rent, or trade your personal information or
                  the data of the survivors you serve. We may share
                  information only with service providers who help us operate
                  the platform (under strict data processing agreements),
                  when required by law or legal process, or with your
                  explicit consent. Your organization's data is never shared
                  with other organizations on the platform.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  5. Data Security
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We implement industry-standard security measures to protect
                  your data, including encryption in transit and at rest,
                  regular security audits, role-based access controls, and
                  secure data backup procedures. While no system can
                  guarantee absolute security, we are committed to
                  maintaining the highest practical standards of data
                  protection.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  6. Data Retention
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We retain your data for as long as your account is active
                  or as needed to provide services. When you close your
                  account, we will delete or anonymize your data within 90
                  days, unless retention is required by law. You may request
                  data export at any time before account closure.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  7. Your Rights
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  You have the right to access, correct, or delete your
                  personal information. You may request a copy of all data we
                  hold about you or your organization. You may opt out of
                  non-essential communications at any time. To exercise these
                  rights, contact us at{" "}
                  <a
                    href="mailto:info@refugium.app"
                    className="text-primary hover:underline"
                  >
                    info@refugium.app
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  8. Cookies and Tracking
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Refugium uses only essential cookies required for the
                  platform to function (authentication, session management).
                  We do not use third-party advertising cookies or tracking
                  pixels. We may use privacy-respecting analytics to
                  understand aggregate usage patterns.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  9. Changes to This Policy
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  We may update this Privacy Policy from time to time. We
                  will notify you of any material changes by email or through
                  a notice on the platform. Your continued use of Refugium
                  after changes take effect constitutes acceptance of the
                  updated policy.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  10. Contact Us
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us at{" "}
                  <a
                    href="mailto:info@refugium.app"
                    className="text-primary hover:underline"
                  >
                    info@refugium.app
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
