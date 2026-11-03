import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import { menServices } from '@/modules/public-site/data/men-services';
import { bookingHref } from '@/modules/public-site/data/women-services';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/men');
}

// The whole men's rate card on one page: every row books in one tap.
export default function MenServicesPage() {
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: "Men's services", href: '/men' }]}
        eyebrow="For him"
        title="Men's services"
        description="Our full men's price list. Tap Book next to any service to pick a time."
        imageUrl="/img/studio/mens-cut-scissors.jpg"
      />
      <Section hideHeader className="!py-10 md:!py-14">
        <nav aria-label="Jump to a category" className="mb-8 flex flex-wrap gap-2">
          {menServices.map((category) => (
            <a key={category.slug} href={`#${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-[0.92rem] text-plaster transition hover:border-glow">
              {category.name}
            </a>
          ))}
        </nav>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {menServices.map((category) => (
            <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-title`} className="scroll-mt-24 rounded-2xl border border-line bg-panel p-5 md:p-7">
              <h2 id={`${category.slug}-title`} className="border-b border-line pb-4 font-display text-[1.7rem] font-normal leading-tight">{category.name}</h2>
              <ul>
                {category.items.map((item) => (
                  <li key={item.name} className="flex items-center gap-4 border-b border-dashed border-line py-3.5 last:border-b-0">
                    <span className="min-w-0 flex-1 font-medium">{item.name}</span>
                    <span className="shrink-0 text-right tabular-nums text-brass">{item.price}</span>
                    <Link
                      href={bookingHref(item.book, `Men's ${item.name.toLowerCase()}`)}
                      aria-label={`Book ${item.name}`}
                      className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-glow px-4 text-sm font-medium text-cinder transition hover:brightness-110"
                    >
                      Book
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-7 text-[0.92rem] text-haze">Prices marked &ldquo;&amp; up&rdquo; depend on hair length and the products used.</p>
      </Section>
    </SiteShell>
  );
}
