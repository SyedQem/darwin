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

export default function WaitlistEmail() {
    return (
        <Html>
            <Head />
            <Preview>You're on the Darwin waitlist — your campus marketplace is coming.</Preview>
            <Body style={main}>
                <Container style={container}>

                    {/* Header */}
                    <Section style={header}>
                        <Text style={logo}>darwin.</Text>
                    </Section>

                    {/* Body */}
                    <Section style={body}>

                        {/* Badge */}
                        <Text style={badge}>✅ You're on the list</Text>

                        <Text style={h1}>Your campus marketplace is coming.</Text>

                        <Text style={p}>
                            You're officially on the Darwin waitlist. We're building the
                            campus-only marketplace where verified students buy, sell, and
                            exchange safely and locally. No strangers. No shipping. Just
                            your campus.
                        </Text>

                        <Text style={p}>
                            We're launching at select campuses first. You'll be among the
                            first to know when Darwin goes live at yours.
                        </Text>

                        {/* Perks */}
                        <Section style={perksBox}>
                            <Row style={perkRow}>
                                <Column style={perkIcon}>🧑‍💻</Column>
                                <Column>
                                    <Text style={perkText}>
                                        <strong>Verified students only</strong> — every buyer and seller is confirmed with a university email
                                    </Text>
                                </Column>
                            </Row>
                            <Row style={perkRow}>
                                <Column style={perkIcon}>🏫</Column>
                                <Column>
                                    <Text style={perkText}>
                                        <strong>Campus-only listings</strong> — browse items from students at your school, no shipping needed
                                    </Text>
                                </Column>
                            </Row>
                            <Row style={perkRow}>
                                <Column style={perkIcon}>⚡</Column>
                                <Column>
                                    <Text style={perkText}>
                                        <strong>List in seconds</strong> — snap a photo and you're live
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={divider} />

                        <Text style={boldP}>Want to lock in early access forever?</Text>
                        <Text style={p}>
                            Founding members get monthly boosted listings for life — one
                            payment, no renewals. Only 225 spots across two tiers.
                        </Text>

                        <Button style={cta} href="https://darwinmarket.vercel.app/whitelist">
                            View founding tiers
                        </Button>

                        <Hr style={divider} />

                        <Text style={p}>
                            Know someone who'd love Darwin? Forward this email — the more
                            students on your campus who join early, the faster we launch
                            there.
                        </Text>

                        <Text style={{ ...p, marginBottom: 0 }}>— The Darwin team</Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            You're receiving this because you joined the Darwin waitlist.
                            {"\n"}© 2026 Vesper Works ·{" "}
                            <Link href="https://darwinmarket.vercel.app" style={footerLink}>
                                darwinmarket.ca
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
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
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