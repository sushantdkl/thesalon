-- This installation is now The Salon & Glam Studio (Birendranagar-8, Surkhet), not The Hair Cut.
-- The code base was cloned from The Hair Cut, so an existing database still carries that salon's
-- website copy, photos (/assets/*, now deleted), contact details and staff on the public site.
-- Forward-only and idempotent: only rows still carrying The Hair Cut's content are rewritten;
-- anything already edited for The Salon is left alone. Financial records are not touched.

BEGIN;

-- 1. Website CMS sections that still hold The Hair Cut defaults get The Salon's content.
UPDATE website_content SET
  title = 'The Salon', subtitle = 'For men and women in Birendranagar, Surkhet', description = 'Sharp fades, soft layers, rich colour and party-ready makeup, done under warm light in Surkhet''s most relaxed chair.', image_url = '/img/balayage.jpg',
  button_text = 'Book a visit', button_link = '/book-appointment', secondary_button_text = 'WhatsApp', secondary_button_link = 'whatsapp',
  metadata = '{"eyebrow": "For men and women"}', updated_at = NOW()
WHERE section_key = 'hero'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'Colour, matched to you', subtitle = 'Colour', description = 'We start every colour with the shade chart in your hand, under daylight-white lamps. Pick a level, we check it against your base and skin tone, and then we mix.', image_url = '/img/colours.jpg',
  button_text = '', button_link = '', secondary_button_text = '', secondary_button_link = '',
  metadata = '{"highlights": ["Shade chart in your hand", "Daylight-white lamps", "Mixed for your skin tone"], "galleryImages": ["/img/colours.jpg", "/img/card.jpg"]}', updated_at = NOW()
WHERE section_key = 'about'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'Services', subtitle = 'Services', description = 'One studio, two sides of the floor. Tell us what you want when you book and we will plan the time you need.', image_url = '/img/clipper.jpg',
  button_text = '', button_link = '', secondary_button_text = '', secondary_button_link = '',
  metadata = '{}', updated_at = NOW()
WHERE section_key = 'services'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'Packages', subtitle = 'Packages', description = 'Several services in one visit, priced together.', image_url = '',
  button_text = '', button_link = '', secondary_button_text = '', secondary_button_link = '',
  metadata = '{}', updated_at = NOW()
WHERE section_key = 'packages'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'Meet the team', subtitle = 'Team', description = 'The stylists, barbers and makeup artists at The Salon & Glam Studio.', image_url = '',
  button_text = '', button_link = '', secondary_button_text = '', secondary_button_link = '',
  metadata = '{}', updated_at = NOW()
WHERE section_key = 'staff'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'Visit us', subtitle = 'Visit us', description = 'Walk-ins welcome. Call ahead for colour, bridal and group bookings.', image_url = '',
  button_text = 'Contact details', button_link = '/contact', secondary_button_text = 'Book now', secondary_button_link = '/book-appointment',
  metadata = '{"salonName": "The Salon", "phone": "083-590152", "whatsappNumber": "9779802055983", "address": "Birendranagar-8, Surkhet", "email": "", "instagram": "https://www.instagram.com/thesalonsurkhet/", "facebook": "https://www.facebook.com/thesalonsurkhet/", "tiktok": "https://www.tiktok.com/discover/the-salon-of-surkhet", "openingHours": "Walk-ins welcome. Call ahead for colour, bridal and group bookings.", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d551112.1895187694!2d82.07465767554316!3d28.284865625145144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a2855970079cad%3A0x3e0035539dcfb198!2sThe%20Salon!5e0!3m2!1sen!2snp!4v1791864961818!5m2!1sen!2snp"}', updated_at = NOW()
WHERE section_key = 'contact'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

UPDATE website_content SET
  title = 'The Salon & Glam Studio | Salon in Birendranagar, Surkhet', subtitle = '', description = 'The Salon & Glam Studio in Birendranagar-8, Surkhet: sharp fades, soft layers, rich colour, party-ready makeup, bridal styling and grooming for men and women.', image_url = '/img/og.jpg',
  button_text = '', button_link = '', secondary_button_text = '', secondary_button_link = '',
  metadata = '{"ogTitle": "The Salon & Glam Studio | Salon in Birendranagar, Surkhet", "ogDescription": "The Salon & Glam Studio in Birendranagar-8, Surkhet: sharp fades, soft layers, rich colour, party-ready makeup, bridal styling and grooming for men and women.", "keywords": "salon, glam studio, surkhet, haircut, hair colour, balayage, makeup, bridal"}', updated_at = NOW()
WHERE section_key = 'seo'
  AND ((COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Hair Cut%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%/assets/%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%9858051694%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Birendranagar-7%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%grooming space built%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Men''s packages%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Popular services%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Meet the staff%' OR (COALESCE(title,'') || ' ' || COALESCE(subtitle,'') || ' ' || COALESCE(description,'') || ' ' || COALESCE(image_url,'') || ' ' || COALESCE(metadata::text,'')) ILIKE '%Location and contact%');

-- 2. Gallery: The Hair Cut's photos are gone from /assets; show The Salon's studio photos instead.
DELETE FROM website_gallery_images WHERE image_url LIKE '/assets/%';
INSERT INTO website_gallery_images (image_url, title, alt_text, category, description, sort_order, is_visible)
SELECT v.image_url, v.title, v.alt_text, v.category, v.alt_text, v.sort_order, TRUE
FROM (VALUES
  ('/img/porthole.jpg', 'Fade in progress', 'A stylist trimming a client''s hair, seen through a round opening', 'Studio', 1),
  ('/img/dryer.jpg', 'Pro tools', 'Close-up of a professional hair dryer nozzle', 'Studio', 2),
  ('/img/clipper.jpg', 'Precision clipper work', 'Precision clipper blade in front of a client''s freshly cut hair in the mirror', 'Services', 3),
  ('/img/lamps.jpg', 'The lamps', 'Perforated brass pendant lamps glowing over the salon floor', 'Studio', 4),
  ('/img/trolley.jpg', 'Glam kit', 'Black and silver makeup trolley case at the reception', 'Glam', 5),
  ('/img/balayage.jpg', 'Soft balayage', 'Long layered cut with soft brown balayage, styled at The Salon', 'Colour', 6),
  ('/img/colours.jpg', 'Colour chart', 'Hair colour swatch chart from light blonde to dark brown', 'Colour', 7),
  ('/img/scissors.jpg', 'Gold scissors', 'Gold styling scissors in front of the salon''s round mirrors', 'Studio', 8)
) AS v(image_url, title, alt_text, category, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM website_gallery_images g WHERE g.image_url = v.image_url);

-- Other CMS rows that pointed at a deleted /assets photo fall back to no photo.
UPDATE website_services SET image_url = NULL, updated_at = NOW() WHERE image_url LIKE '/assets/%';
UPDATE website_staff_profiles SET image_url = NULL, updated_at = NOW() WHERE image_url LIKE '/assets/%';
UPDATE staff_profiles SET website_photo = NULL, updated_at = NOW() WHERE website_photo LIKE '/assets/%';
UPDATE website_service_pages SET image_url = CASE slug
    WHEN 'haircut' THEN '/img/porthole.jpg'
    WHEN 'shaving' THEN '/img/clipper.jpg'
    WHEN 'hair-colour' THEN '/img/colours.jpg'
    ELSE NULL END,
  image_alt = CASE slug
    WHEN 'haircut' THEN 'A stylist trimming a client''s hair at The Salon, Birendranagar'
    WHEN 'shaving' THEN 'Precision clipper work at The Salon, Surkhet'
    WHEN 'hair-colour' THEN 'Hair colour swatch chart from light blonde to dark brown at The Salon'
    ELSE NULL END,
  updated_at = NOW()
WHERE image_url LIKE '/assets/%';
UPDATE website_service_pages SET og_image = NULL, updated_at = NOW() WHERE og_image LIKE '/assets/%';
UPDATE website_page_seo SET og_image = NULL, updated_at = NOW() WHERE og_image LIKE '/assets/%';
UPDATE website_articles SET cover_image = NULL, cover_alt = NULL, updated_at = NOW() WHERE cover_image LIKE '/assets/%';

-- 3. Brand name and address inside any remaining SEO copy.
UPDATE website_service_pages SET
  heading = REPLACE(heading, 'The Hair Cut', 'The Salon'),
  summary = REPLACE(REPLACE(summary, 'The Hair Cut', 'The Salon'), 'Birendranagar-7', 'Birendranagar-8'),
  body = REPLACE(REPLACE(body, 'The Hair Cut', 'The Salon'), 'Birendranagar-7', 'Birendranagar-8'),
  seo_title = REPLACE(seo_title, 'The Hair Cut', 'The Salon'),
  meta_description = REPLACE(REPLACE(meta_description, 'The Hair Cut', 'The Salon'), 'Birendranagar-7', 'Birendranagar-8'),
  updated_at = NOW()
WHERE CONCAT(heading, summary, body, seo_title, meta_description) LIKE '%The Hair Cut%'
   OR CONCAT(summary, body, meta_description) LIKE '%Birendranagar-7%';
UPDATE website_page_seo SET
  seo_title = REPLACE(seo_title, 'The Hair Cut', 'The Salon'),
  meta_description = REPLACE(meta_description, 'The Hair Cut', 'The Salon'),
  og_title = REPLACE(og_title, 'The Hair Cut', 'The Salon'),
  og_description = REPLACE(og_description, 'The Hair Cut', 'The Salon'),
  updated_at = NOW()
WHERE CONCAT(seo_title, meta_description, og_title, og_description) LIKE '%The Hair Cut%';
UPDATE website_articles SET
  title = REPLACE(title, 'The Hair Cut', 'The Salon'),
  excerpt = REPLACE(excerpt, 'The Hair Cut', 'The Salon'),
  body = REPLACE(body, 'The Hair Cut', 'The Salon'),
  author = REPLACE(author, 'The Hair Cut', 'The Salon'),
  seo_title = REPLACE(seo_title, 'The Hair Cut', 'The Salon'),
  meta_description = REPLACE(meta_description, 'The Hair Cut', 'The Salon'),
  updated_at = NOW()
WHERE CONCAT(title, excerpt, body, author, seo_title, meta_description) LIKE '%The Hair Cut%';

-- 4. Local SEO facts saved for The Hair Cut are dropped so The Salon's defaults apply
--    (pin, Maps/review links and hours are re-entered by the owner in SEO & Local Search).
UPDATE website_seo_settings SET
  settings = (settings - 'latitude' - 'longitude' - 'googleMapsUrl' - 'googleReviewUrl' - 'hours' - 'streetAddress' - 'landmark')
    || CASE WHEN settings->>'instagram' IS NULL OR settings->>'instagram' = '' THEN '{"instagram": "https://www.instagram.com/thesalonsurkhet/"}'::jsonb ELSE '{}'::jsonb END,
  updated_at = NOW()
WHERE id = 1
  AND (settings->>'latitude' = '28.5996354' OR settings->>'streetAddress' = 'Birendranagar-7'
       OR settings->>'googleMapsUrl' LIKE '%11598608774880663796%' OR settings->>'googleReviewUrl' LIKE '%The+Hair+Cut%');

-- 5. Receipts, statements and printouts: business details still set to The Hair Cut.
UPDATE system_settings SET setting_value = 'The Salon', updated_at = NOW()
WHERE setting_key = 'salon_name' AND setting_value ILIKE '%Hair Cut%';
UPDATE system_settings SET setting_value = 'Birendranagar-8, Surkhet', updated_at = NOW()
WHERE setting_key = 'salon_address' AND setting_value LIKE '%Birendranagar-7%';
UPDATE system_settings SET setting_value = '083-590152', updated_at = NOW()
WHERE setting_key = 'salon_phone' AND setting_value LIKE '%9858051694%';

-- 6. The Hair Cut's launch staff keep their logins but are no longer shown on the public website.
UPDATE staff_profiles sp SET show_on_website = FALSE, featured_on_website = FALSE, updated_at = NOW()
FROM users u
WHERE sp.user_id = u.id AND u.username IN ('kanchan', 'raashid', 'salman', 'saajid') AND sp.show_on_website IS DISTINCT FROM FALSE;
UPDATE website_staff_profiles SET show_on_website = FALSE, featured_on_website = FALSE, updated_at = NOW()
WHERE name IN ('Kanchan', 'Raashid', 'Salman', 'Saajid') AND show_on_website IS DISTINCT FROM FALSE;
UPDATE users SET email = REPLACE(email, '@thehaircut.local', '@thesalon.local')
WHERE email LIKE '%@thehaircut.local';

COMMIT;
