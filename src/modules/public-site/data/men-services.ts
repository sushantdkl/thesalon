// Men's rate card, as printed on the salon's price list. `book` is matched against the POS
// service names so the booking form can pre-select it (see bookingHref).

export type MenServiceItem = { name: string; price: string; book: string };

export type MenServiceCategory = { slug: string; name: string; items: MenServiceItem[] };

export const menServices: MenServiceCategory[] = [
  {
    slug: 'hair',
    name: 'Hair services',
    items: [
      { name: 'Hair Cut', price: 'Rs 300', book: 'hair cut' },
      { name: 'Hair Wash', price: 'Rs 50', book: 'hair wash' },
      { name: 'Head Massage', price: 'Rs 300 / 600', book: 'head massage' },
    ],
  },
  {
    slug: 'beard',
    name: 'Beard services',
    items: [
      { name: 'Beard', price: 'Rs 150', book: 'beard' },
      { name: 'Shaving', price: 'Rs 100', book: 'shaving' },
      { name: 'Threading', price: 'Rs 70', book: 'threading' },
    ],
  },
  {
    slug: 'facial',
    name: 'Cleansing & facial',
    items: [
      { name: 'Normal Cleansing', price: 'Rs 700', book: 'normal cleansing' },
      { name: 'Deep Cleansing', price: 'Rs 1,000', book: 'deep cleansing' },
      { name: 'Wine Facial', price: 'Rs 1,300', book: 'wine facial' },
      { name: 'Fruits Facial', price: 'Rs 1,800', book: 'fruit' },
      { name: 'Lotus Facial', price: 'Rs 2,000', book: 'lotus' },
      { name: 'Anti Aging Facial', price: 'Rs 2,500', book: 'anti aging' },
      { name: 'Dr. Rashel Facial', price: 'Rs 3,000', book: 'rashel' },
      { name: 'VLCC Facial', price: 'Rs 3,500', book: 'vlcc' },
      { name: "Nature's Facial", price: 'Rs 3,800', book: 'nature' },
    ],
  },
  {
    slug: 'colour',
    name: 'Colour',
    items: [
      { name: 'Black Color', price: 'Rs 700', book: 'black colo' },
      { name: 'Global Hair Color', price: 'Rs 1,500 & up', book: 'global' },
      { name: 'Cap Highlight', price: 'Rs 2,000 & up', book: 'cap highlight' },
      { name: 'Ash Color', price: 'Rs 3,000 & up', book: 'ash' },
    ],
  },
  {
    slug: 'straightening',
    name: 'Hair straightening & styling',
    items: [
      { name: 'Temporary Straight', price: 'Rs 500', book: 'temporary straight' },
      { name: 'Temporary Curl', price: 'Rs 500', book: 'curl' },
      { name: 'Permanent Straight', price: 'Rs 2,000 & up', book: 'permanent straight' },
      { name: 'Keratin Straight', price: 'Rs 2,500 & up', book: 'keratin straight' },
      { name: 'Keratin', price: 'Rs 3,000 & up', book: 'keratin' },
      { name: 'Permanent Hair Perming', price: 'Rs 4,000 & up', book: 'perming' },
      { name: 'Braids Styling', price: 'Rs 1,000 & up', book: 'braid' },
      { name: 'Hair Spa', price: 'Rs 1,500 & up', book: 'hair spa' },
    ],
  },
  {
    slug: 'nails',
    name: 'Nail services',
    items: [
      { name: 'Manicure', price: 'Rs 1,000 & up', book: 'manicure' },
      { name: 'Pedicure', price: 'Rs 2,000 & up', book: 'pedicure' },
    ],
  },
];
