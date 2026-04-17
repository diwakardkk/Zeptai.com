import { NextRequest, NextResponse } from "next/server";
import {
  handleCompanionEnd,
  handleCompanionFeedback,
  handleCompanionMessage,
  handleCompanionStart,
  handleCompanionStt,
  handleCompanionTts,
} from "@/lib/companion-doctor/server";

const CLIENT_COOKIE = "companion_client_id";

function withClientCookie(response: NextResponse, clientId: string, shouldSetCookie: boolean) {
  response.headers.set("Cache-Control", "no-store");
  if (shouldSetCookie) {
    response.cookies.set({
      name: CLIENT_COOKIE,
      value: clientId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export async function POST(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = params?.path || [];
  const clientId = request.cookies.get(CLIENT_COOKIE)?.value || crypto.randomUUID();
  const shouldSetCookie = !request.cookies.get(CLIENT_COOKIE)?.value;

  try {
    if (path[0] === "chat" && path[1] === "start") {
      const payload = (await request.json()) as { mode?: "voice" | "text"; language_preference?: string };
      return withClientCookie(NextResponse.json(await handleCompanionStart(clientId, payload)), clientId, shouldSetCookie);
    }

    if (path[0] === "chat" && path[1] === "message") {
      const payload = (await request.json()) as {
        session_id: string;
        message: string;
        language_preference?: string;
        channel?: "voice" | "text";
      };
      return withClientCookie(NextResponse.json(await handleCompanionMessage(clientId, payload)), clientId, shouldSetCookie);
    }

    if (path[0] === "chat" && path[1] === "end") {
      const payload = (await request.json()) as { session_id: string };
      return withClientCookie(NextResponse.json(await handleCompanionEnd(payload)), clientId, shouldSetCookie);
    }

    if (path[0] === "stt") {
      return withClientCookie(NextResponse.json(await handleCompanionStt(request)), clientId, shouldSetCookie);
    }

    if (path[0] === "tts") {
      const payload = (await request.json()) as { text: string; language_preference?: string; voice?: string };
      const speech = await handleCompanionTts(payload);
      return withClientCookie(
        new NextResponse(speech.audioBuffer, {
          status: 200,
          headers: { "Content-Type": speech.mediaType },
        }),
        clientId,
        shouldSetCookie,
      );
    }

    if (path[0] === "feedback") {
      const payload = (await request.json()) as { session_id?: string | null; consent_to_share?: boolean };
      return withClientCookie(NextResponse.json(await handleCompanionFeedback(payload)), clientId, shouldSetCookie);
    }

    return withClientCookie(NextResponse.json({ detail: "Not Found" }, { status: 404 }), clientId, shouldSetCookie);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return withClientCookie(NextResponse.json({ detail: message }, { status: 500 }), clientId, shouldSetCookie);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST,OPTIONS" },
  });
}