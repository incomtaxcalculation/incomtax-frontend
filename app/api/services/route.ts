const BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const res = await fetch(`${BASE}/api/services${url.search}`, {
    method: "GET",
    headers: authHeader(request),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${BASE}/api/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authObj(request) },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}

function authHeader(request: Request) {
  const h = new Headers();
  const m = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("adminToken="));
  if (m) h.set("Authorization", `Bearer ${m.split("=")[1]}`);
  return h;
}

function authObj(request: Request) {
  const h: Record<string, string> = {};
  const m = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("adminToken="));
  if (m) h["Authorization"] = `Bearer ${m.split("=")[1]}`;
  return h;
}