'use client';

import { type ComponentProps, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { CalendarCheck2, Check, Loader2, MessageCircle } from 'lucide-react';
import { PublicLayout } from '@/modules/public-site/components/public-layout';
import { createBookingMessage, createWhatsAppLink } from '@/modules/public-site/utils/whatsapp';
import { isValidPhone, sanitizePhoneInput } from '@/lib/validation/phone';
import type { PublicPackage, PublicService, PublicStaffMember } from '../types';
import { salonInfo } from '../data/salon-info';

type BookingInfo = typeof salonInfo;

type Side = 'men' | 'women';
type BookableService = { id: number; name: string; category: string; gender?: 'men' | 'women' | 'unisex'; price: number; duration: number };
type Options = {
  enabled: boolean;
  instantConfirm?: boolean;
  maxDaysAhead?: number;
  services?: BookableService[];
};

const SIDES: Array<[Side, string, string]> = [
  ['men', "Men's services", 'Hair, beard, facial and colour'],
  ['women', "Women's services", 'Hair, skin, nails, lashes and makeup'],
];

/** Men's side shows men + unisex services; women's side shows women + unisex. */
function onSide(service: { gender?: string }, side: Side) {
  const own = service.gender || 'unisex';
  return own === 'unisex' || own === side;
}
type Confirmation = { number: string; status: string; date: string; startTime: string; endTime: string; services: string[]; staffName: string | null };

const WHATSAPP_ERROR = 'Enter a valid WhatsApp number, e.g. 98XXXXXXXX.';
const INPUT = 'w-full rounded-lg border border-line bg-night px-4 py-3 text-plaster outline-none placeholder:text-plaster/40 focus:border-transparent focus:ring-2 focus:ring-glow';

function nepalToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu' }).format(new Date());
}
function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}
function newKey() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

/**
 * Public booking: men's or women's services first, then services, a day, name and WhatsApp
 * number. The request lands as a PENDING appointment and the salon agrees the exact time with
 * the customer on WhatsApp. WhatsApp is the only path if online booking is switched off.
 */
