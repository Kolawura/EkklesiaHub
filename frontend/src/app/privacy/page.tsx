import type { Metadata } from "next";
import {
  LegalPage,
  LegalSection,
  LEGAL_CONFIG,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · EkklesiaHub",
  description: "What EkklesiaHub collects, why, and the choices you have.",
};

export default function PrivacyPage() {
  const { operator, contactEmail } = LEGAL_CONFIG;
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What we collect, why we collect it, and the choices you have."
    >
      <LegalSection heading="1. Who is responsible">
        <p>
          {operator} operates EkklesiaHub and is responsible for your personal
          data. Contact: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. What we collect">
        <ul>
          <li>
            <strong>Account details:</strong> first and last name, username,
            email address, and a hashed password (we never store your password
            in plain text).
          </li>
          <li>
            <strong>Profile details you choose to add:</strong> bio, profile
            photo, and banner image.
          </li>
          <li>
            <strong>Content and activity:</strong> posts, drafts, comments
            (including attached Scripture), reactions, bookmarks, reading list,
            series, follows, followed topics, and community memberships.
          </li>
          <li>
            <strong>Notifications:</strong> alerts about comments, replies,
            reactions, follows, community invites, and removed posts.
          </li>
          <li>
            <strong>Reading statistics:</strong> when a post is viewed we record
            the view. For signed-in readers this is linked to the account; for
            signed-out visitors we store only a shortened one-way hash of the IP
            address, used to avoid counting the same visitor repeatedly in a
            day.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How we use it">
        <ul>
          <li>
            to run the platform: sign-in, publishing, communities, feeds, and
            notifications;
          </li>
          <li>
            to show authors their own analytics (views, reactions, comments,
            bookmarks);
          </li>
          <li>to keep the platform safe and enforce our Terms;</li>
          <li>to contact you about your account when necessary.</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection heading="4. Cookies and local storage">
        <ul>
          <li>
            <strong>Sign-in cookie:</strong> a secure, HTTP-only cookie keeps
            you signed in for about seven hours. It is essential for the service
            to work.
          </li>
          <li>
            <strong>Preferences:</strong> your chosen theme and Bible reader
            settings are stored in your browser so they persist between visits.
          </li>
        </ul>
        <p>We do not use advertising cookies.</p>
      </LegalSection>

      <LegalSection heading="5. Who we share it with">
        <p>
          What you publish publicly (or to a community) is visible to the
          audience you choose. We use service providers to host the platform and
          store data, including our database host and, where enabled, an
          image-hosting provider for uploaded pictures. They process data only
          to provide those services.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your choices and rights">
        <ul>
          <li>Edit your profile, posts, and comments at any time.</li>
          <li>Keep work private as a draft, or archive it.</li>
          <li>
            Delete your account from Settings (you will be asked for your
            password).
          </li>
          <li>
            Ask us to access, correct, or erase your data, or object to
            processing, by emailing{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Depending on
            where you live, you may have additional rights under local
            data-protection law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="7. Retention">
        <p>
          We keep your data while your account is active. When you delete your
          account, we remove your account data from our systems; routine backups
          may persist for a limited time before they roll off.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          Passwords are hashed, sign-in cookies are HTTP-only, and content from
          the editor is sanitised before display. No system is perfectly secure,
          so please use a strong, unique password.
        </p>
      </LegalSection>

      <LegalSection heading="9. Children">
        <p>
          EkklesiaHub is not directed at children under 13, and we do not
          knowingly collect their data. If you believe a child has signed up,
          contact us and we will remove the account.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes">
        <p>
          We will update this page when our practices change, and revise the
          date at the top.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
