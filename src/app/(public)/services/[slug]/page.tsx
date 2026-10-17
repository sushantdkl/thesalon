import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { MapPin, MessageCircle } from 'lucide-react';
import Database from '@/lib/db/index';
import { publishedReviews } from '@/lib/reviews/service';
import { SiteShell, directionsUrl } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { CmsImage } from '@/modules/public-site/components/cms-image';
import { JsonLd } from '@/modules/public-site/components/json-ld';
import { RichText } from '@/modules/public-site/components/rich-text';
import { findRedirect, getSiteContext, matchServices, serviceJsonLd, servicePageMetadata } from '@/modules/public-site/services/seo';
import { createWhatsAppLink } from '@/modules/public-site/utils/whatsapp';
import type { PublicPackage, PublicService, PublicStaffMember, PublishedReview, ServicePage } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

async function loadPage(slug: string) {
  const context = await getSiteContext();
  const page: ServicePage | undefined = context.servicePages.find((item: ServicePage) => item.slug === slug);
  return { context, page };
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const { context, page } = await loadPage(slug);
  if (!page) return { title: 'Page not found', robots: { index: false } };
  return servicePageMetadata(context, page);
}

function minutes(value?: number) {
  if (!value) return '';
  return value >= 60 ? `${Math.floor(value / 60)} hr${value % 60 ? ` ${value % 60} min` : ''}` : `${value} min`;
}

