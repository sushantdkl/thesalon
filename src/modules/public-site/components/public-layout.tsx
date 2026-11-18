"use client";

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarCheck, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { salonInfo } from '../data/salon-info';
import { createWhatsAppLink } from '../utils/whatsapp';

const baseNavLinks = [
  ['Home', '/'],
  ["Men's services", '/men'],
  ["Women's services", '/women'],
  ['All services', '/services'],
  ['Packages', '/packages'],
  ['Contact', '/contact'],
];

type PublicLayoutInfo = Omit<typeof salonInfo, 'social'> & {
  social: { instagram?: string; facebook?: string; tiktok?: string };
};
type FooterService = { slug: string; name: string };

/** Small monochrome brand marks for the contact strip (lucide has no TikTok icon). */
function SocialIcon({ name }: { name: string }) {
  const common = { className: 'h-3.5 w-3.5', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const;
  if (name === 'Facebook') {
    return <svg {...common}><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" /></svg>;
  }
  if (name === 'Instagram') {
    return <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  return <svg {...common}><path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.6-.3-3.9-1.1v5.8c0 7.4-8 9.7-11.3 4.4-2.1-3.4-.8-9.4 6-9.6v3.3c-.5.1-1.1.2-1.6.4-1.5.5-2.3 1.4-2.1 3 .5 3.1 6.2 4 5.7-2V3h3.3Z" /></svg>;
}

/** The Salon & Glam Studio logo (white razor wordmark), sized by the surrounding font size. */
export function Wordmark({ className = '', subline }: { className?: string; subline?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo-wordmark.png" alt="The Salon & Glam Studio" width={1344} height={798} className="h-[2.6em] w-auto" />
      {subline ? <small className="mt-2 font-jost text-[0.5em] font-normal tracking-[0.06em] text-haze">{subline}</small> : null}
    </span>
  );
}

export function PublicLayout({
  children,
  info = salonInfo,
  servicePages = [],
  showGuides = false,
  showReviews = false,
  showTeam = true,
  showPackages = true,
  directionsUrl = '',
}: {
  children: ReactNode;
  info?: PublicLayoutInfo;
  isHome?: boolean;
  servicePages?: FooterService[];
  showGuides?: boolean;
  showReviews?: boolean;
  showTeam?: boolean;
  showPackages?: boolean;
  directionsUrl?: string;
}) {
  const whatsappUrl = createWhatsAppLink(`Hello ${info.name}, I'd like to book a visit.`, info.whatsappNumber);
  const telUrl = `tel:${String(info.phone || '').replace(/[^\d+]/g, '')}`;
  const navLinks = baseNavLinks
    .filter(([, href]) => (href !== '/staff' || showTeam) && (href !== '/packages' || showPackages))
    .flatMap((link) => (showGuides && link[1] === '/contact' ? [['Guides', '/guides'], link] : [link]));
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);
  const socials = [
    ['Instagram', info.social.instagram],
    ['Facebook', info.social.facebook],
    ['TikTok', info.social.tiktok],
  ].filter(([, href]) => href) as Array<[string, string]>;

  const mapsUrl = directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${info.name} ${info.address}`)}`;
  const place = [info.address, info.landmark].filter(Boolean).join(', ');

  return (
    <div className="salon-site min-h-screen bg-night font-jost [-webkit-tap-highlight-color:transparent] [text-size-adjust:100%] text-[1.0625rem] leading-relaxed text-plaster antialiased [color-scheme:dark]">
      {/* Contact strip above the navbar: location, email, phone and social links. */}
      <div className="border-b border-line bg-black text-[0.8rem] text-haze">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-10">
          <ul className="flex min-w-0 items-center gap-x-5 gap-y-1">
            <li className="hidden min-w-0 md:block">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-1.5 hover:text-plaster">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{place}</span>
              </a>
            </li>
            {info.email ? (
              <li className="hidden sm:block">
                <a href={`mailto:${info.email}`} className="inline-flex items-center gap-1.5 hover:text-plaster">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {info.email}
                </a>
              </li>
            ) : null}
            <li>
              <a href={telUrl} className="inline-flex items-center gap-1.5 tabular-nums hover:text-plaster">
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {info.phone}
              </a>
            </li>
          </ul>
          {socials.length ? (
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.12em] lg:inline">Follow us</span>
              {socials.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${info.name} on ${label}`} className="grid h-7 w-7 place-items-center rounded-full hover:text-plaster">
                  <SocialIcon name={label} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-night/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Link href="/" aria-label={`${info.name}, home`} className="text-lg text-plaster no-underline">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={`text-[0.95rem] transition-colors hover:text-plaster ${pathname === href ? 'text-plaster' : 'text-haze'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/book-appointment"
              className="hidden min-h-11 items-center rounded-full bg-glow px-[18px] text-[0.92rem] font-medium text-cinder transition hover:brightness-110 active:translate-y-px sm:inline-flex"
            >
              Book a visit
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-plaster/30 text-plaster transition hover:border-plaster lg:hidden"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              <span className="relative h-5 w-5" aria-hidden="true">
                <Menu className={`absolute inset-0 h-5 w-5 transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
                <X className={`absolute inset-0 h-5 w-5 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-nav-panel"
          className={`lg:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            aria-label="Close navigation overlay"
            tabIndex={mobileOpen ? 0 : -1}
            className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMobileMenu}
          />
          <div
            className={`absolute left-0 right-0 top-full z-40 border-y border-line bg-panel px-4 py-4 shadow-2xl transition-all duration-300 ${
              mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            <div className="mx-auto grid max-w-[1180px] gap-1">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={closeMobileMenu}
                  className={`flex min-h-12 items-center justify-between border-b border-line px-1 text-base ${pathname === href ? 'text-plaster' : 'text-haze'}`}
                >
                  {label}
                  <span className="text-brass" aria-hidden="true">/</span>
                </Link>
              ))}
              <Link
                href="/book-appointment"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={closeMobileMenu}
                className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-glow text-base font-medium text-cinder"
              >
                Book a visit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {children}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${info.name} on WhatsApp`}
        className={`fixed bottom-4 right-4 z-50 hidden min-h-12 items-center gap-2 rounded-full bg-whatsapp px-5 font-bold text-[#071e10] shadow-[0_10px_32px_rgba(0,0,0,0.34)] transition hover:brightness-105 md:inline-flex ${
          mobileOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Chat on WhatsApp
      </a>

      {/* Mobile contact bar: the four things a local visitor wants, one tap each. */}
      <nav
        aria-label="Quick contact"
        className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-line bg-night/95 pb-[env(safe-area-inset-bottom)] text-plaster shadow-[0_-8px_28px_rgba(0,0,0,0.5)] backdrop-blur md:hidden ${
          mobileOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        {[
          { href: telUrl, label: 'Call', Icon: Phone, external: false },
          { href: whatsappUrl, label: 'WhatsApp', Icon: MessageCircle, external: true },
          { href: '/book-appointment', label: 'Book', Icon: CalendarCheck, external: false },
          { href: directionsUrl || '/contact', label: 'Directions', Icon: MapPin, external: Boolean(directionsUrl) },
        ].map(({ href, label, Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide active:bg-panel"
          >
            <Icon className={`h-5 w-5 ${label === 'WhatsApp' ? 'text-whatsapp' : 'text-glow'}`} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <footer className="border-t border-line pb-20 text-haze md:pb-0">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <div>
            <Link href="/" aria-label={`${info.name}, home`} className="text-[1.3rem] text-plaster">
              <Wordmark subline="For men and women" />
            </Link>
            <p className="mt-4 text-sm leading-6">{info.tagline}</p>
          </div>
          <div>
            <h2 className="text-sm text-plaster">Explore</h2>
            <div className="mt-3 grid gap-2 text-sm">
              {navLinks.map(([label, href]) => <Link key={href} href={href} className="hover:text-plaster">{label}</Link>)}
              {showReviews ? <Link href="/reviews" className="hover:text-plaster">Reviews</Link> : null}
              <Link href="/book-appointment" className="hover:text-plaster">Book a visit</Link>
            </div>
          </div>
          {servicePages.length ? (
            <div>
              <h2 className="text-sm text-plaster">Services</h2>
              <div className="mt-3 grid gap-2 text-sm">
                {servicePages.slice(0, 6).map((page) => <Link key={page.slug} href={`/services/${page.slug}`} className="hover:text-plaster">{page.name}</Link>)}
              </div>
            </div>
          ) : null}
          <div>
            <h2 className="text-sm text-plaster">Visit</h2>
            <address className="mt-3 text-sm not-italic">
              {info.address}
              {info.landmark ? <><br />{info.landmark}</> : null}
            </address>
            <p className="mt-2 text-sm">
              <a href={telUrl} className="tabular-nums hover:text-plaster">{info.phone}</a>
            </p>
            {info.openingHours ? <p className="mt-2 text-sm">{info.openingHours}</p> : null}
            {socials.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-2 text-sm text-plaster transition hover:border-plaster">
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="border-t border-line px-4 py-5 text-center text-xs">{info.copyright}</div>
      </footer>
    </div>
  );
}
