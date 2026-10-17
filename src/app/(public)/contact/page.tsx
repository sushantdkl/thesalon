import Link from 'next/link';
import { Clock, Facebook, MapPin, MessageCircle, Music2, Navigation, Phone } from 'lucide-react';
import { SiteShell, directionsUrl } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import { createWhatsAppLink } from '@/modules/public-site/utils/whatsapp';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/contact');
}

export default async function ContactPage() {
  const context = await getSiteContext();
  const { cms, info, settings } = context;
  const tel = `tel:${String(info.phone || '').replace(/[^\d+]/g, '')}`;
  const rows: Array<[typeof MapPin, string, string, string?]> = [
    [MapPin, 'Address', [info.address, settings.region, 'Nepal'].filter(Boolean).join(', ')],
    [Phone, 'Phone', info.phone, tel],
    [Clock, 'Opening hours', info.openingHours || "Please call or WhatsApp to confirm today's hours."],
  ];
  if (settings.landmark) rows.splice(1, 0, [MapPin, 'Landmark', settings.landmark]);
  if (settings.parking) rows.push([MapPin, 'Parking', settings.parking]);
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
        eyebrow={info.name}
        title="Contact & Directions"
        description={cms.sections.contact.description || 'Reach the salon or request an appointment through WhatsApp.'}
        imageUrl={cms.sections.contact.imageUrl || info.assets.about}
      />
      <Section hideHeader className="!py-10 md:!py-14 !border-b-0">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-6">
            {rows.map(([Icon, label, value, href]) => (
              <div key={String(label)} className="flex gap-4 border border-line bg-panel p-6">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brass" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">{String(label)}</p>
                  <p className="mt-2 font-display text-xl font-light leading-relaxed text-plaster md:text-2xl">
                    {href ? <a href={href} className="hover:text-glow">{value}</a> : value}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={directionsUrl(context)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-plaster bg-panel min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-plaster transition-colors duration-300 hover:bg-panel-2"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
              <a
                href={createWhatsAppLink(undefined, info.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={info.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-line bg-panel min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-plaster transition-colors duration-300 hover:bg-panel-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
              <a
                href={info.social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-line bg-panel min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-plaster transition-colors duration-300 hover:bg-panel-2"
              >
                <Music2 className="h-4 w-4" />
                TikTok
              </a>
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center border border-glow bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
              >
                Book appointment
              </Link>
            </div>
          </div>
          <div className="overflow-hidden border border-line bg-panel">
            <iframe
              src={info.mapEmbedUrl}
              title={`Map showing ${info.name}, ${info.address}`}
              className="h-[380px] w-full md:h-[440px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
