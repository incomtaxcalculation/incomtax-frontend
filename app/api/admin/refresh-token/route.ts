const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  const res = await fetch(`${BASE}/api/admin/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  const data = await res.json();
  const headers = new Headers();
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) headers.set("Set-Cookie", setCookie);

  return new Response(JSON.stringify(data), { status: res.status, headers });
}