export function BookingForm({
  info,
  services,
  packages,
  staff,
  layout = {},
}: {
  info: BookingInfo;
  services: PublicService[];
  packages: PublicPackage[];
  staff: PublicStaffMember[];
  /** Footer/nav extras for the shared public layout (service links, directions). */
  layout?: Omit<ComponentProps<typeof PublicLayout>, 'children' | 'info'>;
}) {
  const [options, setOptions] = useState<Options | null>(null);
  const [side, setSide] = useState<Side | ''>('');
  const [serviceIds, setServiceIds] = useState<number[]>([]);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const idempotencyKey = useRef(newKey());

  useEffect(() => {
    fetch('/api/public/booking', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { enabled: false }))
      .then(setOptions)
      .catch(() => setOptions({ enabled: false }));
  }, []);

  const online = Boolean(options?.enabled && options.services?.length);
  const allServices = options?.services || [];
  const bookable = side ? allServices.filter((service) => onSide(service, side)) : [];
  const selected = allServices.filter((service) => serviceIds.includes(service.id));
  const duration = selected.reduce((sum, service) => sum + service.duration, 0);
  const total = selected.reduce((sum, service) => sum + service.price, 0);
  const today = nepalToday();
  const lastDay = addDays(today, options?.maxDaysAhead || 30);

  // Links like /book-appointment?gender=women&service=facial&label=Facial arrive with the side
  // and the service already chosen, so a visitor goes from one tap straight to picking a day.
  const [requested, setRequested] = useState('');
  useEffect(() => {
    if (!options) return;
    const params = new URLSearchParams(window.location.search);
    const wantedSide = params.get('gender');
    const presetSide: Side | '' = wantedSide === 'men' || wantedSide === 'women' ? wantedSide : '';
    if (presetSide) setSide(presetSide);
    const keyword = (params.get('service') || '').trim().toLowerCase();
    if (!keyword) return;
    const label = (params.get('label') || '').trim() || keyword;
    setRequested(label);
    // Closest name wins: "keratin" picks "Keratin" over "Keratin Straight".
    const match = (options.services || [])
      .filter((service) => (!presetSide || onSide(service, presetSide)) && service.name.toLowerCase().includes(keyword))
      .sort((a, b) => Number(b.name.toLowerCase() === keyword) - Number(a.name.toLowerCase() === keyword)
        || Number(b.name.toLowerCase().startsWith(keyword)) - Number(a.name.toLowerCase().startsWith(keyword))
        || a.name.length - b.name.length)[0];
    if (match) {
      setServiceIds([match.id]);
      if (!presetSide && match.gender && match.gender !== 'unisex') setSide(match.gender);
    } else setNotes((current) => current || `Interested in: ${label}`);
  }, [options]);

  const chooseSide = (next: Side) => {
    setSide(next);
    // Services picked on the other side do not carry over.
    setServiceIds((current) => current.filter((id) => {
      const service = allServices.find((item) => item.id === id);
      return service ? onSide(service, next) : false;
    }));
    setError('');
  };

  const toggleService = (id: number) => {
    setServiceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(0, 5)));
    setError('');
  };

  const whatsappFallback = () => {
    const serviceNames = selected.length ? selected.map((service) => service.name).join(', ') : '';
    const sideLabel = side ? SIDES.find(([value]) => value === side)?.[1] : '';
    const message = createBookingMessage({ name, phone, side: sideLabel, service: serviceNames || 'Not chosen yet', date, message: notes, salonName: info.name });
    window.open(createWhatsAppLink(message, info.whatsappNumber), '_blank', 'noopener,noreferrer');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!side) return setError("Choose men's or women's services first.");
    if (!serviceIds.length) return setError('Choose at least one service.');
    if (!date) return setError('Choose a date.');
    if (!name.trim()) return setError('Please enter your name.');
    if (!isValidPhone(phone)) return setError(WHATSAPP_ERROR);
    setSubmitting(true);
    try {
      const response = await fetch('/api/public/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name, customerPhone: phone, date, serviceIds,
          notes, website: honeypot, idempotencyKey: idempotencyKey.current,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || 'Your booking could not be sent. Please try again or use WhatsApp.');
        return;
      }
      setConfirmation(payload.booking);
    } catch {
      setError('Connection problem. Please try again, or send your request on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappOnly = options !== null && !online;
  const legacyServices = useMemo(() => [
    ...services.map((service) => ({ name: service.name, gender: (service as PublicService & { gender?: string }).gender })),
    ...packages.map((item) => ({ name: item.name })),
  ], [services, packages]);

  return (
    <PublicLayout info={info} {...layout}>
      <main className="relative min-h-screen bg-panel">
        <div className="absolute inset-0 h-full w-full">
          <Image src={info.assets.booking} alt={`Booking an appointment at ${info.name}`} fill sizes="100vw" className="object-cover opacity-50" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-night/40 via-night/75 to-night/95" />
        </div>

        <div className="relative z-10 px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="lg:pt-6">
              <span className="text-[0.95rem] tracking-[0.04em] text-brass">{whatsappOnly ? 'WhatsApp booking' : 'Online booking'}</span>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.15] tracking-tight text-plaster md:text-5xl">
                {requested ? <>Book <span className="text-brass">{requested}</span></> : 'Book an appointment'}
              </h1>
              <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-plaster/75 md:text-base">
                {whatsappOnly
                  ? 'Fill in your details and we will open WhatsApp with your booking request ready to send.'
                  : "Choose men's or women's services, pick a day and leave your WhatsApp number. We will message you to agree the time."}
              </p>
            </div>

            {confirmation ? (
              <section className="border border-plaster/15 bg-panel-soft/85 p-6 text-plaster backdrop-blur-sm md:p-8" aria-live="polite">
                <CalendarCheck2 className="h-10 w-10 text-brass" aria-hidden="true" />
                <h2 className="mt-4 font-display text-3xl font-light">Request received</h2>
                <p className="mt-2 text-sm text-plaster/75">
                  We will message you on WhatsApp shortly to agree the time and confirm your visit.
                </p>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-plaster/50">Booking number</dt><dd className="text-lg font-semibold text-brass">{confirmation.number}</dd></div>
                  <div><dt className="text-plaster/50">Day</dt><dd>{prettyDate(confirmation.date)}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-plaster/50">Services</dt><dd>{confirmation.services.join(', ')}</dd></div>
                </dl>
                <button type="button" onClick={whatsappFallback} className="mt-8 inline-flex items-center gap-2 min-h-11 rounded-full border border-plaster/25 px-5 py-3 text-[0.95rem] font-medium text-plaster hover:bg-plaster/10">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> Message the salon on WhatsApp
                </button>
              </section>
            ) : options === null ? (
              <div className="flex items-center justify-center border border-plaster/15 bg-panel-soft/85 p-10 text-plaster/70"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</div>
            ) : whatsappOnly ? (
              <LegacyWhatsAppForm key={requested} info={info} serviceOptions={legacyServices} requested={requested} />
            ) : (
              <form onSubmit={submit} className="border border-plaster/15 bg-panel-soft/85 p-5 backdrop-blur-sm md:p-8" noValidate>
                <fieldset>
                  <legend className="mb-2 block text-sm font-semibold text-plaster/90">1. Who is it for? *</legend>
                  <div role="radiogroup" aria-label="Men's or women's services" className="grid gap-2 sm:grid-cols-2">
                    {SIDES.map(([value, label, hint]) => {
                      const on = side === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => chooseSide(value)}
                          className={`flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${on ? 'border-glow bg-glow text-cinder' : 'border-plaster/20 bg-plaster/5 text-plaster hover:border-plaster/40'}`}
                        >
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? 'border-cinder bg-cinder text-glow' : 'border-plaster/40'}`} aria-hidden="true">
                            {on ? <Check className="h-3 w-3" /> : null}
                          </span>
                          <span>
                            <span className="block font-semibold">{label}</span>
                            <span className={`block text-xs ${on ? 'text-cinder/70' : 'text-plaster/50'}`}>{hint}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend className="mb-2 block text-sm font-semibold text-plaster/90">2. Services *</legend>
                  {!side ? (
                    <p className="text-sm text-plaster/50">Choose men&apos;s or women&apos;s services to see the list.</p>
                  ) : (
                    <>
                      {bookable.length > 8 ? <p className="mb-2 text-xs text-plaster/50">{bookable.length} services — scroll the list for more.</p> : null}
                      <div className="flex max-h-80 flex-wrap gap-2 overflow-y-auto border-b border-plaster/10 pb-2">
                        {bookable.map((service) => {
                          const on = serviceIds.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggleService(service.id)}
                              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${on ? 'border-glow bg-glow text-cinder' : 'border-plaster/20 bg-plaster/5 text-plaster hover:border-plaster/40'}`}
                            >
                              <span className="block font-semibold">{service.name}</span>
                              <span className={`block text-xs ${on ? 'text-cinder/70' : 'text-plaster/50'}`}>{service.duration} min · Rs {service.price.toLocaleString('en-IN')}</span>
                            </button>
                          );
                        })}
                      </div>
                      {selected.length ? <p className="mt-2 text-xs text-plaster/60">{duration} min · from Rs {total.toLocaleString('en-IN')} (final price at the salon)</p> : null}
                    </>
                  )}
                </fieldset>

                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-semibold text-plaster/90">3. Date *</span>
                  <input type="date" min={today} max={lastDay} value={date} onChange={(event) => setDate(event.target.value)} className={`${INPUT} [color-scheme:dark]`} />
                  <span className="mt-1.5 block text-xs text-plaster/50">We will message you on WhatsApp to agree the time.</span>
                </label>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-plaster/90">Full name *</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={INPUT} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-plaster/90">WhatsApp number *</span>
                    <input value={phone} onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))} inputMode="tel" autoComplete="tel" placeholder="98XXXXXXXX" className={INPUT} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-plaster/90">Message</span>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={500} className={INPUT} />
                  </label>
                  {/* Honeypot: hidden from people, filled by bots. */}
                  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} className="hidden" name="website" />
                </div>

                {error ? <div role="alert" className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</div> : null}

                <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-all duration-300 hover:bg-glow-hi disabled:opacity-60">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck2 className="h-4 w-4" />}
                  {submitting ? 'Sending…' : 'Request appointment'}
                </button>
                <button type="button" onClick={whatsappFallback} className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-plaster/20 min-h-11 rounded-full px-6 py-3 text-[0.95rem] font-medium text-plaster/80 hover:bg-plaster/5">
                  <MessageCircle className="h-4 w-4" /> Prefer WhatsApp?
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}

