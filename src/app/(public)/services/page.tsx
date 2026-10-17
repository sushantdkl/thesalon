import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { ServiceMenuList } from '@/modules/public-site/components/service-menu-list';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import type { ServicePage } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/services');
}

export default async function ServicesPage() {
  const context = await getSiteContext();
  const { cms, servicePages } = context;
  const section = cms.sections.services;
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: 'Services', href: '/services' }]}
        eyebrow={section.subtitle || 'Rate card'}
        title="Services & prices"
        description={section.description || 'Cuts, colour, care and glam, with prices before you visit.'}
        imageUrl={section.imageUrl || context.info.assets.services}
      />
      <Section hideHeader className="!py-10 md:!py-14">
        {servicePages.length ? (
          <div className="mb-10">
            <h2 className="font-display text-2xl font-light text-plaster md:text-3xl">Service details</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicePages.map((page: ServicePage) => (
                <li key={page.slug}>
                  <Link href={`/services/${page.slug}`} className="group flex h-full flex-col border border-line bg-panel p-5 transition-colors hover:border-glow">
                    <span className="font-display text-xl font-light text-plaster">{page.name}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-haze">{page.summary}</span>
                    <span className="mt-4 text-xs font-bold uppercase tracking-wider text-brass group-hover:underline">Prices & details</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <h2 className="mb-5 font-display text-2xl font-light text-plaster md:text-3xl">Full price list</h2>
        <ServiceMenuList services={cms.services} />
        <div className="mt-8">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
          >
            Book a service
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
