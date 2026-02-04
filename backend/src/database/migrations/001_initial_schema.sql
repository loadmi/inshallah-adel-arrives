-- Initial schema for Adel Standard Time database

CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    world_time TEXT NOT NULL,
    adel_time TEXT NOT NULL,
    delay_minutes INTEGER NOT NULL,
    hour_of_day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    minutes_since_midnight INTEGER NOT NULL,
    reason TEXT,  -- Valid values: 'traffic', 'family_emergency', 'work_emergency', 'technical_difficulties', 'other'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_hour_of_day ON entries(hour_of_day);
CREATE INDEX IF NOT EXISTS idx_day_of_week ON entries(day_of_week);
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at);
