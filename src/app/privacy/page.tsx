import type { Metadata } from 'next';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Privacy Policy — Darwin',
  description:
    'How Vesper Works collects, uses, and protects your personal information on Darwin, the campus marketplace.',
};

const LAST_UPDATED = 'May 27, 2026';
const CONTACT_EMAIL = 'info@vesperworks.ca';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; items: { term?: string; text: string }[] }
  | { kind: 'email'; text: string };

type Section = { title: string; body: Block[] };

const sections: Section[] = [
  {
    title: 'Who we are',
    body: [
      {
        kind: 'p',
        text: 'Darwin is a campus marketplace that lets students buy and sell within their university community. It is operated by Vesper Works. In this policy, "we", "us", and "our" refer to Vesper Works. If you have any questions about this policy or your personal information, you can reach us at the address in the "Contact us" section below.',
      },
    ],
  },
  {
    title: 'Information we collect',
    body: [
      { kind: 'p', text: 'We collect the following categories of personal information.' },
      { kind: 'h3', text: 'Information you provide' },
      {
        kind: 'list',
        items: [
          {
            term: 'Account and profile details',
            text: 'when you create an account or complete onboarding: your first and last name, email address, password (stored only in hashed form), university or school, level of study, program, and interests. You may also have a username and profile picture.',
          },
          {
            term: 'Listings',
            text: 'when you post an item: the title, description, price, category, condition, campus, and any photos you upload.',
          },
          {
            term: 'Waitlist',
            text: 'if you join our waitlist, your email address.',
          },
          {
            term: 'Founding membership purchases',
            text: 'if you buy a founding tier, your payment is processed by Stripe. We receive confirmation of the purchase and the tier you bought, but we do not collect or store your full card details.',
          },
        ],
      },
      { kind: 'h3', text: 'Information we collect automatically' },
      {
        kind: 'list',
        items: [
          {
            term: 'Usage and device data',
            text: 'we use Vercel Analytics, which collects aggregated information such as page views, the pages that referred you, approximate location, and device and browser type.',
          },
          {
            term: 'Cookies',
            text: 'we use essential cookies to keep you signed in and to secure your session. See the "Cookies" section for details.',
          },
        ],
      },
    ],
  },
  {
    title: 'How we use your information',
    body: [
      { kind: 'p', text: 'We use the personal information we collect to:' },
      {
        kind: 'list',
        items: [
          { text: 'provide, operate, and maintain the marketplace and your account;' },
          { text: 'authenticate you and keep your session secure;' },
          { text: 'display your listings and profile to other users;' },
          { text: 'send you transactional and service emails — for example, waitlist confirmations — through our email provider, Resend;' },
          { text: 'process founding membership payments through Stripe;' },
          { text: 'detect, prevent, and address fraud, abuse, and security issues; and' },
          { text: 'understand how Darwin is used so that we can improve it.' },
        ],
      },
      {
        kind: 'p',
        text: 'We rely on your consent, the performance of our agreement with you, and our legitimate interest in operating the service as the basis for these uses.',
      },
    ],
  },
  {
    title: 'Information visible to others',
    body: [
      {
        kind: 'p',
        text: 'Darwin is a marketplace, so some information is shared with other users by design. Your listings — including their photos, title, description, price, and the campus you select — are visible to other users. Your display name and school may also be shown alongside your listings.',
      },
      {
        kind: 'p',
        text: 'Please note that photos you upload to a listing are stored in publicly accessible storage, which means anyone with the image link can view the image. Do not include sensitive or personal information in listing photos or descriptions.',
      },
    ],
  },
  {
    title: 'How we share your information',
    body: [
      {
        kind: 'p',
        text: 'We do not sell your personal information. We share it only with the service providers that help us run Darwin, and where we are required to by law:',
      },
      {
        kind: 'list',
        items: [
          { term: 'Supabase', text: 'database, authentication, and file storage.' },
          { term: 'Stripe', text: 'payment processing for founding memberships.' },
          { term: 'Resend', text: 'sending transactional and service emails.' },
          { term: 'Vercel', text: 'website hosting and usage analytics.' },
        ],
      },
      {
        kind: 'p',
        text: 'Each of these providers handles your information under its own privacy and security commitments. We may also disclose information if we are required to do so by law, or where necessary to protect the rights, safety, and property of Darwin, our users, or others.',
      },
    ],
  },
  {
    title: 'Cookies',
    body: [
      {
        kind: 'p',
        text: 'We use a small number of essential cookies, set by our authentication provider (Supabase), to keep you signed in and to secure your session. These cookies are necessary for the site to function. We also use Vercel Analytics, which may set or read limited identifiers to measure aggregate usage. We do not use advertising or third-party tracking cookies.',
      },
    ],
  },
  {
    title: 'Where your data is stored and international transfers',
    body: [
      {
        kind: 'p',
        text: 'Darwin is intended for students at Canadian universities, but our service providers store and process data on servers located in the United States — for example, our database is hosted in a US region. As a result, your personal information may be transferred to, stored in, and processed in the United States and other countries, which may have data-protection laws different from those in your province. We take steps to ensure your information continues to be protected in accordance with this policy.',
      },
    ],
  },
  {
    title: 'Data retention',
    body: [
      {
        kind: 'p',
        text: 'We keep your personal information for as long as your account is active or as needed to provide the service. Waitlist entries are kept until we launch or until you ask us to remove them. You can ask us to delete your account and associated personal information at any time by contacting us; we will delete or anonymize it unless we are required to keep it for legal reasons.',
      },
    ],
  },
  {
    title: 'Your rights',
    body: [
      {
        kind: 'p',
        text: "Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial laws, you have the right to:",
      },
      {
        kind: 'list',
        items: [
          { text: 'access the personal information we hold about you;' },
          { text: 'request that we correct inaccurate or incomplete information;' },
          { text: 'request deletion of your personal information;' },
          { text: 'withdraw your consent to our processing, subject to legal or contractual limits.' },
        ],
      },
      {
        kind: 'p',
        text: 'To exercise any of these rights, email us using the address in the "Contact us" section. We will respond within a reasonable time. If you are not satisfied with our response, you have the right to contact the Office of the Privacy Commissioner of Canada.',
      },
    ],
  },
  {
    title: 'Data security',
    body: [
      {
        kind: 'p',
        text: 'We take reasonable measures to protect your personal information. Data is encrypted in transit, passwords are stored only in hashed form, and access to data is restricted using database row-level security. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    title: "Children's privacy",
    body: [
      {
        kind: 'p',
        text: 'Darwin is intended for post-secondary students and is not directed at children. We do not knowingly collect personal information from children under the age of majority in their province. If you believe a child has provided us with personal information, please contact us so that we can remove it.',
      },
    ],
  },
  {
    title: 'Changes to this policy',
    body: [
      {
        kind: 'p',
        text: 'We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you. Your continued use of Darwin after the changes take effect means you accept the updated policy.',
      },
    ],
  },
  {
    title: 'Contact us',
    body: [
      {
        kind: 'p',
        text: 'If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, contact us at:',
      },
      { kind: 'email', text: CONTACT_EMAIL },
    ],
  },
];

function renderBlock(block: Block, index: number) {
  switch (block.kind) {
    case 'p':
      return (
        <p key={index} className="text-secondary mt-4 max-w-3xl leading-7">
          {block.text}
        </p>
      );
    case 'h3':
      return (
        <h3 key={index} className="mt-6 text-lg font-semibold">
          {block.text}
        </h3>
      );
    case 'list':
      return (
        <ul key={index} className="text-secondary mt-4 max-w-3xl list-disc space-y-2 pl-5 leading-7">
          {block.items.map((item, i) => (
            <li key={i}>
              {item.term ? (
                <>
                  <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.term}
                  </strong>
                  {' — '}
                  {item.text}
                </>
              ) : (
                item.text
              )}
            </li>
          ))}
        </ul>
      );
    case 'email':
      return (
        <p key={index} className="mt-4">
          <a
            href={`mailto:${block.text}`}
            className="font-semibold underline underline-offset-4"
            style={{ color: 'var(--accent)' }}
          >
            {block.text}
          </a>
        </p>
      );
  }
}

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        <div className="page-hero">
          <span className="section-label">PRIVACY POLICY</span>
          <h1 className="section-title max-w-4xl">Privacy Policy</h1>
          <p className="page-hero-copy">
            This policy explains how Vesper Works collects, uses, and protects your personal
            information when you use Darwin, our campus marketplace.
          </p>
          <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {sections.map((section, i) => (
          <section key={section.title}>
            <div className="divider my-12" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {`${i + 1}. ${section.title}`}
            </h2>
            {section.body.map(renderBlock)}
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
