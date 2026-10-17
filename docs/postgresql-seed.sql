-- Seed data for Salon POS (PostgreSQL)
-- Run once on a fresh database after applying postgresql-schema.sql.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Service categories
INSERT INTO salon_service_categories (name, display_order)
VALUES
  ('Haircut', 1),
  ('Hair Color', 2),
  ('Facial', 3),
  ('Beard', 4),
  ('Treatment', 5),
  ('Makeup', 6),
  ('Spa', 7),
  ('Other', 8)
ON CONFLICT (name) DO NOTHING;

-- Launch services and packages
INSERT INTO salon_services (name, category, price, duration_minutes, description, is_package, package_items, is_active)
VALUES
  ('Hair Cut', 'Haircut', 150, 30, 'Client rate card service', FALSE, NULL, TRUE),
  ('Haircut + Wash', 'Haircut', 200, 30, 'Haircut with hair wash.', FALSE, NULL, TRUE),
  ('Hair Wash', 'Treatment', 50, 15, 'Client rate card service', FALSE, NULL, TRUE),
  ('Shaving', 'Beard', 100, 20, 'Client rate card service', FALSE, NULL, TRUE),
  ('Head Massage', 'Spa', 200, 20, 'Client rate card service', FALSE, NULL, TRUE),
  ('Threading', 'Facial', 50, 15, 'Client rate card service', FALSE, NULL, TRUE),
  ('Normal Cleansing', 'Facial', 500, 35, 'Client rate card service', FALSE, NULL, TRUE),
  ('Deep Cleansing', 'Facial', 800, 45, 'Client rate card service', FALSE, NULL, TRUE),
  ('Wine Facial', 'Facial', 1200, 60, 'Client rate card service', FALSE, NULL, TRUE),
  ('Fruit Facial', 'Facial', 1500, 60, 'Client rate card service', FALSE, NULL, TRUE),
  ('Lotus Facial', 'Facial', 1800, 60, 'Client rate card service', FALSE, NULL, TRUE),
  ('Hair Colouring', 'Hair Color', 500, 75, 'Starting from NPR 500+', FALSE, NULL, TRUE),
  ('Cap Highlight', 'Hair Color', 1000, 90, 'Starting from NPR 1000+', FALSE, NULL, TRUE),
  ('Hair Straight', 'Treatment', 1200, 90, 'Starting from NPR 1200+', FALSE, NULL, TRUE),
  ('Keratin', 'Treatment', 1500, 120, 'Starting from NPR 1500+', FALSE, NULL, TRUE),
  ('Piece Highlight', 'Hair Color', 200, 20, 'NPR 200 per piece', FALSE, NULL, TRUE),
  ('Silver Package', 'Other', 650, 80, 'Includes Hair Cut, Hair Wash, Shaving, Normal Cleansing', TRUE, 'Hair Cut,Hair Wash,Shaving,Normal Cleansing', TRUE),
  ('Gold Package', 'Other', 850, 90, 'Includes Hair Cut, Hair Wash, Shaving, Deep Cleansing', TRUE, 'Hair Cut,Hair Wash,Shaving,Deep Cleansing', TRUE),
  ('Platinum Package', 'Other', 1450, 120, 'Includes Hair Cut, Hair Wash, Shaving, Head Massage, Facial', TRUE, 'Hair Cut,Hair Wash,Shaving,Head Massage,Facial', TRUE);

-- Inventory products
INSERT INTO salon_products (name, category, purchase_price, selling_price, current_stock, low_stock_threshold, supplier, status)
VALUES
  ('Keratin Shampoo', 'Shampoo', 450, 750, 18, 5, 'Salon Supplier', 'active'),
  ('Hair Color Tube', 'Hair Color', 300, 550, 24, 8, 'Color Pro', 'active'),
  ('Facial Kit', 'Facial Kit', 900, 1400, 8, 3, 'Beauty Care', 'active'),
  ('Hair Wax', 'Styling', 220, 400, 15, 5, 'Style Hub', 'active');

