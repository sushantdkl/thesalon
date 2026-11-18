-- The Salon & Glam Studio, Nov 2026.
--
-- 1. Services get a "gender" (men / women / unisex) so billing, online booking and the services
--    page can show All / Men / Women. The existing catalogue is the men's printed price list,
--    so existing single services become 'men'; packages stay 'unisex' (shown on both sides).
-- 2. The women's printed price list is added as 'women' services. Several names match a men's
--    service (e.g. Wine Facial) but carry the women's price; the gender keeps them apart.
-- 3. The launch staff inherited from The Hair Cut (and any other non-admin staff) leave the
--    system. A staff member with no history is deleted; one with bills, tokens, payroll,
--    attendance or any other record is deactivated (cannot log in, hidden everywhere) so past
--    reports stay correct. Admin accounts are kept.
-- 4. users.can_login ("System login" in Employees): staff without it are assigned work in
--    billing but cannot sign in. PINs are now 4 digits.
-- 5. The new team is added without a system login. The owner ticks "System login" and sets a
--    4-digit PIN in Employees for each person who should sign in (e.g. the cashier).
--
-- Forward-only and safe to re-run.

BEGIN;

-- 1. Service gender ---------------------------------------------------------------------------
ALTER TABLE salon_services ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'unisex';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'salon_services_gender_check') THEN
    ALTER TABLE salon_services ADD CONSTRAINT salon_services_gender_check CHECK (gender IN ('men', 'women', 'unisex'));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_salon_services_gender ON salon_services (gender);

-- Existing single services are the men's rate card (only rows still on the default are touched).
UPDATE salon_services SET gender = 'men', updated_at = NOW()
WHERE gender = 'unisex' AND COALESCE(is_package, FALSE) = FALSE
  AND NOT EXISTS (SELECT 1 FROM salon_services w WHERE w.gender = 'women');