export default async function ServiceLandingPage({ params }: Params) {
  const { slug } = await params;
  const { context, page } = await loadPage(slug);
  if (!page) {
    const target = await findRedirect(`/services/${slug}`);
    if (target) permanentRedirect(target);
    notFound();
  }

  const { cms, info, settings } = context;
  const { services, packages } = matchServices(page, cms);
  const serviceNames = new Set(services.map((service: PublicService) => service.name.toLowerCase()));
  const team = (cms.staff as PublicStaffMember[]).filter((member) => member.specialties.some((item) => serviceNames.has(item.toLowerCase())));
  const related = page.related
    .map((relatedSlug: string) => context.servicePages.find((item: ServicePage) => item.slug === relatedSlug))
    .filter(Boolean) as ServicePage[];
  let reviews: PublishedReview[] = [];
  try {
    reviews = (await publishedReviews(Database.getInstance(), { limit: 50 }))
      .filter((review: PublishedReview) => review.service && serviceNames.has(String(review.service).toLowerCase()) && review.text)
      .slice(0, 3);
  } catch {
    reviews = [];
  }
  const town = settings.district || 'Surkhet';
  const priced = services.filter((service: PublicService) => service.priceLabel);
  // FAQs built from real data first (price, booking, location), then the owner's own questions.
  const faqs = [
    priced.length ? {
      question: `How much does ${page.name.toLowerCase()} cost at ${info.name}?`,
      answer: `${priced.map((service: PublicService) => `${service.name}: ${service.priceLabel}`).join('. ')}. Prices are from the current salon price list.`,
    } : null,
    {
      question: 'How do I book?',
      answer: `Use the Book Appointment page, send a WhatsApp message to ${info.phone}, or call the salon.`,
    },
    {
      question: `Where is ${info.name}?`,
      answer: `${info.name} is at ${info.address}${settings.landmark ? ` (${settings.landmark})` : ''}${settings.region ? `, ${settings.region}` : ''}.${info.openingHours ? ` Opening hours: ${info.openingHours}.` : ''}`,
    },
    ...page.faqs,
  ].filter(Boolean) as Array<{ question: string; answer: string }>;

  return (
    <SiteShell>
      <JsonLd data={serviceJsonLd(context, page, services)} />
      <PageHero
        breadcrumbs={[{ name: 'Services', href: '/services' }, { name: page.name, href: `/services/${page.slug}` }]}
        eyebrow={`${info.name} · ${town}`}
        title={page.heading}
        description={page.summary}
        imageUrl={page.image || info.assets.services}
      />

      <Section hideHeader className="!py-10 md:!py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <RichText body={page.body} />
            {page.suitableFor ? (
              <div className="mt-8 border-l-2 border-glow pl-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">Good for</h2>
                <p className="mt-2 text-base leading-relaxed text-plaster/85">{page.suitableFor}</p>
              </div>
            ) : null}
            {page.image && page.imageAlt ? (
              <div className="relative mt-10 aspect-[4/3] overflow-hidden bg-panel-2">
                <CmsImage src={page.image} alt={page.imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="border border-line bg-panel p-6">
              <h2 className="font-display text-2xl font-light text-plaster">Prices</h2>
              <ul className="mt-4 divide-y divide-line">
                {services.map((service: PublicService) => (
                  <li key={service.name} className="flex items-baseline justify-between gap-4 py-3">
                    <span>
                      <span className="block font-medium text-plaster">{service.name}</span>
                      {service.duration ? <span className="text-xs text-haze">About {minutes(service.duration)}</span> : null}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-plaster">{service.priceLabel}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3">
                <Link href="/book-appointment" className="inline-flex min-h-12 items-center justify-center bg-glow rounded-full px-6 text-[0.95rem] font-medium text-cinder hover:bg-glow-hi">
                  Book {page.name.toLowerCase()}
                </Link>
                <a href={createWhatsAppLink(`Hello ${info.name}, I would like to ask about ${page.name.toLowerCase()}.`, info.whatsappNumber)} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-line rounded-full px-6 text-[0.95rem] font-medium text-plaster hover:bg-panel-2">
                  <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>

            {packages.length ? (
              <div className="border border-line bg-panel p-6">
                <h2 className="font-display text-xl font-light text-plaster">Also in these packages</h2>
                <ul className="mt-3 space-y-2 text-sm text-plaster/85">
                  {packages.map((item: PublicPackage) => (
                    <li key={item.name} className="flex justify-between gap-3"><span>{item.name}</span><span className="tabular-nums">Rs. {item.price}</span></li>
                  ))}
                </ul>
                <Link href="/packages" className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-brass hover:underline">Compare packages</Link>
              </div>
            ) : null}

            <div className="border border-line bg-panel p-6">
              <h2 className="font-display text-xl font-light text-plaster">Visit us</h2>
              <p className="mt-3 text-sm leading-relaxed text-plaster/85">{info.address}{settings.landmark ? ` · ${settings.landmark}` : ''}</p>
              {info.openingHours ? <p className="mt-2 text-sm text-haze">{info.openingHours}</p> : null}
              <a href={directionsUrl(context)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brass hover:underline">
                <MapPin className="h-4 w-4" /> Directions
              </a>
            </div>
          </aside>
        </div>
      </Section>

      {team.length ? (
        <Section eyebrow="Team" title={`Who does ${page.name.toLowerCase()}`}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li key={member.name} className="border border-line bg-panel p-5">
                <p className="font-display text-xl font-light text-plaster">{member.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-haze">{member.role}</p>
              </li>
            ))}
          </ul>
          <Link href="/staff" className="mt-6 inline-block text-xs font-bold uppercase tracking-wider text-brass hover:underline">Meet the full team</Link>
        </Section>
      ) : null}

      {reviews.length ? (
        <Section eyebrow="Reviews" title={`What customers said about ${page.name.toLowerCase()}`}>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review: PublishedReview, index: number) => (
              <figure key={index} className="border border-line bg-panel p-6">
                {review.rating ? <p className="tracking-widest text-brass" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</p> : null}
                <blockquote className="mt-2 text-sm leading-relaxed text-plaster/85">“{review.text}”</blockquote>
                <figcaption className="mt-3 text-xs uppercase tracking-wider text-haze">{review.name} · {review.service}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      <Section eyebrow="Questions" title="Common questions">
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium text-plaster">
                {faq.question}
                <span aria-hidden="true" className="text-brass transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-plaster/85">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {related.length ? (
        <Section eyebrow="More services" title="Related services" className="!border-b-0">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item: ServicePage) => (
              <li key={item.slug}>
                <Link href={`/services/${item.slug}`} className="flex h-full flex-col border border-line bg-panel p-5 hover:border-glow">
                  <span className="font-display text-xl font-light text-plaster">{item.name}</span>
                  <span className="mt-2 text-sm text-haze">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </SiteShell>
  );
}
