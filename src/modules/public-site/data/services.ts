import type { PublicService } from '../types';

// Fallback menu shown only when the database has no website services. Prices depend on hair
// length and products, so these are quoted on request; the live rate card comes from the POS.
export const publicServices: PublicService[] = [
  { name: 'Haircut and styling', priceLabel: 'Ask for a quote', category: 'Hair', description: 'Classic, textured or modern crops, finished with product.' },
  { name: 'Skin fade and taper', priceLabel: 'Ask for a quote', category: 'Hair', description: 'Clean clipper work, blended to the skin.' },
  { name: 'Beard trim and shape', priceLabel: 'Ask for a quote', category: 'Beard', description: 'Line-up, shaping and hot towel finish.' },
  { name: 'Facial and head massage', priceLabel: 'Ask for a quote', category: 'Beauty', description: 'A cleanse and a reset after a long week.' },
  { name: 'Cut and blow-dry', priceLabel: 'Ask for a quote', category: 'Hair', description: 'Layers, curtain fringes, long and short shapes.' },
  { name: 'Colour and highlights', priceLabel: 'Ask for a quote', category: 'Hair', description: 'Global colour, highlights and soft balayage.' },
  { name: 'Hair spa', priceLabel: 'Ask for a quote', category: 'Treatment', description: 'Deep conditioning for dry or coloured hair.' },
  { name: 'Smoothing and keratin', priceLabel: 'Ask for a quote', category: 'Treatment', description: 'Frizz control that lasts for months.' },
  { name: 'Waxing and threading', priceLabel: 'Ask for a quote', category: 'Beauty', description: 'Quick, neat and gentle.' },
  { name: 'Party makeup', priceLabel: 'Ask for a quote', category: 'Beauty', description: 'Soft glam to full evening looks.' },
  { name: 'Bridal and engagement', priceLabel: 'Ask for a quote', category: 'Beauty', description: 'Trial, makeup and hairstyling for the big day.' },
  { name: 'Event hairstyling', priceLabel: 'Ask for a quote', category: 'Hair', description: 'Buns, waves and braids that hold all night.' },
  { name: 'Saree draping', priceLabel: 'Ask for a quote', category: 'Beauty', description: 'Neat pleats, pinned to stay.' },
];

export const popularServices = publicServices.filter((service) =>
  ['Haircut and styling', 'Colour and highlights', 'Smoothing and keratin', 'Party makeup'].includes(service.name)
);
