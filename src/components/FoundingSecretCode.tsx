"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
    code: string;
};

export default function FoundingSecretCode({ code }: Props) {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    }, [code]);

    return (
        <div className="founding-secret-code-block">
            <p className="founding-secret-code-label">Your activation code</p>
            <div className="founding-secret-code-row">
                <span className="founding-secret-code" aria-label="Activation code">
                    {code}
                </span>
                <button
                    type="button"
                    onClick={copy}
                    className="founding-secret-code-copy pill-btn pill-btn-outline"
                    aria-label={copied ? "Copied" : "Copy activation code"}
                >
                    {copied ? (
                        <>
                            <Check size={15} />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy size={15} />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <p className="founding-secret-code-hint text-secondary text-sm mt-3">
                Save this code. You&apos;ll enter it when you create your Darwin
                account to unlock your founding benefits.
            </p>
        </div>
    );
}
