import type { ReactNode } from 'react'
import { LegalPage, type LegalSection } from '../components/LegalPage'

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
 * - exact data categories actually collected once backend exists
 * - telemetry/analytics decisions
 * - authentication provider details (none claimed here)
 * - payment provider handling of payment information
 * - cloud/CDN/email providers
 * - exact retention periods
 * - user-rights wording for operating jurisdictions
 * - children's age threshold
 * - international data transfer framing
 */

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <P>
        This Privacy Policy explains how AiConnect ("we", "us") collects, uses, stores, and
        protects personal information when you use our website, desktop application, and
        related services. This website is currently a static site; the categories below
        describe what may be collected as features are introduced, and we will keep this
        policy in line with what the Service actually does.
      </P>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: (
      <>
        <P>We group information we may collect as follows:</P>
        <P className="font-semibold text-text">Account Information</P>
        <UL
          items={[
            'Email address, account identifier, and verification status — only when account features are offered',
            'Authentication information processed to sign you in securely (we do not store raw secrets in plain text)',
          ]}
        />
        <P className="font-semibold text-text">Device / Technical Information</P>
        <UL
          items={[
            'Operating system, application version, IP address, and diagnostic logs needed to operate and secure the Service',
          ]}
        />
        <P className="font-semibold text-text">Usage Information</P>
        <UL
          items={[
            'Feature usage, connector usage, API activity, and download activity, where collected to operate, improve, and secure the Service',
          ]}
        />
        <P className="font-semibold text-text">Payment Information</P>
        <P>
          If subscriptions are introduced, payment transactions will be processed by a
          third-party payment provider. We do not currently store raw payment card details,
          and we will not do so unless this policy is updated to say otherwise.
        </P>
      </>
    ),
  },
  {
    id: 'how-information-is-used',
    title: 'How Information Is Used',
    content: (
      <P>
        We use information to provide the Service: authenticate accounts, verify email
        addresses, manage subscriptions and entitlements, process authorized downloads,
        maintain security, prevent abuse, provide support, improve the Service, and comply
        with legal obligations. We only use information for purposes that correspond to
        features that are actually offered.
      </P>
    ),
  },
  {
    id: 'authentication',
    title: 'Authentication',
    content: (
      <P>
        When authentication is offered, we process credentials to verify your identity and
        control access to your account. We protect credentials with secure handling and
        access controls. This policy describes what is processed, not internal security
        implementation details.
      </P>
    ),
  },
  {
    id: 'subscription-entitlement',
    title: 'Subscription and Entitlement Data',
    content: (
      <P>
        Account and subscription information may be used to determine your access to paid
        features and services. This is separate from payment processing, which is handled by
        the payment provider under its own terms.
      </P>
    ),
  },
  {
    id: 'download-distribution',
    title: 'Download and Distribution Data',
    content: (
      <P>
        Authorized download requests may be processed to verify account access, determine
        entitlement, provide the appropriate release artifacts, prevent abuse, and maintain
        security and audit records. We do not claim permanent download tracking unless it is
        actually implemented.
      </P>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and Similar Technologies',
    content: (
      <P>
        This website does not currently use non-essential cookies or analytics trackers. If
        that changes, this policy will be updated to describe the cookies and technologies
        used.
      </P>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    content: (
      <P>
        AiConnect may rely on third-party providers for hosting, storage, authentication,
        email, payment, and similar services. We will identify specific providers in this
        policy once they are selected. Providers process information under their own terms
        and privacy practices.
      </P>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <P>
        We retain personal information only as long as necessary for account operation,
        subscription and accounting requirements, security, legal obligations, and dispute
        resolution. Exact retention periods will be published once the relevant backend
        policies are finalized.
      </P>
    ),
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: (
      <P>
        We use reasonable security practices to protect information, including encrypted
        transport where supported, access controls, secure credential handling, limited
        administrative access, and monitoring. We do not claim specific certifications or
        guarantees unless they are verified and stated in this policy.
      </P>
    ),
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    content: (
      <P>
        We may share information with service providers necessary to operate AiConnect, and
        as required by law. We do not sell personal information. This policy does not
        guarantee an absolute "never share" position; any specific commitments will be
        stated here.
      </P>
    ),
  },
  {
    id: 'international-transfers',
    title: 'International Data Transfers',
    content: (
      <P>
        The Service may use infrastructure located in multiple countries. Information may
        therefore be processed outside your country of residence. We will provide
        jurisdiction-specific framing here once the company confirms its operating
        jurisdictions and legal requirements.
      </P>
    ),
  },
  {
    id: 'user-rights',
    title: 'User Rights',
    content: (
      <P>
        You may request access to, correction of, or deletion of your personal information,
        or closure of your account, by contacting us through the Contact section below. The
        specific rights and legal wording will be aligned with the jurisdictions in which
        the company operates.
      </P>
    ),
  },
  {
    id: 'children-privacy',
    title: "Children's Privacy",
    content: (
      <P>
        AiConnect is not directed at children. We do not knowingly collect personal
        information from children. The specific age threshold will be stated here once the
        company confirms its policy.
      </P>
    ),
  },
  {
    id: 'policy-changes',
    title: 'Policy Changes',
    content: (
      <P>
        We may update this Privacy Policy from time to time. Material changes will be
        communicated through the website or the Service before they take effect.
      </P>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Learn how AiConnect handles information when you use our website, software, and services."
      lastUpdated="2026-08-15"
      sections={PRIVACY_SECTIONS}
    />
  )
}
