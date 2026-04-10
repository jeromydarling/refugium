export default function Terms() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                By accessing or using Refugium ("the Service"), you agree to
                be bound by these Terms of Service ("Terms"). If you are
                using the Service on behalf of an organization, you represent
                that you have the authority to bind that organization to
                these Terms. If you do not agree to these Terms, you may not
                use the Service.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                2. Description of Service
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Refugium is a survivor-centered disaster recovery platform
                that provides household recovery tracking (People), trusted
                partner directory management (Refuge), volunteer
                coordination (Flow), and pattern detection through Narrative
                Relationship Intelligence (NRI). The Service is designed for
                use by humanitarian organizations, faith-based teams, and
                disaster relief nonprofits.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                3. Account Registration
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To use the Service, you must create an account and provide
                accurate, complete information. You are responsible for
                maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You
                must notify us immediately of any unauthorized use of your
                account.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                4. Acceptable Use
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You agree to use the Service only for lawful purposes
                consistent with its intended use -- supporting disaster
                recovery and humanitarian aid. You may not use the Service to
                store or process data in violation of applicable privacy
                laws, to discriminate against individuals or groups, to
                misrepresent your organization or its services, or to attempt
                to access data belonging to other organizations on the
                platform.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                5. Pricing and Payment
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The Service is offered at $49 per month per organization.
                This price includes all features, all modules, and unlimited
                users. Pricing is subject to change with 30 days' notice. A
                free trial period is available. Payment is processed through
                secure third-party payment providers.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                6. Data Ownership
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Your organization retains full ownership of all data entered
                into the Service. We claim no ownership rights over your
                content. You may export your data at any time. Upon account
                termination, we will provide a reasonable period for data
                export before deletion.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                7. Service Availability
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We strive to maintain high availability of the Service but do
                not guarantee uninterrupted access. We may perform scheduled
                maintenance with advance notice. We are not liable for
                temporary service interruptions due to circumstances beyond
                our reasonable control.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                8. Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To the maximum extent permitted by law, Refugium shall not be
                liable for any indirect, incidental, special, consequential,
                or punitive damages arising from your use of the Service.
                Our total liability shall not exceed the amount you paid for
                the Service in the twelve months preceding the claim.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                9. Termination
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Either party may terminate this agreement at any time. You
                may cancel your subscription at any time through your account
                settings or by contacting us. We may terminate or suspend
                your account if you violate these Terms. Upon termination,
                your right to use the Service ceases, but provisions
                regarding data ownership, limitation of liability, and
                dispute resolution survive.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                10. Changes to Terms
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We may modify these Terms from time to time. We will provide
                notice of material changes at least 30 days before they take
                effect. Your continued use of the Service after changes take
                effect constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                11. Contact
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                For questions about these Terms, please contact us at{" "}
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
      </section>
    </div>
  );
}
