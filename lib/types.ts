export interface StudyLog {
  id: string;
  date: string;
  sessionType: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
  hours: number;
  topic: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyHours {
  weekNumber: number;
  hoursStudied: number;
  targetHours: number;
}

export interface Certification {
  id: string;
  name: string;
  provider?: string;
  difficulty?: 'Associate' | 'Intermediate' | 'Professional' | 'Expert';
  targetDate: string;
  status: 'Planning' | 'Studying' | 'Scheduled' | 'Completed' | 'Expired';
  materials?: string;
  estimatedStudyWeeks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  applicationDate: string;
  status: 'Applied' | 'Phone Screen' | 'Technical Interview' | 'Final Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  salary?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyNotes {
  weekNumber: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  defaultWeeklyHours: number;
  theme: 'light' | 'dark';
}

export interface CurriculumPhase {
  phase: number;
  name: string;
  weeks: number[];
  description: string;
  weeklyTopics: Record<string, string>;
}

export interface AvailableCertification {
  name: string;
  provider: string;
  difficulty: 'Associate' | 'Intermediate' | 'Professional' | 'Expert';
  estimatedStudyWeeks: number;
}

export interface AppData {
  studyLogs: StudyLog[];
  weeklyHours: Record<string, number>;
  certifications: Certification[];
  jobApplications: JobApplication[];
  weeklyNotes: Record<string, string>;
  settings: UserSettings;
}
