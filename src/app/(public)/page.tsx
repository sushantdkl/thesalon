import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { Section } from '@/modules/public-site/components/section';
import { CustomerReviews } from '@/modules/public-site/components/customer-reviews';
import { PackageCard } from '@/modules/public-site/components/cards';
import { StaffCarousel } from '@/modules/public-site/components/staff-carousel';
import { CmsImage } from '@/modules/public-site/components/cms-image';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import { createWhatsAppLink } from '@/modules/public-site/utils/whatsapp';
import type { GalleryItem, PublicPackage, ServicePage } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/');
}

/** One studio, two sides of the floor, plus the glam studio. */
const SERVICE_MENU = [
  {
    title: 'For him',
    side: 'Barber chair',
    items: [
      ['Haircut and styling', 'Classic, textured or modern crops, finished with product.'],
      ['Skin fade and taper', 'Clean clipper work, blended to the skin.'],
      ['Beard trim and shape', 'Line-up, shaping and hot towel finish.'],
      ['Hair colour', 'Grey coverage, global colour and fashion streaks.'],
      ['Facial and head massage', 'A cleanse and a reset after a long week.'],
    ],
  },
  {
    title: 'For her',
    side: 'Hair studio',
    items: [
      ['Cut and blow-dry', 'Layers, curtain fringes, long and short shapes.'],
      ['Colour and highlights', 'Global colour, highlights and soft balayage.'],
      ['Hair spa', 'Deep conditioning for dry or coloured hair.'],
      ['Smoothing and keratin', 'Frizz control that lasts for months.'],
      ['Waxing and threading', 'Quick, neat and gentle.'],
    ],
  },
  {
    title: 'Glam studio',
    side: 'Makeup and occasions',
    items: [
      ['Party makeup', 'Soft glam to full evening looks.'],
      ['Bridal and engagement', 'Trial, makeup and hairstyling for the big day.'],
      ['Event hairstyling', 'Buns, waves and braids that hold all night.'],
      ['Saree draping', 'Neat pleats, pinned to stay.'],
      ['Group bookings', 'For bridesmaids, family and teams.'],
    ],
  },
] as const;

const SHADES = [
  ['Light blonde', 'Level 8', '#c9a46b', '#a07d48'],
  ['Blonde', 'Level 7', '#a8844e', '#7d5f33'],
  ['Dark blonde', 'Level 6', '#866639', '#5d4423'],
  ['Light brown', 'Level 5', '#6b4b2a', '#47301a'],
  ['Brown', 'Level 4', '#4f3520', '#2f1f12'],
  ['Dark brown', 'Level 3', '#36241a', '#1c130d'],
] as const;

// Mosaic slots for the first five gallery photos, as in the studio reference layout.
const MOSAIC = ['row-span-2', 'sm:col-span-2', 'row-span-2', '', ''];

const BTN_GLOW = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-glow px-6 py-3.5 text-[0.98rem] font-medium text-cinder transition hover:brightness-110 active:translate-y-px';
const BTN_LINE = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-plaster/30 px-6 py-3.5 text-[0.98rem] font-medium text-plaster transition hover:border-plaster active:translate-y-px';

