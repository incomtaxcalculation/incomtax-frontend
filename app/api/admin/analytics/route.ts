const BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const res = await fetch(`${BASE}/api/admin/analytics${url.search}`, {
    method: "GET",
    headers: authHeader(request),
    credentials: "include",
  });

  const data = await res.json();
  const headers = new Headers();
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) headers.set("Set-Cookie", setCookie);

  return new Response(JSON.stringify(data), { status: res.status, headers });
}

function authHeader(request: Request) {
  const h = new Headers();
  const m = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("adminToken="));
  if (m) h.set("Authorization", `Bearer ${m.split("=")[1]}`);
  return h;
}