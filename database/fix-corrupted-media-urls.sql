-- Fix corrupted media URLs in post_media table
-- This script removes media URLs that are corrupted (missing comma separator or truncated)

USE yatra_db;

-- Find corrupted URLs (base64 URLs missing comma separator)
SELECT 
    id, 
    post_id, 
    media_url,
    LENGTH(media_url) as url_length,
    SUBSTRING(media_url, 1, 50) as url_preview
FROM post_media
WHERE (media_url LIKE 'data:image/%' OR media_url LIKE 'data:video/%')
  AND media_url NOT LIKE '%,%'
ORDER BY id;

-- Option 1: Delete corrupted URLs (recommended if they're unusable)
-- DELETE FROM post_media
-- WHERE (media_url LIKE 'data:image/%' OR media_url LIKE 'data:video/%')
--   AND media_url NOT LIKE '%,%';

-- Option 2: Mark them as corrupted by setting to NULL (if you want to keep the record)
-- UPDATE post_media
-- SET media_url = NULL
-- WHERE (media_url LIKE 'data:image/%' OR media_url LIKE 'data:video/%')
--   AND media_url NOT LIKE '%,%';

-- Verify the fix
SELECT 
    COUNT(*) as total_media,
    SUM(CASE WHEN media_url LIKE 'data:%' AND media_url NOT LIKE '%,%' THEN 1 ELSE 0 END) as corrupted_count
FROM post_media;

