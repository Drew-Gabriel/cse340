
-- Insert tony stark into database
INSERT INTO account
VALUES (
    DEFAULT,
    'Tony',
    'Stark',
    'tony@stark.com',
    'Iam1ronm@n'
  ); 

-- UPDATE tony stark account type to Admin
UPDATE account
SET
  account_type = 'Admin'::account_type
WHERE account_id = 1;

-- delete tony stark from database
DELETE FROM account
WHERE account_id = 1;

-- Update Inventory
UPDATE inventory
SET 
inv_description 
= REPLACE(inv_description, 'small interior', 'huge interior')
WHERE inv_id = 10;

-- Join tables
SELECT inv_make, inv_model, classification_name
FROM inventory
JOIN classification
ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

-- Update rows

UPDATE inventory
SET 
inv_image = REPLACE(inv_image, 'images','images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail,'images/vehicles'); -- No where clause was/is specified here because the change is meant to affect every row.