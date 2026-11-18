-- The Salon & Glam Studio's landmark is now "230m north from Tax Payers Office"
-- (was "Opposite Karmachari Sanchaya Kosh"). Only a saved landmark still holding the old text
-- is changed; anything else the owner typed is left alone. Forward-only and safe to re-run.

BEGIN;

UPDATE website_seo_settings
SET settings = jsonb_set(settings, '{landmark}', '"230m north from Tax Payers Office"'::jsonb), updated_at = NOW()
WHERE settings->>'landmark' ILIKE '%Karmachari Sanchaya Kosh%';

UPDATE website_content
SET metadata = REPLACE(REPLACE(metadata, 'Opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'), 'opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'),
    description = REPLACE(REPLACE(description, 'Opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'), 'opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'),
    updated_at = NOW()
WHERE CONCAT(metadata, description) ILIKE '%Karmachari Sanchaya Kosh%';

UPDATE system_settings
SET setting_value = REPLACE(REPLACE(setting_value, 'Opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'), 'opposite Karmachari Sanchaya Kosh', '230m north from Tax Payers Office'), updated_at = NOW()
WHERE setting_value ILIKE '%Karmachari Sanchaya Kosh%';

COMMIT;
