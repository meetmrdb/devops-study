# DevOps Career Tracker

A comprehensive web application to help aspiring DevOps engineers track their progress through a structured 24-week learning path. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Dashboard**: Visual progress tracking with stats cards and weekly progress cards
- **Study Log**: Daily study session logging with topic tracking and time management
- **Certifications**: Track industry certifications with status and target dates
- **Job Applications**: Monitor job applications and interview progress
- **Weekly Notes**: Document learnings and reflections for each week
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between light and dark themes
- **Data Persistence**: All data is saved to localStorage

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devops-study
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
devops-study/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── study-log/         # Study log pages
│   ├── certifications/    # Certification pages
│   ├── job-applications/  # Job application pages
│   ├── notes/            # Notes pages
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx     # Navigation component
│   └── week-card.tsx     # Week progress card
├── lib/                  # Utilities and data
│   ├── types.ts          # TypeScript interfaces
│   ├── data.ts           # Curriculum and certification data
│   ├── context.tsx       # React context
│   └── utils/            # Utility functions
└── requirements/         # Project requirements
```

## Curriculum Overview

The application follows a 24-week DevOps career transition plan divided into 4 phases:

### Phase 1: Foundation (Weeks 1-6)
- Linux Basics & Command Line
- Shell Scripting & Automation
- Networking & Security Fundamentals
- Version Control with Git
- Programming Basics (Python/Go)
- System Administration

### Phase 2: Core Skills (Weeks 7-12)
- Docker & Containerization
- CI/CD Fundamentals
- Jenkins & Automation
- Testing & Quality Assurance
- Build & Deployment Tools
- Configuration Management

### Phase 3: Advanced Tools (Weeks 13-18)
- Kubernetes Basics
- Kubernetes Advanced Features
- Cloud Platforms (AWS/Azure/GCP)
- Infrastructure as Code (Terraform)
- Cloud Services & Architecture
- Microservices & API Management

### Phase 4: Specialization & Job Prep (Weeks 19-24)
- Monitoring & Observability
- Security & Compliance
- Performance Optimization
- DevSecOps Practices
- Portfolio & Resume Building
- Interview Preparation & Job Search

## Available Certifications

The app includes tracking for popular DevOps certifications:

- AWS Certified DevOps Engineer - Professional
- Certified Kubernetes Administrator (CKA)
- Docker Certified Associate (DCA)
- Microsoft Azure DevOps Engineer Expert
- Terraform Associate

## Data Structure

The application stores data in the following structure:

```typescript
interface AppData {
  studyLogs: StudyLog[];
  weeklyHours: Record<string, number>;
  certifications: Certification[];
  jobApplications: JobApplication[];
  weeklyNotes: Record<string, string>;
  settings: UserSettings;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
