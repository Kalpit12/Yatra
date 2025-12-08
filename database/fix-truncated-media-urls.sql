-- Fix truncated media URLs in post_media table
-- This script ensures the column can store full base64 URLs

USE yatra_db;

-- Step 1: Check current column type
DESCRIBE post_media;

-- Step 2: Alter column to LONGTEXT (can store up to 4GB)
ALTER TABLE post_media 
MODIFY COLUMN media_url LONGTEXT NOT NULL;

-- Step 3: Verify the change
DESCRIBE post_media;

-- Step 4: Check for truncated URLs (URLs that are suspiciously short)
SELECT 
    id, 
    post_id, 
    LENGTH(media_url) as url_length,
    SUBSTRING(media_url, 1, 50) as url_preview,
    CASE 
        WHEN media_url LIKE 'data:image/%' AND LENGTH(media_url) < 100 THEN 'TRUNCATED'
        WHEN media_url LIKE 'data:video/%' AND LENGTH(media_url) < 100 THEN 'TRUNCATED'
        ELSE 'OK'
    END as status
FROM post_media
WHERE (media_url LIKE 'data:image/%' OR media_url LIKE 'data:video/%')
ORDER BY id;

-- Note: If URLs are already truncated in the database, they cannot be recovered.
-- You will need to re-upload the images for those posts.

