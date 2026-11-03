-- The Salon & Glam Studio's printed men's price list (Nov 2026) becomes the POS rate card.
-- Existing services are matched by name (or their older spelling) and only their price and
-- description change, so past bills, staff assignments and packages keep pointing at the same
-- rows. Services on the card that the POS does not have yet are added. Nothing is deleted.
-- Forward-only and idempotent. "& up" prices are stored as the starting price.

BEGIN;

CREATE TEMP TABLE men_rate_card (
  name TEXT NOT NULL,
  alias TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO men_rate_card (name, alias, category, price, duration_minutes, description) VALUES
  -- Hair services
  ('Hair Cut', 'Hair Cut', 'Haircut', 300, 30, 'Rate card service'),
  ('Hair Wash', 'Hair Wash', 'Treatment', 50, 15, 'Rate card service'),
  ('Head Massage', 'Head Massage', 'Spa', 300, 20, 'Rs 300 / Rs 600'),
  -- Beard services
  ('Beard', 'Beard', 'Beard', 150, 15, 'Rate card service'),
  ('Shaving', 'Shaving', 'Beard', 100, 20, 'Rate card service'),
  ('Threading', 'Threading', 'Facial', 70, 15, 'Rate card service'),
  -- Cleansing / facial
  ('Normal Cleansing', 'Normal Cleansing', 'Facial', 700, 35, 'Rate card service'),
  ('Deep Cleansing', 'Deep Cleansing', 'Facial', 1000, 45, 'Rate card service'),
  ('Wine Facial', 'Wine Facial', 'Facial', 1300, 60, 'Rate card service'),
  ('Fruits Facial', 'Fruit Facial', 'Facial', 1800, 60, 'Rate card service'),
  ('Lotus Facial', 'Lotus Facial', 'Facial', 2000, 60, 'Rate card service'),
  ('Anti Aging Facial', 'Anti Aging Facial', 'Facial', 2500, 60, 'Rate card service'),
  ('Dr. Rashel Facial', 'Dr Rashel Facial', 'Facial', 3000, 60, 'Rate card service'),
  ('VLCC Facial', 'VLCC Facial', 'Facial', 3500, 60, 'Rate card service'),
  ('Nature''s Facial', 'Natures Facial', 'Facial', 3800, 60, 'Rate card service'),
  -- Colour
  ('Black Color', 'Black Colour', 'Hair Color', 700, 45, 'Rate card service'),
  ('Global Hair Color', 'Global Hair Colour', 'Hair Color', 1500, 90, 'Starting from Rs 1500'),
  ('Cap Highlight', 'Cap Highlight', 'Hair Color', 2000, 90, 'Starting from Rs 2000'),
  ('Ash Color', 'Ash Colour', 'Hair Color', 3000, 120, 'Starting from Rs 3000'),
  -- Hair straightening
  ('Temporary Straight', 'Temporary Straight', 'Treatment', 500, 30, 'Rate card service'),
  ('Temporary Curl', 'Temporary Curl', 'Treatment', 500, 30, 'Rate card service'),
  ('Permanent Straight', 'Permanent Straight', 'Treatment', 2000, 180, 'Starting from Rs 2000'),
  ('Keratin Straight', 'Keratin Straight', 'Treatment', 2500, 180, 'Starting from Rs 2500'),
  ('Keratin', 'Keratin', 'Treatment', 3000, 120, 'Starting from Rs 3000'),
  ('Permanent Hair Perming', 'Permanent Hair Perming', 'Treatment', 4000, 180, 'Starting from Rs 4000'),
  ('Braids Styling', 'Braids Styling', 'Other', 1000, 45, 'Starting from Rs 1000'),
  ('Hair Spa', 'Hair Spa', 'Spa', 1500, 60, 'Starting from Rs 1500'),
  -- Nail services
  ('Manicure', 'Manicure', 'Other', 1000, 45, 'Starting from Rs 1000'),
  ('Pedicure', 'Pedicure', 'Other', 2000, 60, 'Starting from Rs 2000');

-- 1. New price on the services the POS already has (duration and staff are left as set).
UPDATE salon_services s SET
  name = c.name,
  price = c.price,
  description = c.description,
  is_active = TRUE,
  updated_at = NOW()
FROM men_rate_card c
WHERE LOWER(s.name) IN (LOWER(c.name), LOWER(c.alias))
  AND COALESCE(s.is_package, FALSE) = FALSE
  AND (s.price <> c.price OR s.name <> c.name OR COALESCE(s.description, '') <> c.description OR s.is_active IS NOT TRUE);

-- 2. Add the services on the card that the POS does not have yet.
INSERT INTO salon_services (name, category, price, duration_minutes, description, is_package, package_items, is_active)
SELECT c.name, c.category, c.price, c.duration_minutes, c.description, FALSE, NULL, TRUE
FROM men_rate_card c
WHERE NOT EXISTS (
  SELECT 1 FROM salon_services s
  WHERE LOWER(s.name) IN (LOWER(c.name), LOWER(c.alias)) AND COALESCE(s.is_package, FALSE) = FALSE
);

-- 3. Packages and staff assignments list services by name; follow the one rename on the card.
UPDATE salon_services
SET package_items = REPLACE(package_items, 'Fruit Facial', 'Fruits Facial'), updated_at = NOW()
WHERE is_package = TRUE AND package_items LIKE '%Fruit Facial%';
UPDATE staff_profiles
SET assigned_services = REPLACE(assigned_services, 'Fruit Facial', 'Fruits Facial'), updated_at = NOW()
WHERE assigned_services LIKE '%Fruit Facial%';

COMMIT;
