-- Add missing fields to hotels table for floors, rooms, check-in/out dates, and notes
-- Run this script to update the hotels table schema

USE yatra_db;

-- Add columns one by one, checking if they exist first
-- This uses a stored procedure approach that's more reliable

DELIMITER $$

DROP PROCEDURE IF EXISTS AddHotelColumnIfNotExists$$

CREATE PROCEDURE AddHotelColumnIfNotExists(
    IN columnName VARCHAR(64),
    IN columnDefinition TEXT
)
BEGIN
    DECLARE columnExists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO columnExists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'yatra_db'
      AND TABLE_NAME = 'hotels'
      AND COLUMN_NAME = columnName;
    
    IF columnExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE hotels ADD COLUMN ', columnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Added column: ', columnName) AS result;
    ELSE
        SELECT CONCAT('Column already exists: ', columnName) AS result;
    END IF;
END$$

DELIMITER ;

-- Add the columns
CALL AddHotelColumnIfNotExists('total_floors', 'INT AFTER email');
CALL AddHotelColumnIfNotExists('total_rooms', 'INT AFTER total_floors');
CALL AddHotelColumnIfNotExists('check_in_date', 'DATE AFTER total_rooms');
CALL AddHotelColumnIfNotExists('check_out_date', 'DATE AFTER check_in_date');
CALL AddHotelColumnIfNotExists('notes', 'TEXT AFTER check_out_date');

-- Clean up
DROP PROCEDURE IF EXISTS AddHotelColumnIfNotExists;

-- Verify the changes
DESCRIBE hotels;
