import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — BrickMaster",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">1. What We Collect</h2>
          <p>When you create a BrickMaster account, we collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Email address</strong> — for authentication and account recovery.
            </li>
            <li>
              <strong>Username and profile information</strong> — display name, bio, and avatar
              color you provide during onboarding.
            </li>
            <li>
              <strong>Collection data</strong> — LEGO sets you add to your collection or wishlist,
              and your theme preferences.
            </li>
            <li>
              <strong>Social connections</strong> — who you follow and who follows you.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">2. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain the BrickMaster service.</li>
            <li>
              To display your public profile and collection to other users (if your profile is set
              to public).
            </li>
            <li>To show you relevant content such as activity from users you follow.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or share your personal data with third parties
            for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">3. Data Storage</h2>
          <p>
            Your data is stored securely using{" "}
            <a
              href="https://supabase.com"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Supabase
            </a>
            , which provides PostgreSQL databases with row-level security. All data is encrypted in
            transit (TLS) and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Access</strong> your data — your collection, profile, and social connections
              are visible in the app.
            </li>
            <li>
              <strong>Delete</strong> your account and all associated data from the Settings page.
            </li>
            <li>
              <strong>Control visibility</strong> — you can set your profile to private at any time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">5. Cookies</h2>
          <p>
            We use essential cookies only for authentication session management. We do not use
            tracking cookies or third-party analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">6. Children</h2>
          <p>
            BrickMaster is not intended for users under the age of 13. We do not knowingly collect
            data from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">7. Changes</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an
            updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground">8. Contact</h2>
          <p>
            Questions about this policy? Open an issue on our GitHub repository or reach out via the
            app.
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
