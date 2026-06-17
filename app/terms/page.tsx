import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — BrickMaster",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. Acceptance</h2>
          <p>
            By creating a BrickMaster account or using the service, you agree to these terms. If you
            do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. The Service</h2>
          <p>
            BrickMaster is a personal LEGO collection tracker that allows you to catalog your sets,
            maintain a wishlist, and view other users&apos; public collections. The service is
            provided as-is and may change at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. Your Account</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide a valid email address to create an account.</li>
            <li>You are responsible for keeping your login credentials secure.</li>
            <li>You may delete your account at any time from the Settings page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the service for any unlawful purpose.</li>
            <li>Impersonate another person or misrepresent your identity.</li>
            <li>Attempt to access other users&apos; private data.</li>
            <li>Abuse, harass, or send unwanted messages to other users.</li>
            <li>Use automated scripts to scrape data from the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Data Accuracy</h2>
          <p>
            LEGO set data (names, piece counts, themes, images) is sourced from third-party
            databases and may contain inaccuracies. BrickMaster does not guarantee the accuracy,
            completeness, or timeliness of this data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these terms. You may delete your
            account at any time, which will permanently remove all your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Limitation of Liability</h2>
          <p>
            BrickMaster is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
            liable for any data loss, service interruptions, or damages arising from your use of the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Trademarks</h2>
          <p>
            LEGO, the LEGO logo, and the Minifigure are trademarks of the LEGO Group. BrickMaster is
            an independent fan project and is not affiliated with, endorsed by, or sponsored by the
            LEGO Group.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">9. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="border-t border-border pt-6 text-xs">
          <p>
            LEGO is a trademark of the LEGO Group. BrickMaster is not affiliated with or endorsed by
            the LEGO Group.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-sm text-primary hover:underline">
          &larr; Back to BrickMaster
        </Link>
      </div>
    </main>
  );
}
