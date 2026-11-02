import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { CmsImage } from '@/modules/public-site/components/cms-image';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import { bookingHref, womenServices } from '@/modules/public-site/data/women-services';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/women');
}

// Every chip books in one tap; "Details & prices" opens the small page for the category.
export default function WomenServicesPage() {
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: "Women's services", href: '/women' }]}
        eyebrow="For her"
        title="Women's services"
        description="Tap a service to book it, or open a category for details and prices."
        imageUrl="/img/balayage.jpg"
      />
      <Section hideHeader className="!py-10 md:!py-14">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {womenServices.map((category) => (
            <li key={category.slug} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
              <Link href={`/women/${category.slug}`} className="relative block aspect-[16/9]" tabIndex={-1} aria-hidden="true">
                <CmsImage src={category.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-[1.7rem] font-normal leading-tight">{category.name}</h2>
                <p className="mt-1 text-[0.95rem] text-haze">{category.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Book ${category.name}`}>
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link href={bookingHref(item.book, item.name)} className="inline-flex min-h-10 items-center rounded-full border border-line px-3.5 text-sm text-plaster transition hover:border-glow">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/women/${category.slug}`} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[0.95rem] font-medium text-brass">
                  Details &amp; prices <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </SiteShell>
  );
}
