const BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

function authHeader(request: Request) {
  const h = new Headers();
  const m = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("adminToken="));
  if (m) h.set("Authorization", `Bearer ${m.split("=")[1]}`);
  return h;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || request.headers.get("x-client-ip") || "";
}

export async function GET(request: Request) {
  const res = await fetch(`${BASE}/api/newsletter`, {
    method: "GET",
    headers: authHeader(request),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "";
  
  const res = await fetch(`${BASE}/api/newsletter`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-client-ip": clientIp,
      "x-user-agent": userAgent,
      ...authHeader(request)
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}