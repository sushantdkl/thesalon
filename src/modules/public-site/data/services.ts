import type { PublicService } from '../types';
import { menServices } from './men-services';

// Fallback menu shown only when the database has no website services: the printed men's
// rate card. The live rate card comes from the POS.
const CATEGORY: Record<string, PublicService['category']> = {
  hair: 'Hair',
  beard: 'Beard',
  facial: 'Beauty',
  colour: 'Hair',
  straightening: 'Treatment',
  nails: 'Beauty',
};

export const publicServices: PublicService[] = menServices.flatMap((group) =>
  group.items.map((item) => ({
    name: item.name,
    priceLabel: item.price,
    category: CATEGORY[group.slug] || 'Hair',
    description: group.name,
  }))
);

export const popularServices = publicServices.filter((service) =>
  ['Hair Cut', 'Beard', 'Keratin', 'Global Hair Color'].includes(service.name)
);
