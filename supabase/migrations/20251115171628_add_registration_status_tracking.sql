/*
  # Add Status Tracking to Registrations

  1. Changes
    - Add `status` column to track registration state (pending, success, error)
    - Add `federal_response` column to store the Federal API response
    - Add `error_message` column to store error details
    - Add `representante_id` column to track which representative link was used
    
  2. Notes
    - Status helps us know if registration was successful at Federal
    - Response data helps with debugging
    - Representante ID connects registration to correct representative
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'status'
  ) THEN
    ALTER TABLE registrations ADD COLUMN status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'federal_response'
  ) THEN
    ALTER TABLE registrations ADD COLUMN federal_response jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE registrations ADD COLUMN error_message text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'representante_id'
  ) THEN
    ALTER TABLE registrations ADD COLUMN representante_id text;
  END IF;
END $$;