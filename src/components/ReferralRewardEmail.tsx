import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Link,
} from "@react-email/components";
import * as React from "react";

/**
 * Sent to a waitlist member the moment their 5th referral lands and
 * `priority_access` flips true. The reward is non-monetary: guaranteed
 * day-one access at their campus + a Founding Supporter badge.
 */
export default function ReferralRewardEmail() {
    return (
        <Html>
            <Head />
            <Preview>You did it — priority access to Darwin is yours.</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* Header */}
                    <Section style={header}>
                        <Text style={logo}>darwin.</Text>
                    </Section>

                    {/* Body */}
                    <Section style={body}>

                        <Text style={badge}>🎉 Priority access unlocked</Text>

                        <Text style={h1}>Five invites in. You&apos;re at the front of the line.</Text>

                        <Text style={p}>
                            Five students joined the Darwin waitlist through your link — thank
                            you for helping bring the marketplace to your campus. Here&apos;s
                            what you just earned:
                        </Text>

                        {/* Rewards */}
                        <Section style={perksBox}>
                            <Row style={perkRow}>
                                <Column style={perkIcon}>🚀</Column>
                                <Column>
                                    <Text style={perkText}>
                                        <strong>Priority early access</strong> — guaranteed entry the
                                        day Darwin goes live at your campus, ahead of the rest of the
                                        waitlist
                                    </Text>
                                </Column>
                            </Row>
                            <Row style={perkRow}>
                                <Column style={perkIcon}>🏅</Column>
                                <Column>
                                    <Text style={perkText}>
                                        <strong>Founding Supporter badge</strong> — a permanent mark on
                                        your profile for being one of the first to back Darwin
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Text style={p}>
                            Nothing else to do — we&apos;ve locked this to your email. We&apos;ll
                            be in touch the moment we open at your school.
                        </Text>

                        <Hr style={divider} />

                        <Text style={boldP}>Want even more out of launch day?</Text>
                        <Text style={p}>
                            Founding members get monthly boosted listings for life — one
                            payment, no renewals. Only 225 spots across two tiers.
                        </Text>

                        <Button style={cta} href="https://darwinmarketplace.ca/whitelist">
                            View founding tiers
                        </Button>

                        <Text style={{ ...p, marginBottom: 0 }}>— The Darwin team</Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            You&apos;re receiving this because you referred friends to the Darwin
                            waitlist.
                            {"\n"}© 2026 Vesper Works ·{" "}
                            <Link href="https://darwinmarketplace.ca" style={footerLink}>
                                darwinmarketplace.ca
                            </Link>
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
}

const main: React.CSSProperties = {
    backgroundColor: "#f4f4f4",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 0",
};

const container: React.CSSProperties = {
    maxWidth: "540px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e5e5",
};

const header: React.CSSProperties = {
    backgroundColor: "#0a0a0a",
    padding: "28px 32px 20px",
    textAlign: "center",
};

const logo: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "500",
    letterSpacing: "-0.02em",
    margin: 0,
};

const body: React.CSSProperties = {
    padding: "32px",
};

const badge: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "99px",
    margin: "0 0 16px",
};

const h1: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "500",
    color: "#0a0a0a",
    lineHeight: "1.3",
    margin: "0 0 12px",
};

const p: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: "1.75",
    color: "#555555",
    margin: "0 0 16px",
};

const boldP: React.CSSProperties = {
    ...p,
    fontWeight: "600",
    color: "#0a0a0a",
    marginBottom: "6px",
};

const perksBox: React.CSSProperties = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "20px 0",
};

const perkRow: React.CSSProperties = {
    marginBottom: "10px",
};

const perkIcon: React.CSSProperties = {
    width: "28px",
    fontSize: "16px",
    verticalAlign: "top",
    paddingTop: "2px",
};

const perkText: React.CSSProperties = {
    fontSize: "13px",
    color: "#555555",
    lineHeight: "1.5",
    margin: 0,
};

const divider: React.CSSProperties = {
    borderTop: "1px solid #ebebeb",
    margin: "24px 0",
};

const cta: React.CSSProperties = {
    display: "block",
    backgroundColor: "#0a0a0a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    margin: "20px 0",
};

const footer: React.CSSProperties = {
    padding: "16px 32px",
    borderTop: "1px solid #ebebeb",
    textAlign: "center",
};

const footerText: React.CSSProperties = {
    fontSize: "12px",
    color: "#aaaaaa",
    lineHeight: "1.6",
    margin: 0,
};

const footerLink: React.CSSProperties = {
    color: "#aaaaaa",
};
