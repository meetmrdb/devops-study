-- PostgreSQL Table Creation Script for DevOps Career Tracker
-- Generated based on analysis of app.js data structures

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future multi-user support)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    default_weekly_hours INTEGER DEFAULT 15,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Study logs table
CREATE TABLE study_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('Morning', 'Afternoon', 'Evening', 'Full Day')),
    hours DECIMAL(4,1) NOT NULL CHECK (hours >= 0 AND hours <= 12),
    topic VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly hours tracking table
CREATE TABLE weekly_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 24),
    hours_studied DECIMAL(5,1) DEFAULT 0,
    target_hours INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_number)
);

-- Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    difficulty VARCHAR(50) CHECK (difficulty IN ('Associate', 'Intermediate', 'Professional', 'Expert')),
    target_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Planning', 'Studying', 'Scheduled', 'Completed', 'Expired')),
    materials TEXT,
    estimated_study_weeks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    application_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Applied', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Offer', 'Rejected', 'Withdrawn')),
    salary VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly notes table
CREATE TABLE weekly_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 24),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_number)
);

-- Curriculum phases table (for reference data)
CREATE TABLE curriculum_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_number INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_week INTEGER NOT NULL,
    end_week INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly topics table (for reference data)
CREATE TABLE weekly_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INTEGER NOT NULL UNIQUE,
    topic_title VARCHAR(255) NOT NULL,
    phase_id UUID REFERENCES curriculum_phases(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Available certifications table (for reference data)
CREATE TABLE available_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    provider VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Associate', 'Intermediate', 'Professional', 'Expert')),
    estimated_study_weeks INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_study_logs_user_date ON study_logs(user_id, log_date);
CREATE INDEX idx_study_logs_date ON study_logs(log_date);
CREATE INDEX idx_weekly_hours_user_week ON weekly_hours(user_id, week_number);
CREATE INDEX idx_certifications_user_status ON certifications(user_id, status);
CREATE INDEX idx_job_applications_user_date ON job_applications(user_id, application_date);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_weekly_notes_user_week ON weekly_notes(user_id, week_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_logs_updated_at BEFORE UPDATE ON study_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_hours_updated_at BEFORE UPDATE ON weekly_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_notes_updated_at BEFORE UPDATE ON weekly_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default curriculum data
INSERT INTO curriculum_phases (phase_number, name, description, start_week, end_week) VALUES
(1, 'Foundation', 'Build fundamental skills in Linux, scripting, and basic DevOps concepts', 1, 6),
(2, 'Core Skills', 'Master containerization, CI/CD, and core DevOps tools', 7, 12),
(3, 'Advanced Tools', 'Learn container orchestration, cloud platforms, and infrastructure as code', 13, 18),
(4, 'Specialization & Job Prep', 'Focus on monitoring, security, and job preparation', 19, 24);

-- Insert weekly topics
INSERT INTO weekly_topics (week_number, topic_title, phase_id) VALUES
(1, 'Linux Basics & Command Line', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(2, 'Shell Scripting & Automation', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(3, 'Networking & Security Fundamentals', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(4, 'Version Control with Git', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(5, 'Programming Basics (Python/Go)', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(6, 'System Administration', (SELECT id FROM curriculum_phases WHERE phase_number = 1)),
(7, 'Docker & Containerization', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(8, 'CI/CD Fundamentals', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(9, 'Jenkins & Automation', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(10, 'Testing & Quality Assurance', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(11, 'Build & Deployment Tools', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(12, 'Configuration Management', (SELECT id FROM curriculum_phases WHERE phase_number = 2)),
(13, 'Kubernetes Basics', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(14, 'Kubernetes Advanced Features', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(15, 'Cloud Platforms (AWS/Azure/GCP)', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(16, 'Infrastructure as Code (Terraform)', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(17, 'Cloud Services & Architecture', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(18, 'Microservices & API Management', (SELECT id FROM curriculum_phases WHERE phase_number = 3)),
(19, 'Monitoring & Observability', (SELECT id FROM curriculum_phases WHERE phase_number = 4)),
(20, 'Security & Compliance', (SELECT id FROM curriculum_phases WHERE phase_number = 4)),
(21, 'Performance Optimization', (SELECT id FROM curriculum_phases WHERE phase_number = 4)),
(22, 'DevSecOps Practices', (SELECT id FROM curriculum_phases WHERE phase_number = 4)),
(23, 'Portfolio & Resume Building', (SELECT id FROM curriculum_phases WHERE phase_number = 4)),
(24, 'Interview Preparation & Job Search', (SELECT id FROM curriculum_phases WHERE phase_number = 4));

-- Insert available certifications
INSERT INTO available_certifications (name, provider, difficulty, estimated_study_weeks) VALUES
('AWS Certified DevOps Engineer - Professional', 'Amazon Web Services', 'Professional', 8),
('Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', 'Intermediate', 6),
('Docker Certified Associate (DCA)', 'Docker Inc', 'Associate', 4),
('Microsoft Azure DevOps Engineer Expert', 'Microsoft', 'Expert', 10),
('Terraform Associate', 'HashiCorp', 'Associate', 4);

-- Create a view for user dashboard statistics
CREATE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COALESCE(SUM(sl.hours), 0) as total_hours_studied,
    COALESCE(COUNT(DISTINCT sl.log_date), 0) as total_study_days,
    COALESCE(COUNT(c.id), 0) as total_certifications,
    COALESCE(COUNT(ja.id), 0) as total_job_applications,
    COALESCE(COUNT(CASE WHEN ja.status = 'Offer' THEN 1 END), 0) as job_offers,
    COALESCE(COUNT(CASE WHEN c.status = 'Completed' THEN 1 END), 0) as completed_certifications
FROM users u
LEFT JOIN study_logs sl ON u.id = sl.user_id
LEFT JOIN certifications c ON u.id = c.user_id
LEFT JOIN job_applications ja ON u.id = ja.user_id
GROUP BY u.id, u.username;

-- Create a view for weekly progress
CREATE VIEW weekly_progress AS
SELECT 
    u.id as user_id,
    wh.week_number,
    wh.hours_studied,
    wh.target_hours,
    CASE 
        WHEN wh.hours_studied >= wh.target_hours THEN 'Completed'
        WHEN wh.hours_studied >= (wh.target_hours * 0.9) THEN 'In Progress'
        ELSE 'Behind'
    END as status,
    wt.topic_title,
    cp.name as phase_name
FROM users u
JOIN weekly_hours wh ON u.id = wh.user_id
JOIN weekly_topics wt ON wh.week_number = wt.week_number
JOIN curriculum_phases cp ON wt.phase_id = cp.id
ORDER BY u.id, wh.week_number;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
