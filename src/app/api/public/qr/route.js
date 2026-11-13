import QRCode from 'qrcode';
import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/security/rate-limit';
import { siteUrl } from '@/lib/seo/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The ONE permanent salon QR: always encodes <site>/review — no customer data, no ids.
 * ?format=svg (default) | png   ?size=pixels for png
 */
// The canonical origin, never the request's Host header: a spoofed Host would otherwise be
// baked into a publicly cached QR that customers scan.
function siteOrigin() {
  const configured = process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');
  return siteUrl();
}

export async function GET(request) {
  const limited = rateLimit(`qr:${clientIp(request)}`, { limit: 240, windowMs: 60_000 });
  if (!limited.allowed) return new NextResponse('Too many requests', { status: 429 });
  const params = new URL(request.url).searchParams;
  const target = `${siteOrigin()}/review`;
  const options = { errorCorrectionLevel: 'M', margin: 1, color: { dark: '#000000', light: '#ffffff' } };
  if (params.get('format') === 'png') {
    const size = Math.min(Math.max(Number(params.get('size') || 600), 120), 2000);
    const png = await QRCode.toBuffer(target, { ...options, width: size });
    return new NextResponse(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600', 'Content-Disposition': 'inline; filename="review-rewards-qr.png"' } });
  }
  const svg = await QRCode.toString(target, { ...options, type: 'svg' });
  return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600', 'X-QR-Target': target } });
}
