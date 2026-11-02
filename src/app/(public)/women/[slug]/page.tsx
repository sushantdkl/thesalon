import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { buildMetadata, getSiteContext } from '@/modules/public-site/services/seo';
import { createWhatsAppLink } from '@/modules/public-site/utils/whatsapp';
import { bookingHref, womenServices } from '@/modules/public-site/data/women-services';
import type { PublicService } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const category = womenServices.find((item) => item.slug === slug);
  if (!category) return { title: 'Page not found', robots: { index: false } };
  const context = await getSiteContext();
  const town = context.settings.district || 'Surkhet';
  return buildMetadata(context, {
    path: `/women/${slug}`,
    title: `${category.name} for women in ${town} | ${context.info.name}`,
    description: `${category.summary} Book online at ${context.info.name}, ${context.info.address}.`,
    image: category.image,
    publishedTime: undefined,
    modifiedTime: undefined,
  });
}

export default async function WomenCategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = womenServices.find((item) => item.slug === slug);
  if (!category) notFound();

  const { cms, info } = await getSiteContext();
  // Live price from the POS rate card when a service there matches; otherwise quoted at the salon.
  const priceFor = (keyword: string) =>
    (cms.services as PublicService[]).find((service) => service.name.toLowerCase().includes(keyword))?.priceLabel;
  const others = womenServices.filter((item) => item.slug !== slug);

  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: "Women's services", href: '/women' }, { name: category.name, href: `/women/${slug}` }]}
        eyebrow="Women's services"
        title={category.name}
        description={category.summary}
        imageUrl={category.image}
      />
      <Section hideHeader className="!py-10 md:!py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-panel">
            {category.items.map((item) => {
              const price = priceFor(item.book);
              return (
                <li key={item.name} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                  <div className="min-w-0">
                    <h2 className="font-display text-[1.45rem] font-normal leading-tight">{item.name}</h2>
                    <p className="mt-1 text-[0.95rem] text-haze">{item.detail}</p>
                    <p className="mt-1.5 text-sm tabular-nums text-brass">{price || 'Price at the salon'}</p>
                  </div>
                  <Link href={bookingHref(item.book, item.name)} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-glow px-6 text-[0.95rem] font-medium text-cinder transition hover:brightness-110">
                    Book
                  </Link>
                </li>
              );
            })}
          </ul>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-panel p-6">
              <h2 className="font-display text-xl font-normal">Not sure what to pick?</h2>
              <p className="mt-2 text-sm text-haze">Send us a photo of the look you want and we will suggest the right service and price.</p>
              <a
                href={createWhatsAppLink(`Hello ${info.name}, I have a question about ${category.name.toLowerCase()}.`, info.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line px-6 text-[0.95rem] font-medium text-plaster transition hover:border-plaster"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp
              </a>
            </div>
            <nav aria-label="Other women's services" className="rounded-2xl border border-line bg-panel p-6">
              <h2 className="text-sm text-haze">Other services</h2>
              <ul className="mt-3 grid gap-1">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/women/${item.slug}`} className="flex min-h-10 items-center text-plaster hover:text-brass">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
