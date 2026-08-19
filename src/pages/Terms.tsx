import type { ReactNode } from "react"
import { LegalPage, type LegalSection } from "../components/LegalPage"

const P = ({ children }: { children: ReactNode }) => (
  <p className="text-[15px] leading-7 text-muted">{children}</p>
)
const UL = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
)

/*
 * TODO(legal): confirm with company before production publication —
 * - governing law / jurisdiction
 * - legal entity name and address
 * - payment provider, refund policy, billing periods
 * - authentication provider (none claimed)
 * - open-source component license references
 * - indemnification clause legal review
 * - limitation of liability legal review
 */

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <P>
          AiConnect lets AI agents work with engineering and professional
          software while preserving project progress across sessions and AI
          models. These Terms of Use ("Terms") govern your access to and use of
          the AiConnect website, the AiConnect desktop application, connectors,
          skills, workflows, and related services (together, "AiConnect" or the
          "Service").
        </P>
        <P>
          By accessing or using AiConnect, you agree to be bound by these Terms.
          If you do not agree, do not use the Service. Features that depend on
          accounts, subscriptions, or other infrastructure are described here
          for when those features are offered; the applicable terms will apply
          once such features are available.
        </P>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: (
      <P>
        You may use AiConnect only if you can lawfully form a binding contract
        in your jurisdiction and you comply with all applicable laws and
        regulations. By using the Service you confirm that you meet these
        requirements.
      </P>
    ),
  },
  {
    id: "account",
    title: "AiConnect Account",
    content: (
      <>
        <P>
          Some AiConnect features may require an account. When account features
          are offered, you agree to provide accurate and complete information,
          keep your credentials secure, and remain responsible for all activity
          that occurs under your account. You must notify us promptly if you
          believe your account has been compromised.
        </P>
        <P>
          We may suspend or terminate accounts that violate these Terms, that we
          reasonably believe are fraudulent or abusive, or as required by law.
        </P>
      </>
    ),
  },
  {
    id: "subscriptions",
    title: "Subscriptions and Paid Features",
    content: (
      <>
        <P>
          AiConnect may offer free and paid plans, including subscription
          features. When paid features are offered, the applicable prices,
          billing periods, payment provider, renewal terms, cancellation terms,
          and refund policy will be published before you are asked to pay.
        </P>
        <P>
          {/* TODO(legal): insert final payment provider / billing terms before launch */}
          Your subscription status and entitlements determine which AiConnect
          features you can access. We may change, suspend, or end a plan in
          accordance with the published terms, and your access to entitled
          features may change accordingly.
        </P>
      </>
    ),
  },
  {
    id: "software-connectors",
    title: "Software and Connectors",
    content: (
      <>
        <P>
          AiConnect may provide access to desktop software, connectors,
          integrations, AI models, skills, and workflows. Connectors and
          integrations let AiConnect work with third-party software such as
          engineering applications.
        </P>
        <P>
          Third-party software remains owned by its respective owners and
          remains subject to its own licenses and terms. AiConnect does not own
          or license third-party software to you beyond what is needed to
          operate the relevant connector, and we make no representations about
          the availability or behavior of third-party software.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: (
      <>
        <P>You agree not to misuse AiConnect. Prohibited conduct includes:</P>
        <UL
          items={[
            "Engaging in unlawful activity or violating applicable laws",
            "Attempting unauthorized access to AiConnect systems, accounts, or data",
            "Interfering with or disrupting the Service, its infrastructure, or other users",
            "Attempting to bypass authentication, entitlement, or access controls",
            "Distributing unauthorized copies of protected artifacts or materials",
            "Abusing download infrastructure, including automated bulk downloads without authorization",
            "Reverse engineering AiConnect components except as expressly permitted by law",
          ]}
        />
        <P>
          These restrictions do not limit legitimate uses of any open-source
          components of AiConnect under their own licenses.
        </P>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <P>
          AiConnect owns its website, software, branding, documentation, and
          original content, including all rights, title, and interest in and to
          them. Third-party software, connectors, models, and content may be
          subject to separate licenses held by their respective owners.
        </P>
        <P>
          {/* TODO(legal): reference the applicable open-source repository/license once confirmed */}
          Any open-source portions of AiConnect are governed by their applicable
          open-source licenses, and this agreement does not alter those
          licenses.
        </P>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User Content",
    content: (
      <>
        <P>
          If and when AiConnect offers the ability to upload or store project
          data, models, or other content, you retain ownership of the content
          you submit. You grant AiConnect a license to store, process, and
          transmit that content solely to provide the Service to you.
        </P>
        <P>
          You are responsible for the content you submit and for ensuring it
          does not violate these Terms or applicable law. AiConnect does not
          currently provide user-content upload features; this section applies
          when such features are introduced.
        </P>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    content: (
      <P>
        AiConnect relies on third-party services — such as AI model providers,
        engineering software, cloud infrastructure, and service providers — to
        operate. These services have their own terms, privacy practices, and
        availability. AiConnect is not responsible for the availability or
        behavior of third-party services. Specific providers will be identified
        in the applicable policies once they are selected.
      </P>
    ),
  },
  {
    id: "availability-changes",
    title: "Availability and Changes",
    content: (
      <P>
        AiConnect may change, add, or remove features, connectors, or plans;
        perform maintenance; or suspend parts of the Service at any time. Unless
        we expressly agree otherwise in writing, availability is not guaranteed.
      </P>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: (
      <>
        <P>
          The Service is provided "as is" and "as available," without warranties
          of any kind, whether express or implied, to the maximum extent
          permitted by law.
        </P>
        <P>
          AiConnect is not a substitute for professional engineering judgment.
          AI-generated outputs, including calculations, models, or design
          suggestions, must be reviewed by qualified professionals. You remain
          responsible for verifying outputs and for the decisions you make based
          on them.
        </P>
      </>
    ),
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <P>
          To the maximum extent permitted by law, AiConnect and its providers
          will not be liable for indirect, incidental, special, consequential,
          or punitive damages, or for lost profits, data, or business
          opportunities, arising out of or related to your use of the Service.
        </P>
        <P>
          {/* TODO(legal): this clause requires qualified legal review before production */}
          Our total liability for all claims relating to the Service will not
          exceed the amount you paid us, if any, for the Service in the twelve
          months preceding the claim, or one hundred dollars, whichever is
          greater.
        </P>
      </>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <P>
          {/* TODO(legal): confirm scope and include/exclude with legal counsel */}
          You agree to indemnify and hold harmless AiConnect and its providers
          from claims arising out of your use of the Service, your content, or
          your violation of these Terms, to the extent permitted by law.
        </P>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <P>
          You may stop using AiConnect at any time. We may suspend or terminate
          your access if you violate these Terms, if we reasonably believe
          continued access would cause harm or abuse, or as required by law.
        </P>
        <P>
          Upon termination, your right to use the Service ends. Where
          applicable, the treatment of active subscriptions will follow the
          terms published at the time of purchase.
        </P>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <>
        <P>
          {/* TODO(legal): insert confirmed governing law / jurisdiction before publication */}
          These Terms will be governed by the laws applicable to AiConnect's
          registered jurisdiction. The specific jurisdiction will be published
          here once confirmed.
        </P>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    content: (
      <P>
        We may update these Terms from time to time. Material changes will be
        communicated through the website or the Service before they take effect.
        Continued use of AiConnect after changes take effect constitutes
        acceptance of the updated Terms.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <P>
        Questions about these Terms may be directed to the contact address
        listed in the Contact section below.
      </P>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      description="Rules governing the use of AiConnect software, services, connectors, and related offerings."
      lastUpdated="2026-08-15"
      sections={TERMS_SECTIONS}
    />
  )
}
