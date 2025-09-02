import { AvailableCertification, CurriculumPhase } from '@/lib/types';

export const curriculum: CurriculumPhase[] = [
  {
    phase: 1,
    name: "Foundation",
    weeks: [1, 2, 3, 4, 5, 6],
    description: "Build fundamental skills in Linux, scripting, and basic DevOps concepts",
    weeklyTopics: {
      "1": "Linux Basics & Command Line",
      "2": "Shell Scripting & Automation", 
      "3": "Networking & Security Fundamentals",
      "4": "Version Control with Git",
      "5": "Programming Basics (Python/Go)",
      "6": "System Administration"
    }
  },
  {
    phase: 2, 
    name: "Core Skills",
    weeks: [7, 8, 9, 10, 11, 12],
    description: "Master containerization, CI/CD, and core DevOps tools",
    weeklyTopics: {
      "7": "Docker & Containerization",
      "8": "CI/CD Fundamentals", 
      "9": "Jenkins & Automation",
      "10": "Testing & Quality Assurance",
      "11": "Build & Deployment Tools",
      "12": "Configuration Management"
    }
  },
  {
    phase: 3,
    name: "Advanced Tools", 
    weeks: [13, 14, 15, 16, 17, 18],
    description: "Learn container orchestration, cloud platforms, and infrastructure as code",
    weeklyTopics: {
      "13": "Kubernetes Basics",
      "14": "Kubernetes Advanced Features",
      "15": "Cloud Platforms (AWS/Azure/GCP)",
      "16": "Infrastructure as Code (Terraform)",
      "17": "Cloud Services & Architecture",
      "18": "Microservices & API Management"
    }
  },
  {
    phase: 4,
    name: "Specialization & Job Prep",
    weeks: [19, 20, 21, 22, 23, 24], 
    description: "Focus on monitoring, security, and job preparation",
    weeklyTopics: {
      "19": "Monitoring & Observability",
      "20": "Security & Compliance",
      "21": "Performance Optimization", 
      "22": "DevSecOps Practices",
      "23": "Portfolio & Resume Building",
      "24": "Interview Preparation & Job Search"
    }
  }
];

export const availableCertifications: AvailableCertification[] = [
  {
    name: "AWS Certified DevOps Engineer - Professional",
    provider: "Amazon Web Services",
    difficulty: "Professional",
    estimatedStudyWeeks: 8
  },
  {
    name: "Certified Kubernetes Administrator (CKA)", 
    provider: "Cloud Native Computing Foundation",
    difficulty: "Intermediate",
    estimatedStudyWeeks: 6
  },
  {
    name: "Docker Certified Associate (DCA)",
    provider: "Docker Inc",
    difficulty: "Associate", 
    estimatedStudyWeeks: 4
  },
  {
    name: "Microsoft Azure DevOps Engineer Expert",
    provider: "Microsoft",
    difficulty: "Expert",
    estimatedStudyWeeks: 10
  },
  {
    name: "Terraform Associate",
    provider: "HashiCorp", 
    difficulty: "Associate",
    estimatedStudyWeeks: 4
  }
];
