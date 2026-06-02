import type { Metadata } from 'next';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Terms of Service — Darwin',
  description:
    'The terms that govern your use of Darwin, the campus marketplace operated by Vesper Works.',
};

const LAST_UPDATED = 'June 1, 2026';
const CONTACT_EMAIL = 'info@vesperworks.ca';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; items: { term?: string; text: string }[] }
  | { kind: 'email'; text: string };

type Section = { title: string; body: Block[] };

const sections: Section[] = [
  {
    title: 'Agreement to these terms',
    body: [
      {
        kind: 'p',
        text: 'Darwin is a campus marketplace that lets students buy and sell within their university community. It is operated by Vesper Works. In these Terms of Service ("Terms"), "we", "us", and "our" refer to Vesper Works, and "you" refers to the person using Darwin.',
      },
      {
        kind: 'p',
        text: 'By creating an account, joining our waitlist, or otherwise accessing or using Darwin, you agree to be bound by these Terms and by our Privacy Policy, which is incorporated here by reference. If you do not agree, do not use Darwin.',
      },
    ],
  },
  {
    title: 'Eligibility',
    body: [
      { kind: 'p', text: 'To use Darwin, you must:' },
      {
        kind: 'list',
        items: [
          { text: 'be a current post-secondary student, or otherwise be part of a university community we serve;' },
          { text: 'be at least the age of majority in your province, or have the consent of a parent or guardian;' },
          { text: 'register with accurate and complete information and keep it up to date; and' },
          { text: 'maintain only one account per person, unless we expressly agree otherwise.' },
        ],
      },
      {
        kind: 'p',
        text: 'We may require you to verify your student status or university affiliation, and we may refuse, suspend, or remove access if you do not meet these requirements.',
      },
    ],
  },
  {
    title: 'Your account',
    body: [
      {
        kind: 'p',
        text: 'You are responsible for safeguarding your account credentials and for all activity that occurs under your account. Do not share your password or let others use your account. You agree to notify us promptly at the address in the "Contact us" section if you suspect any unauthorized access to or use of your account. We are not liable for any loss arising from your failure to keep your credentials secure.',
      },
    ],
  },
  {
    title: 'Acceptable use',
    body: [
      { kind: 'p', text: 'When using Darwin, you agree not to:' },
      {
        kind: 'list',
        items: [
          { text: 'list, sell, or solicit anything illegal, stolen, counterfeit, or that you do not have the right to sell;' },
          { text: 'post content that is false, misleading, fraudulent, defamatory, harassing, hateful, or that infringes the rights of others;' },
          { text: 'impersonate any person or misrepresent your affiliation with any person or institution;' },
          { text: 'harass, threaten, defraud, or harm other users;' },
          { text: 'use Darwin to send spam, or to solicit users for purposes unrelated to a legitimate listing;' },
          { text: 'scrape, crawl, or harvest data from Darwin, or access it through automated means without our permission; and' },
          { text: 'attempt to circumvent, disable, or interfere with the security or proper functioning of the service.' },
        ],
      },
      {
        kind: 'p',
        text: 'You must also comply with the policies and codes of conduct of your university and with all applicable laws.',
      },
    ],
  },
  {
    title: 'Listings and transactions',
    body: [
      {
        kind: 'p',
        text: 'You are solely responsible for your listings, including the accuracy of titles, descriptions, prices, condition, photos, and your legal right to sell the item. You must honour the terms you advertise.',
      },
      {
        kind: 'p',
        text: 'Transactions on Darwin happen directly between buyers and sellers. Darwin is a venue that helps students find one another; we are not a party to any transaction, we do not take possession of or inspect any item, and we do not act as a buyer, seller, broker, payment processor, or escrow agent for user-to-user sales. We do not guarantee the existence, quality, safety, or legality of any item, the truth or accuracy of any listing, the ability of a seller to sell or a buyer to pay, or that any transaction will be completed.',
      },
      {
        kind: 'p',
        text: 'You arrange payment, exchange, and any meeting directly with the other user, and you do so at your own risk. We encourage you to use good judgment, meet in safe public places on or near campus, and inspect items before paying.',
      },
    ],
  },
  {
    title: 'Prohibited and restricted items',
    body: [
      {
        kind: 'p',
        text: 'You may not list or sell items that are illegal or that we prohibit, including but not limited to:',
      },
      {
        kind: 'list',
        items: [
          { text: 'weapons, ammunition, explosives, and related items;' },
          { text: 'drugs, controlled substances, alcohol, tobacco, and vaping products;' },
          { text: 'stolen goods or items obtained without the right to sell them;' },
          { text: 'counterfeit, recalled, or unsafe goods;' },
          { text: 'regulated items such as prescription medication or medical devices;' },
          { text: 'live animals; and' },
          { text: 'anything that violates your university’s policies or applicable law.' },
        ],
      },
      {
        kind: 'p',
        text: 'We may remove any listing and take action against any account that violates this section.',
      },
    ],
  },
  {
    title: 'Content you post',
    body: [
      {
        kind: 'p',
        text: 'You retain ownership of the content you post to Darwin, including your listings, photos, and profile information. By posting content, you grant Vesper Works a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, and distribute that content as needed to operate and promote the marketplace. You represent that you have the rights necessary to grant this license.',
      },
      {
        kind: 'p',
        text: 'Please note that photos you upload to a listing are stored in publicly accessible storage, which means anyone with the image link can view the image. Do not include sensitive or personal information in listing photos or descriptions.',
      },
    ],
  },
  {
    title: 'Founding memberships and payments',
    body: [
      {
        kind: 'p',
        text: 'Darwin may offer paid founding memberships or similar tiers. Payments are processed by our payment provider, Stripe, and are subject to Stripe’s terms; we do not collect or store your full card details. Prices are shown at the point of purchase and may change over time.',
      },
      {
        kind: 'p',
        text: 'Unless otherwise stated at checkout or required by applicable consumer-protection law, founding membership purchases are final and non-refundable. If a charge is made in error, contact us at the address in the "Contact us" section and we will review it in good faith. Any benefits associated with a membership are provided on an "as available" basis and may evolve as Darwin develops.',
      },
    ],
  },
  {
    title: 'Intellectual property',
    body: [
      {
        kind: 'p',
        text: 'Darwin and Vesper Works, including the software, design, text, graphics, logos, and the "Darwin" and "Vesper Works" names and marks, are owned by Vesper Works or its licensors and are protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable, revocable license to access and use Darwin for its intended personal, non-commercial purpose. You may not copy, modify, distribute, reverse engineer, or create derivative works from the service except as permitted by law.',
      },
    ],
  },
  {
    title: 'Suspension and termination',
    body: [
      {
        kind: 'p',
        text: 'We may suspend, restrict, or terminate your access to Darwin at any time, with or without notice, if you violate these Terms, create risk or legal exposure for us, or for any other reason in our reasonable discretion. You may stop using Darwin at any time and may request deletion of your account and associated personal information as described in our Privacy Policy. Provisions that by their nature should survive termination — including content licenses already granted, disclaimers, limitation of liability, indemnification, and dispute resolution — will survive.',
      },
    ],
  },
  {
    title: 'Disclaimers',
    body: [
      {
        kind: 'p',
        text: 'Darwin is provided "as is" and "as available", without warranties of any kind, whether express, implied, or statutory, including any implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the fullest extent permitted by law. We do not warrant that the service will be uninterrupted, secure, or error-free.',
      },
      {
        kind: 'p',
        text: 'We make no representations or warranties about other users or about any item, listing, or transaction. You are responsible for evaluating, and bear all risks associated with, your dealings with other users.',
      },
    ],
  },
  {
    title: 'Limitation of liability',
    body: [
      {
        kind: 'p',
        text: 'To the fullest extent permitted by law, Vesper Works and its directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, goodwill, or other intangible losses, arising out of or relating to your use of Darwin or any transaction between users. To the fullest extent permitted by law, our total aggregate liability for any claim relating to Darwin will not exceed the greater of the amount you paid us in the twelve months before the event giving rise to the claim, or CAD $100.',
      },
      {
        kind: 'p',
        text: 'Some jurisdictions do not allow certain limitations of liability, so some of the above may not apply to you. Nothing in these Terms limits liability that cannot be limited under applicable law.',
      },
    ],
  },
  {
    title: 'Indemnification',
    body: [
      {
        kind: 'p',
        text: 'You agree to indemnify and hold harmless Vesper Works and its directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to your use of Darwin, your content or listings, your transactions with other users, your violation of these Terms, or your violation of any law or the rights of a third party.',
      },
    ],
  },
  {
    title: 'Dispute resolution and arbitration',
    body: [
      {
        kind: 'p',
        text: 'Please read this section carefully, as it affects how disputes between you and Vesper Works are resolved.',
      },
      {
        kind: 'p',
        text: 'Except where prohibited by applicable law, you and Vesper Works agree that any dispute, claim, or controversy arising out of or relating to these Terms or your use of Darwin will be resolved by final and binding arbitration administered in the Province of Ontario, in English, before a single arbitrator, rather than in court. Judgment on the award may be entered in any court of competent jurisdiction.',
      },
      {
        kind: 'p',
        text: 'You and Vesper Works agree that each may bring claims against the other only in an individual capacity, and not as a plaintiff or class member in any purported class, collective, or representative proceeding. The arbitrator may not consolidate more than one person’s claims or preside over any form of class proceeding.',
      },
      {
        kind: 'p',
        text: 'This section does not prevent either party from bringing an individual claim in a small-claims court for disputes within that court’s jurisdiction, or from seeking injunctive or equitable relief in court to protect intellectual-property or security interests. Nothing in this section waives any right or remedy that cannot be waived under applicable consumer-protection law; if mandatory law in your province gives you the right to bring a claim in court or before a tribunal, this section does not take that right away.',
      },
    ],
  },
  {
    title: 'Governing law',
    body: [
      {
        kind: 'p',
        text: 'These Terms and any dispute arising out of them or your use of Darwin are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict-of-laws rules, and subject to any mandatory consumer-protection laws of the province in which you reside.',
      },
    ],
  },
  {
    title: 'Changes to these terms',
    body: [
      {
        kind: 'p',
        text: 'We may update these Terms from time to time. When we make material changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you. Your continued use of Darwin after the changes take effect means you accept the updated Terms.',
      },
    ],
  },
  {
    title: 'Contact us',
    body: [
      {
        kind: 'p',
        text: 'If you have questions about these Terms or your use of Darwin, contact us at:',
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

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        <div className="page-hero">
          <span className="section-label">TERMS OF SERVICE</span>
          <h1 className="section-title max-w-4xl">Terms of Service</h1>
          <p className="page-hero-copy">
            These terms govern your use of Darwin, the campus marketplace operated by Vesper
            Works. Please read them carefully before buying, selling, or creating an account.
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
