import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { PackageCard } from '@/modules/public-site/components/cards';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import type { PublicPackage } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/packages');
}

export default async function PackagesPage() {
  const context = await getSiteContext();
  const { cms } = context;
  const section = cms.sections.packages;
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: 'Packages', href: '/packages' }]}
        eyebrow={section.subtitle || 'Packages'}
        title={section.title || 'Packages'}
        description={section.description || 'Several services in one visit, priced together.'}
        imageUrl={section.imageUrl || context.info.assets.services}
      />
      <Section hideHeader className="!py-10 md:!py-14">
        {!cms.packages.length ? (
          <p className="max-w-[48ch] text-haze">Packages are being put together. Call or message us and we will plan a combination of services for your visit.</p>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-3">
          {cms.packages.map((item: PublicPackage, index: number) => (
            <PackageCard key={item.name} item={item} variant="tier" featured={index === 1} />
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center border border-glow bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
          >
            Book a package
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center border border-glow bg-panel min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-plaster transition-colors duration-300 hover:bg-panel-2"
          >
            View services
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
