// The salon's own photo shoot (Nov 2026), compressed into /img/studio. The gallery page shows
// all of them; the home page and service pages pick individual shots by name.

export type StudioPhoto = { src: string; title: string; alt: string; category: 'Studio' | 'Men' | 'Women' | 'Nails & glam' };

const photo = (name: string, title: string, alt: string, category: StudioPhoto['category']): StudioPhoto => ({
  src: `/img/studio/${name}.jpg`, title, alt, category,
});

export const studio = {
  storefront: photo('storefront', 'Find us', 'The Salon & Glam Studio shopfront with its black sign, Birendranagar, Surkhet', 'Studio'),
  theSalonSign: photo('the-salon-sign', 'The Salon', 'The Salon & Glam Studio sign hanging at the entrance', 'Studio'),
  unisexSign: photo('unisex-salon-sign', 'Unisex salon', 'Unisex Salon sign above the door', 'Studio'),
  roundMirrors: photo('round-mirrors', 'Round mirrors', 'Backlit round mirrors and styling chairs under pendant lamps', 'Studio'),
  stylingChairs: photo('styling-chairs', 'Styling chairs', 'Two styling chairs in front of glowing round mirrors', 'Studio'),
  washStation: photo('wash-station', 'Wash station', 'Hair wash station beside the wooden slat wall', 'Studio'),
  studioFloor: photo('studio-floor', 'The studio floor', 'Long view of the salon floor with mirrors, shelves and cove lights', 'Studio'),
  stylingStations: photo('styling-stations', 'Styling stations', 'Styling stations with trolleys, mirrors and product shelves', 'Studio'),
  stylistsAtWork: photo('stylists-at-work', 'Busy afternoon', 'Two stylists working at the round mirrors', 'Studio'),
  mensCutMirror: photo('mens-cut-mirror', "Men's haircut", "Stylist cutting a man's hair, reflected in the round mirror", 'Men'),
  mensCutScissors: photo('mens-cut-scissors', 'Scissor cut', "Scissor cut on a man's longer hair", 'Men'),
  mensTrim: photo('mens-trim', 'Trim and line-up', 'Close trim around the ear with a trimmer', 'Men'),
  headWash: photo('head-wash', 'Head wash', 'Relaxing head wash at the basin', 'Men'),
  hairWash: photo('hair-wash', 'Hair wash', 'Stylist washing a client’s hair at the wash station', 'Men'),
  womensCutMirror: photo('womens-cut-mirror', "Women's haircut", "Stylist cutting a woman's hair at the round mirror", 'Women'),
  womensCutCloseup: photo('womens-cut-closeup', 'Layer cut', 'Close-up of scissors cutting long layers', 'Women'),
  womensCutDetail: photo('womens-cut-detail', 'Finishing the ends', 'Point cutting the ends of long hair', 'Women'),
  hairStraightening: photo('hair-straightening', 'Straightening', 'Stylist straightening a short bob with a flat iron', 'Women'),
  nailArt: photo('nail-art', 'Nail art', 'Hands with fresh nail art and a ring', 'Nails & glam'),
  nailFiling: photo('nail-filing', 'Manicure', 'Nails being shaped with a file, polishes in the background', 'Nails & glam'),
  lashExtensions: photo('lash-extensions', 'Lash extensions', 'Lash extensions being applied with tweezers', 'Nails & glam'),
};

/** Every photo, in gallery order. */
export const studioPhotos: StudioPhoto[] = [
  studio.storefront, studio.roundMirrors, studio.mensCutMirror, studio.womensCutMirror, studio.lashExtensions,
  studio.stylingChairs, studio.mensTrim, studio.womensCutCloseup, studio.nailArt, studio.studioFloor,
  studio.hairStraightening, studio.mensCutScissors, studio.nailFiling, studio.washStation, studio.womensCutDetail,
  studio.headWash, studio.stylingStations, studio.hairWash, studio.stylistsAtWork, studio.theSalonSign, studio.unisexSign,
];
