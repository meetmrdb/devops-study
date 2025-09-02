
# Project overview
This app is a comprehensive DevOps career transition planner that guides users through a structured 24-week learning path, combining interactive progress tracking, daily study logging, and job application management. It helps aspiring DevOps engineers stay organized, motivated, and on track toward certification and career success.

# Feature requirements
- We will use Next.js, Shadcn, Lucid, Supabase

## User Dashboard:
- Displays the 24-week DevOps career plan divided into 4 phases (Foundation, Core Skills, Advanced Tools, Specialization & Job Prep).

## Each week represented as an interactive card showing:

- Week number and focus area (e.g., Week 3: Networking & Security Fundamentals).
- Planned study hours for the week (calculated from user schedule).
- Real-time progress bar showing percentage of study hours completed.
- Number of days left to complete the week and current phase.
- Summary overview showing total hours studied, hours remaining, and overall percentage completion for the entire 24-week plan.

## Daily Study Log:

## Form for logging daily study sessions with:
- Date picker (default to current date),
- Study session type (morning, evening),
- Number of hours studied (decimal input),
- Notes/comments field.
- Interface to easily add/edit/delete daily logs.
- Automatic aggregation of daily hours into weekly totals.

## Phase & Week Tracking:
- Ability to track progress by phases and weeks.
- Visual indicators if the user is ahead, on track, or behind schedule based on logged study hours versus planned hours.
- Alerts/reminders if time left is decreasing but hours logged are insufficient to meet goals.

## Notes & Reflections:
- Section for weekly notes and reflections.
- Text input area linked to each week’s card visible on dashboard.

## Certification & Job Application Tracker:
- Separate module or section tracking certifications and job applications.
- Includes fields for certification name, planned date, completion status.

## Job application tracker with fields: 
- company, position, location, application date, status, interview dates.

## Responsive Design:
- Mobile and desktop friendly UI.
- Clean, minimalistic design optimized for study and productivity.

## User Authentication & Data Persistence:
- User login/signup functionality.
- Reliable backend database to store logs, progress, notes.
- Data privacy and export option (e.g., CSV export of logs and progress).

## Optional Features:
- Calendar view for monthly/week progress visualization.
- Export/import study logs and career plan progress.
- Integration with calendar apps for study session reminders.


# Current File Structure

pod-momentum-ui/
├── .next/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── utils.ts
├── node_modules/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── requirements/
│   └── frontend_instructions.md
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- All new pages go in /app
