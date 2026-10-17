import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { CmsImage } from '@/modules/public-site/components/cms-image';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import type { GalleryItem } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/gallery');
}

export default async function GalleryPage() {
  const context = await getSiteContext();
  const { cms } = context;
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: 'Gallery', href: '/gallery' }]}
        eyebrow="Gallery"
        title="Salon gallery"
        description="Inside The Salon & Glam Studio: round backlit mirrors, brass lamps, cove lights and the work we do under them."
        imageUrl={context.info.assets.banner}
      />
      <Section hideHeader className="!py-10 md:!py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cms.gallery.map((item: GalleryItem) => (
            <article
              key={`${item.id || item.title}-${item.image}`}
              className="group overflow-hidden border border-line bg-panel transition-shadow duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
                <CmsImage
                  src={item.image}
                  alt={item.altText || item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                  {item.category || 'Salon'}
                </p>
                <h3 className="mt-2 font-display text-xl font-light text-plaster">{item.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-haze">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center border border-glow bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
          >
            Book a visit
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