-- Demo staff/users with PINs (bcrypt via pgcrypto)
WITH staff_seed (username, full_name, role, salon_role, pin, email, assigned_services, commission_percentage, base_salary) AS (
  VALUES
    ('admin', 'Admin', 'admin', 'admin', '1111', 'admin@thesalon.local', '', 0, 0),
    ('kanchan', 'Kanchan', 'beautician', 'beautician', '2222', 'kanchan@thesalon.local', 'Normal Cleansing,Deep Cleansing,Wine Facial,Fruit Facial,Lotus Facial,Threading', 10, 0),
    ('raashid', 'Raashid', 'barber', 'barber', '3333', 'raashid@thesalon.local', 'Hair Cut,Hair Wash,Shaving,Head Massage,Threading', 10, 0),
    ('salman', 'Salman', 'barber', 'barber', '4444', 'salman@thesalon.local', 'Hair Cut,Hair Wash,Shaving,Head Massage,Threading', 10, 0),
    ('saajid', 'Saajid', 'barber', 'barber', '5555', 'saajid@thesalon.local', 'Hair Cut,Hair Wash,Shaving,Head Massage,Threading', 10, 0)
),
upsert_users AS (
  INSERT INTO users (username, full_name, role, password_hash, email, phone, is_active)
  SELECT
    username,
    full_name,
    role,
    crypt(pin, gen_salt('bf')),
    email,
    '',
    TRUE
  FROM staff_seed
  ON CONFLICT (username) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash,
    email = EXCLUDED.email,
    is_active = TRUE,
    updated_at = NOW()
  RETURNING id, username
)
-- Launch logins are kept off the public website until the owner chooses who to show.
INSERT INTO staff_profiles (user_id, display_name, salon_role, assigned_services, commission_percentage, base_salary, show_on_website)
SELECT
  u.id,
  s.full_name,
  s.salon_role,
  s.assigned_services,
  s.commission_percentage,
  s.base_salary,
  FALSE
FROM upsert_users u
JOIN staff_seed s USING (username)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  salon_role = EXCLUDED.salon_role,
  assigned_services = EXCLUDED.assigned_services,
  commission_percentage = EXCLUDED.commission_percentage,
  base_salary = EXCLUDED.base_salary,
  updated_at = NOW();

-- Website CMS content
INSERT INTO website_content (
  section_key, title, subtitle, description, image_url, button_text,
  button_link, secondary_button_text, secondary_button_link, is_visible,
  sort_order, metadata
) VALUES
  (
    'hero',
    'The Salon',
    'For men and women in Birendranagar, Surkhet',
    'Sharp fades, soft layers, rich colour and party-ready makeup, done under warm light in Surkhet''s most relaxed chair.',
    '/img/balayage.jpg',
    'Book a visit',
    '/book-appointment',
    'WhatsApp',
    'whatsapp',
    TRUE,
    1,
    '{"eyebrow": "For men and women"}'
  ),
  (
    'about',
    'Colour, matched to you',
    'Colour',
    'We start every colour with the shade chart in your hand, under daylight-white lamps. Pick a level, we check it against your base and skin tone, and then we mix.',
    '/img/colours.jpg',
    '',
    '',
    '',
    '',
    TRUE,
    2,
    '{"highlights": ["Shade chart in your hand", "Daylight-white lamps", "Mixed for your skin tone"], "galleryImages": ["/img/colours.jpg", "/img/card.jpg"]}'
  ),
  (
    'services',
    'Services',
    'Services',
    'One studio, two sides of the floor. Tell us what you want when you book and we will plan the time you need.',
    '/img/clipper.jpg',
    '',
    '',
    '',
    '',
    TRUE,
    3,
    '{}'
  ),
  (
    'packages',
    'Packages',
    'Packages',
    'Several services in one visit, priced together.',
    '',
    '',
    '',
    '',
    '',
    TRUE,
    4,
    '{}'
  ),
  (
    'staff',
    'Meet the team',
    'Team',
    'The stylists, barbers and makeup artists at The Salon & Glam Studio.',
    '',
    '',
    '',
    '',
    '',
    TRUE,
    5,
    '{}'
  ),
  (
    'contact',
    'Visit us',
    'Visit us',
    'Walk-ins welcome. Call ahead for colour, bridal and group bookings.',
    '',
    'Contact details',
    '/contact',
    'Book now',
    '/book-appointment',
    TRUE,
    6,
    '{"salonName": "The Salon", "phone": "083-590152", "whatsappNumber": "9779802055983", "address": "Birendranagar-8, Surkhet", "email": "", "instagram": "https://www.instagram.com/thesalonsurkhet/", "facebook": "https://www.facebook.com/thesalonsurkhet/", "tiktok": "https://www.tiktok.com/discover/the-salon-of-surkhet", "openingHours": "Walk-ins welcome. Call ahead for colour, bridal and group bookings.", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d551112.1895187694!2d82.07465767554316!3d28.284865625145144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a2855970079cad%3A0x3e0035539dcfb198!2sThe%20Salon!5e0!3m2!1sen!2snp!4v1791864961818!5m2!1sen!2snp"}'
  ),
  (
    'seo',
    'The Salon & Glam Studio | Salon in Birendranagar, Surkhet',
    '',
    'The Salon & Glam Studio in Birendranagar-8, Surkhet: sharp fades, soft layers, rich colour, party-ready makeup, bridal styling and grooming for men and women.',
    '/img/og.jpg',
    '',
    '',
    '',
    '',
    TRUE,
    7,
    '{"ogTitle": "The Salon & Glam Studio | Salon in Birendranagar, Surkhet", "ogDescription": "The Salon & Glam Studio in Birendranagar-8, Surkhet: sharp fades, soft layers, rich colour, party-ready makeup, bridal styling and grooming for men and women.", "keywords": "salon, glam studio, surkhet, haircut, hair colour, balayage, makeup, bridal"}'
  );

