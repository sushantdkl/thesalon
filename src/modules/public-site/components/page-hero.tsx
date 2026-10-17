import { CmsImage } from './cms-image';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

export function PageHero({
  eyebrow,
  title,
  description,
  imageUrl,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  /** Trail after Home, ending with the current page. Renders visible crumbs + BreadcrumbList. */
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-night">
      {/* Amber cove-light glow, as on the home page. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[10%] h-[90%] w-[70%] bg-[radial-gradient(closest-side,rgb(240_169_75/0.14),transparent)]" />
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:py-16 lg:px-10">
        <div>
          {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
          {eyebrow ? <p className="mb-4 text-[0.95rem] tracking-[0.04em] text-brass">{eyebrow}</p> : null}
          <h1 className="max-w-3xl text-balance font-display text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1]">{title}</h1>
          {description ? <p className="mt-5 max-w-[48ch] text-lg text-haze">{description}</p> : null}
        </div>
        {imageUrl ? (
          <div className="salon-mirror relative hidden aspect-square w-[min(28vw,260px)] overflow-hidden rounded-full border-[8px] border-[#0c0a09] md:block">
            <CmsImage src={imageUrl} alt="" fill priority sizes="260px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
