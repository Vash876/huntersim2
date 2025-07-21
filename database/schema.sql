-- CIFI Tools - Neon Database Schema
-- PostgreSQL Database für Cross-Device Synchronisation
-- Stack Auth (Neon Auth) verwaltet die Benutzer

-- Simplified User Backup Storage
-- Jeder User hat genau einen Backup-Datensatz der überschrieben wird
CREATE TABLE user_backups (
  user_id VARCHAR(255) PRIMARY KEY, -- Stack Auth User ID (String, nicht UUID)
  backup_code TEXT NOT NULL, -- Base64 encoded backup von createBackup()
  app_version VARCHAR(20) NOT NULL, -- Version der App (z.B. "2.7.0")
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Backup History für Rollback-Funktionalität (falls gewünscht)
CREATE TABLE user_backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL, -- Stack Auth User ID
  backup_code TEXT NOT NULL,
  app_version VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES user_backups(user_id) ON DELETE CASCADE
);

-- Indexes für Performance
CREATE INDEX idx_backup_history_user_time ON user_backup_history(user_id, created_at DESC);

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
