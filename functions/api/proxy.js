// Cloudflare Pages Function: /api/proxy?url=<https url>
// วางที่ functions/api/proxy.js ในรูทของรีโป (ข้างๆ index.html)
const ALLOWED_HOSTS = [
  "clpp-radar.onwr.go.th",
  "api-v3.thaiwater.net",
  "wxmap.tmd.go.th",
];

export async function onRequestGet({ request }) {
  const target = new URL(request.url).searchParams.get("url");
  let u;
  try { u = new URL(target); } catch { return new Response("bad url", { status: 400 }); }
  if (u.protocol !== "https:" || !ALLOWED_HOSTS.includes(u.hostname)) {
    return new Response("forbidden", { status: 403 });
  }
  const upstream = await fetch(u.toString(), {
    headers: { "User-Agent": "Mozilla/5.0 (ron-youtube proxy)", "Accept": "application/json,*/*" },
    cf: { cacheTtl: 60, cacheEverything: true },
  });
  const headers = new Headers(upstream.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cache-Control", "public, max-age=60");
  return new Response(upstream.body, { status: upstream.status, headers });
}
