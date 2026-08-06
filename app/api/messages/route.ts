const BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

export async function GET(request: Request) {
  const res = await fetch(`${BASE}/api/messages`, {
    method: "GET",
    headers: authHeader(request),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function DELETE(request: Request) {
  const res = await fetch(`${BASE}/api/messages`, {
    method: "DELETE",
    headers: authHeader(request),
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