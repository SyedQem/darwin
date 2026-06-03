import { retrieveSession } from "@/lib/stripe";
import { getPurchaseBySessionId } from "@/lib/founding-purchase";
import { isTierKey } from "@/lib/whitelist";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const sessionId = new URL(request.url).searchParams.get("session_id");
    if (!sessionId || !sessionId.startsWith("cs_")) {
        return Response.json({ error: "Invalid session" }, { status: 400 });
    }

    let paid = false;
    try {
        const session = await retrieveSession(sessionId);
        paid =
            session.payment_status === "paid" && isTierKey(session.metadata?.tier);
    } catch {
        return Response.json({ error: "Session not found" }, { status: 404 });
    }

    if (!paid) {
        return Response.json({ ready: false }, { status: 200 });
    }

    const purchase = await getPurchaseBySessionId(sessionId);
    if (!purchase) {
        return Response.json({ ready: false }, { status: 200 });
    }

    return Response.json({
        ready: true,
        secret_code: purchase.secret_code,
        tier: purchase.tier,
        email: purchase.email,
    });
}