-- Gallery images
INSERT INTO website_gallery_images (image_url, title, alt_text, category, description, sort_order, is_visible)
VALUES
  ('/img/porthole.jpg', 'Fade in progress', 'A stylist trimming a client''s hair, seen through a round opening', 'Studio', 'A stylist trimming a client''s hair, seen through a round opening', 1, TRUE),
  ('/img/dryer.jpg', 'Pro tools', 'Close-up of a professional hair dryer nozzle', 'Studio', 'Close-up of a professional hair dryer nozzle', 2, TRUE),
  ('/img/clipper.jpg', 'Precision clipper work', 'Precision clipper blade in front of a client''s freshly cut hair in the mirror', 'Services', 'Precision clipper blade in front of a client''s freshly cut hair in the mirror', 3, TRUE),
  ('/img/lamps.jpg', 'The lamps', 'Perforated brass pendant lamps glowing over the salon floor', 'Studio', 'Perforated brass pendant lamps glowing over the salon floor', 4, TRUE),
  ('/img/trolley.jpg', 'Glam kit', 'Black and silver makeup trolley case at the reception', 'Glam', 'Black and silver makeup trolley case at the reception', 5, TRUE),
  ('/img/balayage.jpg', 'Soft balayage', 'Long layered cut with soft brown balayage, styled at The Salon', 'Colour', 'Long layered cut with soft brown balayage, styled at The Salon', 6, TRUE),
  ('/img/colours.jpg', 'Colour chart', 'Hair colour swatch chart from light blonde to dark brown', 'Colour', 'Hair colour swatch chart from light blonde to dark brown', 7, TRUE),
  ('/img/scissors.jpg', 'Gold scissors', 'Gold styling scissors in front of the salon''s round mirrors', 'Studio', 'Gold styling scissors in front of the salon''s round mirrors', 8, TRUE);

-- System settings defaults
INSERT INTO system_settings (setting_key, setting_value)
VALUES
  ('vat_percentage', '13'),
  ('service_charge_percentage', '10'),
  ('salon_name', 'The Salon'),
  ('salon_address', 'Birendranagar-8, Surkhet'),
  ('salon_phone', '083-590152'),
  ('salon_email', ''),
  ('owner_name', ''),
  ('vat_number', ''),
  ('pan_number', ''),
  ('currency_symbol', 'Rs'),
  ('bank_qr_image', ''),
  ('esewa_qr_image', '')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Default website titles/bios
UPDATE staff_profiles
SET website_title = CASE
      WHEN website_title IS NOT NULL AND website_title <> '' THEN website_title
      WHEN salon_role = 'barber' THEN 'Barber / Hair Dresser'
      WHEN salon_role = 'beautician' THEN 'Beautician'
      ELSE display_name
    END,
    website_bio = COALESCE(NULLIF(website_bio, ''), assigned_services),
    updated_at = NOW();

COMMIT;
