import { corsHeaders } from "./cors.ts";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function errorResponse(request: Request, error: unknown): Response {
  if (error instanceof HttpError) {
    return jsonResponse(request, { error: error.message }, error.status);
  }

  const message = error instanceof Error ? error.message : "unexpected server error";
  console.error("edge_function_error", { message });
  return jsonResponse(request, { error: "요청을 처리하지 못했습니다." }, 500);
}

export async function readJson<T>(request: Request): Promise<T> {
  if (request.method !== "POST") {
    throw new HttpError(405, "POST 요청만 허용됩니다.");
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new HttpError(415, "JSON 요청이 필요합니다.");
  }
  try {
    return await request.json() as T;
  } catch {
    throw new HttpError(400, "올바른 JSON 요청이 아닙니다.");
  }
}
