// Only people who open the secret link (or scan its QR code) can see this site.
// Everyone else gets a plain 404, including search engines.
//
// Setup: in Vercel, Project > Settings > Environment Variables, add ACCESS_KEY
// (a long random string), then redeploy. The link to share is
//   https://<your-site>/?k=<ACCESS_KEY>
// The first visit with the key sets a cookie and cleans the key out of the
// address bar; that browser stays allowed for a year. To cut off everyone,
// change ACCESS_KEY and redeploy (old links and QR codes stop working).

export const config = {
  matcher: '/:path*',   // every path: the page, the mesh file and the scripts
};

const COOKIE = 'pto_access';

export default function middleware(request) {
  const key = process.env.ACCESS_KEY;
  const deny = () => new Response('Not found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
  if (!key) return deny();   // no key configured: stay locked

  const url = new URL(request.url);
  if (url.searchParams.get('k') === key) {
    // remember this browser, then reload without the key in the address bar
    url.searchParams.delete('k');
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + url.search,
        'Set-Cookie': `${COOKIE}=${encodeURIComponent(key)}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
        'Cache-Control': 'no-store',
      },
    });
  }

  const cookies = (request.headers.get('cookie') || '').split(/;\s*/);
  if (cookies.includes(`${COOKIE}=${encodeURIComponent(key)}`)) return;   // allowed: serve the site as normal

  return deny();
}
