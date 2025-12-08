-- Fix post_media.media_url column to support long base64 data URLs
-- Run this script if you get "Data too long for column 'media_url'" error

USE yatra_db;

-- Alter media_url column to LONGTEXT to support very long base64 data URLs
ALTER TABLE post_media 
MODIFY COLUMN media_url LONGTEXT NOT NULL;

-- Verify the change
DESCRIBE post_media;