-- 2. Women's rate card ------------------------------------------------------------------------
CREATE TEMP TABLE women_rate_card (
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO women_rate_card (name, category, price, duration_minutes, description) VALUES
  -- Threading
  ('Eyebrows Threading', 'Facial', 50, 10, 'Rate card service'),
  ('Full Face Threading', 'Facial', 150, 20, 'Rate card service'),
  -- Cleansing
  ('Soft Cleansing', 'Facial', 500, 30, 'Rate card service'),
  ('Normal Cleansing', 'Facial', 800, 35, 'Rate card service'),
  ('Deep Cleansing', 'Facial', 1200, 45, 'Rate card service'),
  -- Facial
  ('Fruits Facial', 'Facial', 1200, 60, 'Rate card service'),
  ('Wine Facial', 'Facial', 1500, 60, 'Rate card service'),
  ('Vadi Facial', 'Facial', 1800, 60, 'Rate card service'),
  ('Lotus Facial', 'Facial', 2500, 60, 'Rate card service'),
  ('Dr. Rashel Facial', 'Facial', 2800, 60, 'Rate card service'),
  ('VLCC Facial', 'Facial', 3000, 60, 'Rate card service'),
  ('Anti Aging Facial', 'Facial', 3200, 60, 'Rate card service'),
  ('Nature''s Facial', 'Facial', 3500, 60, 'Rate card service'),
  -- Waxing
  ('Both Hands Waxing', 'Other', 600, 30, 'Rate card service'),
  ('Underarms Waxing', 'Other', 200, 15, 'Rate card service'),
  ('Half Leg Waxing', 'Other', 600, 30, 'Rate card service'),
  ('Full Leg Waxing', 'Other', 1200, 45, 'Rate card service'),
  ('Tummy Waxing', 'Other', 400, 20, 'Rate card service'),
  ('Half Back Waxing', 'Other', 400, 20, 'Rate card service'),
  ('Full Back Waxing', 'Other', 800, 30, 'Rate card service'),
  -- Nail care
  ('Manicure', 'Other', 700, 45, 'Rate card service'),
  ('Pedicure', 'Other', 1000, 60, 'Rate card service'),
  ('Deep Manicure', 'Other', 1000, 60, 'Rate card service'),
  ('Deep Pedicure', 'Other', 2000, 75, 'Rate card service'),
  -- Eye lash extensions
  ('Hybrid Eye Lash Extensions', 'Makeup', 2500, 90, 'Rate card service'),
  ('Full Volume Eye Lash Extensions', 'Makeup', 3000, 120, 'Rate card service'),
  ('Classic Eye Lash Extensions', 'Makeup', 3500, 120, 'Rate card service'),
  ('Lash Lifting', 'Makeup', 2000, 60, 'Rate card service'),
  ('Eye Lash Refilling', 'Makeup', 1500, 60, 'Rate card service'),
  -- Nail extensions
  ('Press Nail Extensions Both Hand', 'Other', 1000, 45, 'Rate card service'),
  ('Gel Nail Overlays Both Hand', 'Other', 1500, 60, 'Rate card service'),
  ('Gel Paint Charge Both Hand', 'Other', 3000, 60, 'Rate card service'),
  ('Gel Nail Extensions', 'Other', 3000, 90, 'Rate card service'),
  ('Acrylic Extensions', 'Other', 600, 60, 'Rate card service'),
  ('Leg Nail Extensions', 'Other', 1700, 60, 'Rate card service'),
  -- Hair cut & styling
  ('Front Cut', 'Haircut', 100, 15, 'Rate card service'),
  ('Straight Cut', 'Haircut', 200, 20, 'Rate card service'),
  ('Bob Cut', 'Haircut', 300, 30, 'Rate card service'),
  ('U Cut', 'Haircut', 350, 30, 'Rate card service'),
  ('V Cut', 'Haircut', 350, 30, 'Rate card service'),
  ('Step Cut', 'Haircut', 500, 40, 'Rate card service'),
  ('Shaggy Cut', 'Haircut', 500, 40, 'Rate card service'),
  ('Layer Cut', 'Haircut', 500, 40, 'Rate card service'),
  ('Butterfly Cut', 'Haircut', 500, 45, 'Rate card service'),
  ('Other Cut', 'Haircut', 500, 40, 'Rate card service'),
  -- Hair straightening
  ('Temporary Straight', 'Treatment', 500, 30, 'Rate card service'),
  ('Temporary Curl', 'Treatment', 500, 30, 'Rate card service'),
  ('Blow Dry Styling', 'Treatment', 400, 30, 'Starting from Rs 400'),
  ('Hair Spa', 'Spa', 1200, 60, 'Starting from Rs 1200'),
  ('Permanent Straight', 'Treatment', 3000, 180, 'Starting from Rs 3000'),
  ('Keratin Straight', 'Treatment', 3000, 180, 'Starting from Rs 3000'),
  ('Keratin', 'Treatment', 3500, 120, 'Starting from Rs 3500'),
  ('Smoothening', 'Treatment', 1500, 120, 'Starting from Rs 1500'),
  ('Hair Botox', 'Treatment', 4000, 150, 'Starting from Rs 4000'),
  -- Hair colouring
  ('Global Hair Color', 'Hair Color', 2000, 90, 'Starting from Rs 2000'),
  ('Root Touch Up', 'Hair Color', 700, 45, 'Starting from Rs 700'),
  ('Cap Highlight', 'Hair Color', 1500, 90, 'Starting from Rs 1500'),
  ('Piece Highlight', 'Hair Color', 200, 30, 'Rs 200 per piece'),
  ('Balayage', 'Hair Color', 4000, 180, 'Starting from Rs 4000'),
  ('Highlight & Global Hair Color', 'Hair Color', 5000, 180, 'Starting from Rs 5000'),
  ('Ash Color', 'Hair Color', 4000, 120, 'Starting from Rs 4000'),
  -- Makeup
  ('Soft Makeup', 'Makeup', 1500, 60, 'Makeup & hair only'),
  ('Party Makeup', 'Makeup', 2500, 90, 'Makeup + hair + sari'),
  ('Pre/Post Wedding Makeup', 'Makeup', 6000, 120, 'Rate card service'),
  ('Engagement Makeup', 'Makeup', 8000, 150, 'Rate card service'),
  ('Haldi Day Makeup', 'Makeup', 5000, 120, 'Rate card service'),
  ('Bridal Makeup', 'Makeup', 13500, 180, 'Rate card service'),
  ('Reception Makeup', 'Makeup', 12000, 180, 'Rate card service'),
  ('Mehendi Hand & Leg', 'Other', 6500, 120, 'Rate card service');

-- Only add what is missing, so a price the owner later edits is never overwritten on a re-run.
INSERT INTO salon_services (name, category, price, duration_minutes, description, is_package, package_items, is_active, gender)
SELECT c.name, c.category, c.price, c.duration_minutes, c.description, FALSE, NULL, TRUE, 'women'
FROM women_rate_card c
WHERE NOT EXISTS (
  SELECT 1 FROM salon_services s
  WHERE LOWER(s.name) = LOWER(c.name) AND s.gender = 'women' AND COALESCE(s.is_package, FALSE) = FALSE
);

-- 3. Old staff leave --------------------------------------------------------------------------
CREATE TEMP TABLE new_team (
  username TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO new_team (username, full_name, role) VALUES
  ('nisha', 'Nisha Sunar', 'stylist'),
  ('khagisara', 'Khagisara Lamichhane', 'stylist'),
  ('kamala', 'Kamala B.K.', 'stylist'),
  ('sapana', 'Sapana Nepali', 'stylist'),
  ('pradip', 'Pradip Sunar', 'stylist'),
  ('ramjan', 'Ramjan Ansari', 'stylist'),
  ('kamil', 'Kamil Ansari', 'stylist'),
  ('asif', 'Asif Salmani', 'stylist'),
  ('babita', 'Babita Rawat', 'cashier');

DO $$
DECLARE
  member RECORD;
  fk RECORD;
  ref_count BIGINT;
  history BIGINT;
BEGIN
  FOR member IN
    SELECT u.id FROM users u
    WHERE u.role <> 'admin' AND LOWER(u.username) NOT IN (SELECT username FROM new_team)
  LOOP
    -- Every table pointing at users counts as history, except login/setup rows that only
    -- exist for an active staff member.
    history := 0;
    FOR fk IN
      SELECT c.conrelid::regclass AS tbl, a.attname AS col
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
      WHERE c.contype = 'f' AND c.confrelid = 'users'::regclass
        AND c.conrelid::regclass::text NOT IN ('sessions', 'staff_profiles', 'staff_working_hours', 'hr_shift_assignments', 'devices')
    LOOP
      EXECUTE format('SELECT COUNT(*) FROM %s WHERE %I = $1', fk.tbl, fk.col) INTO ref_count USING member.id;
      history := history + ref_count;
    END LOOP;

    IF history = 0 THEN
      DELETE FROM users WHERE id = member.id;
    ELSE
      UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = member.id;
      UPDATE staff_profiles SET show_on_website = FALSE, featured_on_website = FALSE, updated_at = NOW() WHERE user_id = member.id;
      DELETE FROM sessions WHERE user_id = member.id;
    END IF;
  END LOOP;
END $$;

-- Team cards typed into the Website CMS for the old staff come off the public site.
UPDATE website_staff_profiles SET show_on_website = FALSE, featured_on_website = FALSE, updated_at = NOW()
WHERE show_on_website IS DISTINCT FROM FALSE;

-- 4. System login flag ------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_login BOOLEAN NOT NULL DEFAULT TRUE;

-- 5. New team ---------------------------------------------------------------------------------
-- No system login yet, and the password hash belongs to a random secret that was thrown away.
INSERT INTO users (username, full_name, role, password_hash, email, phone, is_active, can_login)
SELECT n.username, n.full_name, n.role, '$2b$10$h9kHtAfjcMswxy1XNEL/h.l3A2DRxdDoKpFj9skJI0oQUke1mjtN.', NULL, NULL, TRUE, FALSE
FROM new_team n
ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO staff_profiles (user_id, display_name, salon_role, assigned_services, commission_percentage, base_salary, show_on_website)
SELECT u.id, n.full_name, n.role, '', 0, 0, n.role <> 'cashier'
FROM new_team n
JOIN users u ON LOWER(u.username) = n.username
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  salon_role = EXCLUDED.salon_role,
  show_on_website = EXCLUDED.show_on_website,
  updated_at = NOW();

COMMIT;
