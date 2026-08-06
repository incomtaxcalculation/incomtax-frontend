const BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

function authHeader(request: Request) {
  const h = new Headers();
  const m = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("adminToken="));
  if (m) h.set("Authorization", `Bearer ${m.split("=")[1]}`);
  return h;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${BASE}/api/newsletter/${id}`, {
    method: "DELETE",
    headers: authHeader(request),
    credentials: "include",
  });
  return Response.json(await res.json(), { status: res.status });
}