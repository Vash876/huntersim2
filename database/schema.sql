-- CIFI Tools - Neon Database Schema
-- PostgreSQL Database für Cross-Device Synchronisation
-- Stack Auth (Neon Auth) verwaltet die Benutzer

-- ===========================================
-- ACTUAL DATABASE STRUCTURE (Updated 2025-10-17)
-- ===========================================

-- Main User Backups Table
-- Stores current backup for each user
CREATE TABLE user_backups (
  user_id VARCHAR(255) PRIMARY KEY, -- Stack Auth User ID (String, nicht UUID)
  backup_code TEXT NOT NULL, -- Base64 encoded backup von createBackup()
  app_version VARCHAR(20) NOT NULL, -- Version der App (z.B. "2.7.0")
  created_at TIMESTAMP DEFAULT NOW(), -- When user first created backup
  updated_at TIMESTAMP DEFAULT NOW()  -- When backup was last updated
);

-- Backup History Table
-- Stores previous versions of backups for each user
CREATE TABLE user_backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL, -- Stack Auth User ID
  backup_code TEXT NOT NULL, -- Previous backup version
  app_version VARCHAR(20) NOT NULL, -- App version when backup was created
  created_at TIMESTAMP DEFAULT NOW() -- When this backup version was stored
);

-- Migration Tables (temporary, used during database migrations)
-- These can be ignored for application logic
CREATE TABLE migration_latest_backups (
  user_id VARCHAR(255), -- Nullable during migration
  backup_code TEXT,
  app_version VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE migration_latest_backup_history (
  id UUID,
  user_id VARCHAR(255),
  backup_code TEXT,
  created_at TIMESTAMP
);

-- ===========================================
-- NEON AUTH SCHEMA (Managed by Stack Auth)
-- ===========================================
-- Located in 'neon_auth' schema, not 'public'
-- Contains all registered users (Stack Auth managed)

-- Stack Auth Users Table (neon_auth.users_sync)
-- This table contains ALL registered users (3255+ users)
-- Structure (read-only for our application):
/*
CREATE TABLE neon_auth.users_sync (
  id TEXT PRIMARY KEY, -- Stack Auth User ID (matches user_backups.user_id)
  raw_json JSONB NOT NULL, -- Full user data from Stack Auth
  name TEXT, -- User display name
  email TEXT, -- User email address
  created_at TIMESTAMP WITH TIME ZONE, -- When user registered
  updated_at TIMESTAMP WITH TIME ZONE, -- Last user update
  deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete timestamp
);
*/

-- ===========================================
-- DATABASE STATISTICS (as of 2025-10-17)
-- ===========================================
-- Total registered users (neon_auth.users_sync): ~3255
-- Users with backups (user_backups): ~1511
-- This means ~1744 users registered but never created backups

-- ===========================================
-- INDEXES AND PERFORMANCE
-- ===========================================

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_backup_history_user_time ON user_backup_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_backups_updated ON user_backups(updated_at DESC);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Update Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_backups_updated_at BEFORE UPDATE ON user_backups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ADMIN QUERIES (for reference)
-- ===========================================

-- Get all users with backup info
/*
SELECT 
  ub.user_id,
  ub.app_version,
  ub.created_at,
  ub.updated_at,
  COUNT(ubh.id) as backup_history_count,
  LENGTH(ub.backup_code) as backup_size
FROM user_backups ub
LEFT JOIN user_backup_history ubh ON ub.user_id = ubh.user_id
GROUP BY ub.user_id, ub.app_version, ub.created_at, ub.updated_at, ub.backup_code
ORDER BY ub.updated_at DESC;
*/

-- Get total registered users from Stack Auth
/*
SELECT COUNT(*) as total_registered 
FROM neon_auth.users_sync 
WHERE deleted_at IS NULL;
*/

-- Get users with backups count
/*
SELECT COUNT(DISTINCT user_id) as users_with_backups 
FROM user_backups;
*/