/** The WhatsApp-only request, used when online booking is switched off. */
function LegacyWhatsAppForm({ info, serviceOptions, requested = '' }: { info: BookingInfo; serviceOptions: Array<{ name: string; gender?: string }>; requested?: string }) {
  const [form, setForm] = useState(() => {
    const wanted = requested.toLowerCase();
    const service = (wanted && serviceOptions.find((option) => option.name.toLowerCase().includes(wanted))?.name) || '';
    return { side: '', name: '', phone: '', service, date: '', message: requested && !service ? `Interested in: ${requested}` : '' };
  });
  const [error, setError] = useState('');
  const update = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setError(''); };
  const choices = serviceOptions.filter((option) => !form.side || onSide(option, form.side as Side));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.side || !form.name.trim() || !form.phone.trim() || !form.service || !form.date) {
      setError("Please choose men's or women's services and fill name, WhatsApp number, service and date.");
      return;
    }
    if (!isValidPhone(form.phone)) { setError(WHATSAPP_ERROR); return; }
    const side = SIDES.find(([value]) => value === form.side)?.[1];
    window.open(createWhatsAppLink(createBookingMessage({ ...form, side, salonName: info.name }), info.whatsappNumber), '_blank', 'noopener,noreferrer');
  };
  return (
    <form onSubmit={submit} className="border border-plaster/15 bg-panel-soft/85 p-6 backdrop-blur-sm md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="md:col-span-2">
          <legend className="mb-2 block text-sm font-semibold text-plaster/90">Who is it for? *</legend>
          <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
            {SIDES.map(([value, label]) => (
              <button key={value} type="button" role="radio" aria-checked={form.side === value} onClick={() => update('side', value)}
                className={`min-h-12 rounded-xl border px-4 text-left font-semibold transition-colors ${form.side === value ? 'border-glow bg-glow text-cinder' : 'border-plaster/20 bg-plaster/5 text-plaster hover:border-plaster/40'}`}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-plaster/90">Full Name *</span><input value={form.name} onChange={(event) => update('name', event.target.value)} className={INPUT} /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-plaster/90">WhatsApp number *</span><input value={form.phone} onChange={(event) => update('phone', sanitizePhoneInput(event.target.value))} inputMode="tel" placeholder="98XXXXXXXX" className={INPUT} /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-plaster/90">Service *</span>
          <select value={form.service} onChange={(event) => update('service', event.target.value)} className={INPUT}>
            <option value="" className="bg-panel-soft">Select service or package</option>
            {choices.map((service) => <option key={`${service.name}-${service.gender || ''}`} value={service.name} className="bg-panel-soft">{service.name}</option>)}
          </select>
        </label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-plaster/90">Preferred date *</span><input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} className={`${INPUT} [color-scheme:dark]`} /></label>
        <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold text-plaster/90">Message</span><textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={4} className={INPUT} /></label>
      </div>
      {error ? <div className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</div> : null}
      <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-all duration-300 hover:bg-glow-hi">
        <MessageCircle className="h-4 w-4" /> Send WhatsApp Booking Request
      </button>
    </form>
  );
}
