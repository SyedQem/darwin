"use client";

import { useEffect, useState } from "react";
import FoundingSecretCode from "./FoundingSecretCode";

type Props = {
    sessionId: string;
};

type StatusResponse = {
    ready: boolean;
    secret_code?: string;
};

export default function FoundingSuccessPending({ sessionId }: Props) {
    const [code, setCode] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let attempts = 0;
        let stopped = false;
        const maxAttempts = 20;
        const intervalMs = 1500;

        const poll = async () => {
            if (stopped) return;
            attempts += 1;
            try {
                const res = await fetch(
                    `/api/founding/status?session_id=${encodeURIComponent(sessionId)}`,
                );
                if (!res.ok) {
                    if (attempts >= maxAttempts) setFailed(true);
                    return;
                }
                const data = (await res.json()) as StatusResponse;
                if (data.ready && data.secret_code) {
                    setCode(data.secret_code);
                    stopped = true;
                    return;
                }
            } catch {
                /* retry */
            }
            if (attempts >= maxAttempts) {
                setFailed(true);
                stopped = true;
            }
        };

        void poll();
        const id = window.setInterval(() => void poll(), intervalMs);

        return () => {
            stopped = true;
            window.clearInterval(id);
        };
    }, [sessionId]);

    if (code) {
        return <FoundingSecretCode code={code} />;
    }

    if (failed) {
        return (
            <p className="waitlist-founding-copy text-secondary">
                Your payment went through, but your activation code is still
                being prepared. Refresh this page in a minute or check the email
                Stripe sent for your receipt — then contact support if the code
                still doesn&apos;t appear.
            </p>
        );
    }

    return (
        <p className="waitlist-founding-copy text-secondary">
            Payment received — generating your activation code&hellip;
        </p>
    );
}
