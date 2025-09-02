# DevOps Career Tracker - Database Mapping Documentation

## Overview
This document explains how the current localStorage data structures in the DevOps Career Tracker application map to the PostgreSQL database schema.

## Current Data Storage (localStorage)
The application currently stores all data in browser localStorage under the key `'devops-career-data'` with the following structure:

```javascript
{
  studyLogs: [],
  weeklyHours: {},
  certifications: [],
  jobApplications: [],
  weeklyNotes: {},
  settings: {
    defaultWeeklyHours: 15,
    theme: 'light'
  }
}
```

## Database Schema Mapping

### 1. Study Logs
**Current Structure:**
```javascript
{
  id: "timestamp",
  date: "2025-01-15",
  sessionType: "Morning",
  hours: 2.5,
  topic: "Linux Basics & Command Line",
  notes: "Learned basic commands..."
}
```

**Database Table:** `study_logs`
- `id` → `id` (UUID)
- `date` → `log_date` (DATE)
- `sessionType` → `session_type` (VARCHAR with constraints)
- `hours` → `hours` (DECIMAL(4,1))
- `topic` → `topic` (VARCHAR(255))
- `notes` → `notes` (TEXT)
- Added: `user_id` (UUID) for multi-user support

### 2. Weekly Hours
**Current Structure:**
```javascript
{
  "1": 15.5,
  "2": 12.0,
  // ... weeks 1-24
}
```

**Database Table:** `weekly_hours`
- Week number → `week_number` (INTEGER)
- Hours → `hours_studied` (DECIMAL(5,1))
- Added: `user_id`, `target_hours`, timestamps

### 3. Certifications
**Current Structure:**
```javascript
{
  id: "timestamp",
  name: "AWS Certified DevOps Engineer - Professional",
  targetDate: "2025-06-15",
  status: "Studying",
  materials: "AWS documentation, practice tests",
  provider: "Amazon Web Services",
  difficulty: "Professional"
}
```

**Database Table:** `certifications`
- `id` → `id` (UUID)
- `name` → `name` (VARCHAR(255))
- `targetDate` → `target_date` (DATE)
- `status` → `status` (VARCHAR with constraints)
- `materials` → `materials` (TEXT)
- `provider` → `provider` (VARCHAR(255))
- `difficulty` → `difficulty` (VARCHAR with constraints)
- Added: `user_id`, `estimated_study_weeks`, timestamps

### 4. Job Applications
**Current Structure:**
```javascript
{
  id: "timestamp",
  company: "Tech Corp",
  position: "DevOps Engineer",
  location: "Remote",
  applicationDate: "2025-01-10",
  status: "Applied",
  salary: "$80k - $100k",
  notes: "Applied through LinkedIn..."
}
```

**Database Table:** `job_applications`
- `id` → `id` (UUID)
- `company` → `company` (VARCHAR(255))
- `position` → `position` (VARCHAR(255))
- `location` → `location` (VARCHAR(255))
- `applicationDate` → `application_date` (DATE)
- `status` → `status` (VARCHAR with constraints)
- `salary` → `salary` (VARCHAR(100))
- `notes` → `notes` (TEXT)
- Added: `user_id`, timestamps

### 5. Weekly Notes
**Current Structure:**
```javascript
{
  "1": "This week I learned...",
  "2": "Challenges included...",
  // ... weeks 1-24
}
```

**Database Table:** `weekly_notes`
- Week number → `week_number` (INTEGER)
- Notes content → `notes` (TEXT)
- Added: `user_id`, timestamps

### 6. Settings
**Current Structure:**
```javascript
{
  defaultWeeklyHours: 15,
  theme: 'light'
}
```

**Database Table:** `user_settings`
- `defaultWeeklyHours` → `default_weekly_hours` (INTEGER)
- `theme` → `theme` (VARCHAR with constraints)
- Added: `user_id`, timestamps

## Reference Data Tables

### 7. Curriculum Phases
**Current Structure:** Hardcoded in `app.js`
```javascript
{
  phase: 1,
  name: "Foundation",
  weeks: [1, 2, 3, 4, 5, 6],
  description: "Build fundamental skills...",
  weeklyTopics: { "1": "Linux Basics & Command Line", ... }
}
```

**Database Tables:** `curriculum_phases` + `weekly_topics`
- Phase info → `curriculum_phases`
- Weekly topics → `weekly_topics` (linked to phases)

### 8. Available Certifications
**Current Structure:** Hardcoded in `app.js`
```javascript
{
  name: "AWS Certified DevOps Engineer - Professional",
  provider: "Amazon Web Services",
  difficulty: "Professional",
  estimatedStudyWeeks: 8
}
```

**Database Table:** `available_certifications`
- All fields mapped directly with constraints

## Key Improvements in Database Schema

1. **Multi-User Support:** All tables include `user_id` foreign key
2. **Data Integrity:** Proper constraints and foreign key relationships
3. **Performance:** Indexes on frequently queried columns
4. **Audit Trail:** `created_at` and `updated_at` timestamps with triggers
5. **Normalization:** Reference data separated into dedicated tables
6. **Views:** Pre-built views for common queries (dashboard stats, weekly progress)

## Migration Strategy

To migrate from localStorage to PostgreSQL:

1. **Export Current Data:** Use the existing export functionality
2. **Create User Account:** Insert user record
3. **Transform Data:** Convert localStorage JSON to database records
4. **Import Data:** Insert records into appropriate tables
5. **Update Application:** Modify `saveData()` and `loadData()` methods to use API calls

## API Endpoints Needed

Based on the current functionality, you'll need these API endpoints:

- `GET /api/user/settings` - Load user settings
- `POST /api/user/settings` - Save user settings
- `GET /api/study-logs` - Get study logs
- `POST /api/study-logs` - Create study log
- `PUT /api/study-logs/:id` - Update study log
- `DELETE /api/study-logs/:id` - Delete study log
- `GET /api/weekly-hours` - Get weekly hours
- `POST /api/weekly-hours` - Update weekly hours
- `GET /api/certifications` - Get certifications
- `POST /api/certifications` - Create certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification
- `GET /api/job-applications` - Get job applications
- `POST /api/job-applications` - Create job application
- `PUT /api/job-applications/:id` - Update job application
- `DELETE /api/job-applications/:id` - Delete job application
- `GET /api/weekly-notes/:week` - Get weekly notes
- `POST /api/weekly-notes/:week` - Save weekly notes
- `GET /api/curriculum/phases` - Get curriculum phases
- `GET /api/curriculum/topics` - Get weekly topics
- `GET /api/certifications/available` - Get available certifications
