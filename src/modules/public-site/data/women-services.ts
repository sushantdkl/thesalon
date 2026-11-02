// Women's menu: one small detail page per category, each item one tap from booking.
// `book` is matched (case-insensitive, by name) against the POS services so the booking form
// can pre-select it; when nothing matches, the item name goes into the booking note instead.

export type WomenServiceItem = { name: string; detail: string; book: string };

export type WomenServiceCategory = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  items: WomenServiceItem[];
};

export const womenServices: WomenServiceCategory[] = [
  {
    slug: 'haircut-styling',
    name: 'Haircut & styling',
    summary: 'Layers, fringes, trims and blow-dry finishes.',
    image: '/img/balayage.jpg',
    items: [
      { name: 'Trim', detail: 'Clean up split ends and keep your length.', book: 'trim' },
      { name: 'Layer cut', detail: 'Movement and volume for long or medium hair.', book: 'layer' },
      { name: 'Fringe / bangs', detail: 'Curtain, side or blunt fringe.', book: 'fringe' },
      { name: 'Blow-dry', detail: 'Smooth, bouncy finish for any length.', book: 'blow' },
      { name: 'Ironing & curls', detail: 'Straight or soft waves for an event.', book: 'curl' },
    ],
  },
  {
    slug: 'hair-colour',
    name: 'Hair colour',
    summary: 'Global colour, highlights, balayage and root touch-ups.',
    image: '/img/colours.jpg',
    items: [
      { name: 'Root touch-up', detail: 'Cover grey or regrowth at the roots.', book: 'root' },
      { name: 'Global colour', detail: 'One even shade from root to tip.', book: 'global' },
      { name: 'Highlights', detail: 'Lighter strands for brightness and depth.', book: 'highlight' },
      { name: 'Balayage', detail: 'Soft, hand-painted, grown-out look.', book: 'balayage' },
      { name: 'Fashion colour', detail: 'Burgundy, ash, copper and bold streaks.', book: 'colour' },
    ],
  },
  {
    slug: 'keratin-smoothing',
    name: 'Keratin & smoothing',
    summary: 'Frizz-free, shiny hair that lasts for months.',
    image: '/img/dryer.jpg',
    items: [
      { name: 'Keratin treatment', detail: 'Softer, frizz-free hair, natural movement.', book: 'keratin' },
      { name: 'Smoothing', detail: 'Straighter, sleeker hair with less daily styling.', book: 'smooth' },
      { name: 'Rebonding', detail: 'Pin-straight hair for longer.', book: 'rebond' },
      { name: 'Hair botox', detail: 'Repair and shine for damaged hair.', book: 'botox' },
    ],
  },
  {
    slug: 'hair-spa',
    name: 'Hair spa & treatment',
    summary: 'Deep care for dry, coloured or falling hair.',
    image: '/img/porthole.jpg',
    items: [
      { name: 'Hair spa', detail: 'Deep conditioning with a relaxing massage.', book: 'spa' },
      { name: 'Hair fall treatment', detail: 'Scalp care to strengthen the roots.', book: 'hair fall' },
      { name: 'Dandruff treatment', detail: 'Cleanses and calms a flaky scalp.', book: 'dandruff' },
      { name: 'Head massage', detail: 'Oil massage to relax and nourish.', book: 'massage' },
    ],
  },
  {
    slug: 'nails',
    name: 'Nails',
    summary: 'Manicure, pedicure, gel polish and nail art.',
    image: '/img/trolley.jpg',
    items: [
      { name: 'Manicure', detail: 'Shape, cuticle care and polish.', book: 'manicure' },
      { name: 'Pedicure', detail: 'Soak, scrub, nail care and polish.', book: 'pedicure' },
      { name: 'Gel polish', detail: 'Glossy colour that lasts 2–3 weeks.', book: 'gel' },
      { name: 'Nail extensions', detail: 'Longer nails in the shape you like.', book: 'extension' },
      { name: 'Nail art', detail: 'French tips, chrome, glitter and designs.', book: 'nail art' },
    ],
  },
  {
    slug: 'facial-skin',
    name: 'Facial & skin',
    summary: 'Clean-ups, facials, bleach and de-tan.',
    image: '/img/lamps.jpg',
    items: [
      { name: 'Clean-up', detail: 'Quick cleanse, scrub and mask.', book: 'clean' },
      { name: 'Facial', detail: 'Full facial with massage, for a fresh glow.', book: 'facial' },
      { name: 'Bleach', detail: 'Lightens facial hair for an even tone.', book: 'bleach' },
      { name: 'De-tan', detail: 'Removes sun tan from face and neck.', book: 'tan' },
    ],
  },
  {
    slug: 'waxing-threading',
    name: 'Waxing & threading',
    summary: 'Eyebrows, upper lip, arms, legs and full body.',
    image: '/img/scissors.jpg',
    items: [
      { name: 'Eyebrow threading', detail: 'Neat, shaped brows in minutes.', book: 'eyebrow' },
      { name: 'Upper lip / face', detail: 'Threading or wax for the face.', book: 'lip' },
      { name: 'Arms waxing', detail: 'Half or full arms, underarms.', book: 'arm' },
      { name: 'Legs waxing', detail: 'Half or full legs.', book: 'leg' },
      { name: 'Full body waxing', detail: 'Arms, legs, underarms and more.', book: 'full body' },
    ],
  },
  {
    slug: 'makeup-bridal',
    name: 'Makeup & bridal',
    summary: 'Party glam, engagement, bridal and saree draping.',
    image: '/img/card.jpg',
    items: [
      { name: 'Party makeup', detail: 'Soft glam to full evening looks.', book: 'party' },
      { name: 'Engagement makeup', detail: 'Makeup and hairstyling for the day.', book: 'engagement' },
      { name: 'Bridal makeup', detail: 'Trial, makeup and hair for the big day.', book: 'bridal' },
      { name: 'Event hairstyling', detail: 'Buns, waves and braids that hold all night.', book: 'hairstyl' },
      { name: 'Saree draping', detail: 'Neat pleats, pinned to stay.', book: 'saree' },
    ],
  },
];

/** Link that opens the booking form with this service already chosen. */
export function bookingHref(service: string, label?: string) {
  const params = new URLSearchParams({ service });
  if (label) params.set('label', label);
  return `/book-appointment?${params}`;
}