export default async function HomePage() {
  const context = await getSiteContext();
  const { cms, info, settings, servicePages } = context;
  const { sections } = cms;
  const place = [settings.locality, settings.district].filter(Boolean).join(', ');
  const hero = sections.hero;
  const servicesSection = sections.services;
  const packagesSection = sections.packages;
  const staffSection = sections.staff;
  const colour = sections.about;
  const contact = sections.contact;
  const whatsappUrl = createWhatsAppLink(`Hello ${info.name}, I'd like to book a visit.`, info.whatsappNumber);
  const tel = `tel:${String(info.phone || '').replace(/[^\d+]/g, '')}`;
  const heroTitle = hero.title || info.name;
  const gallery: GalleryItem[] = cms.gallery.slice(0, 5);
  const socials = [
    ['Instagram', info.social.instagram],
    ['Facebook', info.social.facebook],
    ['TikTok', info.social.tiktok],
  ].filter(([, href]) => href) as Array<[string, string]>;

  return (
    <SiteShell isHome>
      <main>
        {hero.isVisible ? (
          <header className="relative overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[10%] h-[90%] w-[70%] bg-[radial-gradient(closest-side,rgb(240_169_75/0.16),transparent)]" />
            <div className="relative mx-auto grid max-w-[1180px] items-center gap-11 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:gap-[clamp(32px,6vw,80px)] md:py-[clamp(48px,8vw,104px)] lg:px-10">
              <div>
                <p className="mb-5 text-[0.95rem] tracking-[0.04em] text-brass">{hero.subtitle || info.tagline}</p>
                <h1 className="text-balance font-display text-[clamp(2.75rem,15vw,4rem)] font-normal leading-[0.95] tracking-[-0.01em] sm:text-[clamp(3rem,7.4vw,6rem)]">
                  {heroTitle}
                  {heroTitle === 'The Salon' ? <em className="mt-[0.12em] block text-[0.62em] italic text-brass">&amp; Glam Studio</em> : null}
                  {/* Says what and where in the one H1, visibly — not hidden SEO text. */}
                  <span className="mt-4 block font-jost text-sm font-medium uppercase tracking-[0.18em] text-haze">
                    {settings.businessDescriptor}{place ? ` in ${place}` : ''}
                  </span>
                </h1>
                <p className="mt-6 max-w-[40ch] text-[1.05rem] text-haze sm:text-[1.15rem]">{hero.description || info.description}</p>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  <Link href={hero.buttonLink || '/book-appointment'} className={BTN_GLOW}>{hero.buttonText || 'Book a visit'}</Link>
                  <Link href="#services" className={BTN_LINE}>See services</Link>
                </div>
              </div>
              <div className="relative aspect-square w-[min(88%,340px)] justify-self-center sm:w-[min(86%,400px)] md:w-[min(100%,460px)]">
                <div className="salon-mirror absolute inset-0 rounded-full bg-[#0c0a09] p-2.5">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <CmsImage
                      src={hero.imageUrl || info.assets.hero}
                      alt={`Long layered cut with soft brown balayage, styled at ${info.name}`}
                      fill
                      priority
                      sizes="(min-width: 768px) 460px, 88vw"
                      className="object-cover object-[50%_30%]"
                    />
                  </div>
                </div>
                <div className="absolute -right-1.5 bottom-[4%] aspect-square w-[30%] overflow-hidden rounded-full border-[6px] border-night shadow-[0_0_24px_rgba(240,169,75,0.35)]">
                  <CmsImage src={info.assets.heroMini} alt="Gold styling scissors in front of the salon's round mirrors" fill sizes="140px" className="object-cover" />
                </div>
              </div>
            </div>
          </header>
        ) : null}

        <div className="border-y border-line bg-panel">
          <dl className="mx-auto grid max-w-[1180px] gap-x-10 gap-y-5 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-10">
            <div>
              <dt className="text-sm text-haze">Find us</dt>
              <dd className="mt-0.5">{[info.address, settings.landmark].filter(Boolean).join(', ')}</dd>
            </div>
            <div>
              <dt className="text-sm text-haze">Call</dt>
              <dd className="mt-0.5"><a href={tel} className="tabular-nums no-underline">{info.phone}</a></dd>
            </div>
            <div>
              <dt className="text-sm text-haze">WhatsApp</dt>
              <dd className="mt-0.5"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="tabular-nums">{info.whatsappNumber.replace(/^977/, '')}</a></dd>
            </div>
          </dl>
        </div>

        {servicesSection.isVisible ? (
          <Section id="services" title={servicesSection.title || 'Services'} description={servicesSection.description}>
            <div className="grid gap-[clamp(20px,3vw,36px)] sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_MENU.map((group) => (
                <div key={group.title} className="rounded-t-[200px] rounded-b-[14px] border border-line bg-panel px-[clamp(22px,2.6vw,32px)] pb-7 pt-[clamp(40px,5vw,56px)] sm:last:col-span-2 lg:last:col-span-1 sm:rounded-t-full">
                  <h3 className="text-center font-display text-[1.9rem] font-normal">{group.title}</h3>
                  <p className="mt-1.5 border-b border-line pb-5 text-center text-[0.9rem] text-brass">{group.side}</p>
                  <ul className="mt-2">
                    {group.items.map(([name, detail]) => (
                      <li key={name} className="border-b border-dashed border-line py-3.5 last:border-b-0">
                        <b className="block font-medium">{name}</b>
                        <span className="text-[0.92rem] text-haze">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-7 text-[0.92rem] text-haze">Prices depend on hair length and the products used. Call or message us for a quote before you come in.</p>
            {servicePages.length ? (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Service details">
                {servicePages.map((page: ServicePage) => (
                  <li key={page.slug}>
                    <Link href={`/services/${page.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[0.95rem] text-plaster transition hover:border-plaster">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services" className={BTN_LINE}>View the full rate card</Link>
            </div>
          </Section>
        ) : null}

        {colour.isVisible ? (
          <section id="colour" className="scroll-mt-20 bg-panel py-16 md:py-24 lg:py-28">
            <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(32px,6vw,88px)] px-4 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:px-10">
              <figure className="relative m-0 aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-t-full rounded-b-lg">
                <CmsImage
                  src={colour.imageUrl || colour.metadata.galleryImages?.[0] || info.assets.colour}
                  alt="Hair colour swatch chart from light blonde to dark brown, with the salon floor behind"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </figure>
              <div>
                <h2 className="text-balance font-display text-[clamp(2rem,4vw,2.9rem)] font-normal leading-[1.08]">{colour.title}</h2>
                {colour.description ? <p className="mt-4 max-w-[48ch] text-haze">{colour.description}</p> : null}
                <div className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-6" role="list" aria-label="Shade levels from the colour chart">
                  {SHADES.map(([name, level, from, to]) => (
                    <div key={name} role="listitem" className="grid justify-items-center gap-2 text-center">
                      <i className="block aspect-[1/1.6] w-full max-w-14 rounded-t-full rounded-b-md border border-line" style={{ background: `linear-gradient(${from},${to})` }} />
                      <b className="text-[0.8rem] font-medium leading-tight">{name}</b>
                      <span className="text-xs tabular-nums text-haze">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {packagesSection.isVisible && cms.packages.length ? (
          <Section eyebrow={packagesSection.subtitle} title={packagesSection.title} description={packagesSection.description}>
            <div className="grid gap-6 lg:grid-cols-3">
              {cms.packages.map((item: PublicPackage, index: number) => (
                <PackageCard key={item.name} item={item} variant="tier" featured={index === 1} />
              ))}
            </div>
            <div className="mt-10">
              <Link href="/packages" className={BTN_LINE}>Compare all packages</Link>
            </div>
          </Section>
        ) : null}

        {staffSection.isVisible && cms.staff.length ? (
          <Section theme="dark" eyebrow={staffSection.subtitle} title={staffSection.title} description={staffSection.description}>
            <StaffCarousel staff={cms.staff} tone="dark" />
            <div className="mt-10">
              <Link href="/staff" className={BTN_LINE}>Meet the full team</Link>
            </div>
          </Section>
        ) : null}

        {gallery.length ? (
          <Section id="gallery" title="Inside the studio" description="Round backlit mirrors, brass lamps and cove lights. More of our work is on Instagram at @thesalonsurkhet.">
            <div className="grid auto-rows-[260px] grid-cols-1 gap-3.5 sm:auto-rows-[clamp(160px,42vw,240px)] sm:grid-cols-2 lg:auto-rows-[clamp(150px,18vw,230px)] lg:grid-cols-4">
              {gallery.map((item, index) => (
                <figure key={`${item.image}-${index}`} className={`group relative m-0 overflow-hidden rounded-md bg-panel ${MOSAIC[index] || ''}`}>
                  <CmsImage
                    src={item.image}
                    alt={item.altText || item.description || item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <figcaption className="absolute bottom-2.5 left-3 rounded-full bg-night/70 px-2.5 py-1 text-[0.82rem] text-plaster">{item.title}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/gallery" className={BTN_LINE}>See the full gallery</Link>
            </div>
          </Section>
        ) : null}

        <CustomerReviews />

        <section id="visit" className="scroll-mt-20 border-t border-line py-16 md:py-24 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] items-start gap-[clamp(32px,6vw,88px)] px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:px-10">
            <div>
              <h2 className="font-display text-[clamp(2.1rem,4.4vw,3.2rem)] font-normal leading-[1.08]">{contact.title || 'Visit us'}</h2>
              <dl className="mt-7 grid gap-5">
                <div>
                  <dt className="text-sm text-haze">Address</dt>
                  <dd className="mt-0.5 text-lg">{info.address}{settings.landmark ? <><br />{settings.landmark}</> : null}</dd>
                </div>
                <div>
                  <dt className="text-sm text-haze">Phone</dt>
                  <dd className="mt-0.5 text-lg"><a href={tel} className="tabular-nums no-underline">{info.phone}</a></dd>
                </div>
                <div>
                  <dt className="text-sm text-haze">WhatsApp</dt>
                  <dd className="mt-0.5 text-lg"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="tabular-nums">{info.whatsappNumber.replace(/^977/, '')}</a></dd>
                </div>
                <div>
                  <dt className="text-sm text-haze">{info.openingHours && /\d/.test(info.openingHours) ? 'Opening hours' : 'Walk-ins'}</dt>
                  <dd className="mt-0.5 text-lg">{info.openingHours || contact.description || 'Welcome. Call ahead for colour, bridal and group bookings.'}</dd>
                </div>
              </dl>
              {socials.length ? (
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {socials.map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2.5 text-[0.95rem] no-underline transition hover:border-plaster">
                      {label}
                    </a>
                  ))}
                </div>
              ) : null}
              <figure className="m-0 mt-9 max-w-[300px]">
                <div className="relative aspect-[399/501] overflow-hidden rounded-lg shadow-[0_0_50px_rgba(240,169,75,0.15)]">
                  <CmsImage src={info.assets.details} alt={`${info.name} business card with address and phone number`} fill sizes="300px" className="object-cover" />
                </div>
                <figcaption className="mt-2.5 text-sm text-haze">Our card, in case you want a copy.</figcaption>
              </figure>
            </div>

            <div id="book" className="scroll-mt-20 rounded-xl border border-line bg-panel p-[clamp(22px,3.5vw,40px)]">
              <h3 className="font-display text-[2rem] font-normal leading-tight">Book a visit</h3>
              <p className="mt-2 text-[0.98rem] text-haze">
                Choose your service, stylist and time online, or send the request straight to us on WhatsApp.
              </p>
              <ul className="mt-6 grid gap-3 text-[0.95rem]">
                {['Pick one or more services', 'Choose a date and a free time slot', 'We confirm your appointment'].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 border-b border-dashed border-line pb-3 last:border-b-0">
                    <span className="font-display text-xl text-brass">{String(index + 1).padStart(2, '0')}</span>
                    {step}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                <Link href="/book-appointment" className={BTN_GLOW}>Book online</Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={BTN_LINE}>Send on WhatsApp</a>
              </div>
            </div>

            <figure className="m-0 overflow-hidden rounded-xl border border-line bg-panel md:col-span-2">
              <iframe
                src={info.mapEmbedUrl}
                title={`${info.name} location in ${place || 'Birendranagar, Surkhet'}`}
                className="block h-[clamp(320px,44vw,500px)] w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <figcaption className="flex flex-col items-start justify-between gap-4 border-t border-line px-[clamp(18px,3vw,28px)] py-[18px] sm:flex-row sm:items-center">
                <span>
                  <strong className="block font-medium">{/glam/i.test(info.name) ? info.name : `${info.name} & Glam Studio`}</strong>
                  <span className="block text-sm text-haze">{[info.address, settings.landmark].filter(Boolean).join(', ')}</span>
                </span>
                <a href={settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${info.name} ${info.address}`)}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-brass underline-offset-4">
                  Open in Google Maps
                </a>
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
