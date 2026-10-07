import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
  LEGAL_CONFIG,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service · EkklesiaHub",
  description: "The rules for using EkklesiaHub.",
};

export default function TermsPage() {
  const { operator, contactEmail, governingLaw } = LEGAL_CONFIG;
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="Plain-language rules for using EkklesiaHub. By creating an account or using the platform you agree to them."
    >
      <LegalSection heading="1. Who we are">
        <p>
          EkklesiaHub (&quot;the platform&quot;, &quot;we&quot;, &quot;us&quot;)
          is operated by {operator}. Questions about these terms can be sent to{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. Your account">
        <ul>
          <li>
            You must provide accurate information and keep your password secure.
          </li>
          <li>
            You are responsible for activity that happens under your account.
          </li>
          <li>
            Passwords must be at least 8 characters. Tell us promptly if you
            suspect unauthorised access.
          </li>
          <li>You can delete your account at any time from Settings.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Your content">
        <p>
          You keep ownership of what you write and upload (articles, comments,
          images, series). By publishing, you give us a non-exclusive licence to
          host, display, and distribute that content on the platform, to the
          extent needed to run the service. Drafts stay private to you.
        </p>
        <p>
          You are responsible for your content. Only post what you have the
          right to share, and do not copy others&apos; work without permission.
          Where you quote Scripture, respect the licence of the translation you
          use.
        </p>
      </LegalSection>

      <LegalSection heading="4. Community conduct">
        <p>
          EkklesiaHub is a space for thoughtful writing and respectful dialogue.
          You agree not to:
        </p>
        <ul>
          <li>harass, threaten, or demean other people;</li>
          <li>
            post unlawful, hateful, sexually explicit, or deceptive content, or
            spam;
          </li>
          <li>impersonate others or misrepresent your affiliation;</li>
          <li>
            attempt to disrupt, scrape at scale, or gain unauthorised access to
            the platform.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Moderation">
        <p>
          Community admins can pin posts and remove content from their
          community. Platform administrators may remove content or suspend
          accounts that breach these terms. When a post is removed, a reason is
          recorded and the author is notified.
        </p>
      </LegalSection>

      <LegalSection heading="6. Scripture text">
        <p>
          The built-in Bible reader provides Scripture for personal reading,
          study, and quotation within your writing. Individual translations are
          subject to their own licences and copyright terms; availability of a
          translation does not grant you rights beyond those terms.
        </p>
      </LegalSection>

      <LegalSection heading="7. Availability and changes">
        <p>
          The platform is provided &quot;as is&quot; and may change, be
          interrupted, or have errors. We may update these terms; material
          changes will be announced on the platform, and continued use after a
          change means you accept it.
        </p>
      </LegalSection>

      <LegalSection heading="8. Liability">
        <p>
          To the extent permitted by law, we are not liable for indirect or
          consequential losses arising from your use of the platform, or for
          content posted by users. Nothing in these terms limits liability that
          cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection heading="9. Governing law">
        <p>These terms are governed by the laws of {governingLaw}.</p>
      </LegalSection>

      <LegalSection heading="10. Contact">
        <p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
