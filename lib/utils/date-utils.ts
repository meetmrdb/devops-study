import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getWeekFromDate = (dateString: string): number => {
  const logDate = new Date(dateString);
  const startDate = new Date('2025-01-01');
  const diffTime = logDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.ceil(diffDays / 7));
};

export const getDaysLeftInWeek = (weekNumber: number): number => {
  const currentWeek = getCurrentWeek();
  if (weekNumber < currentWeek) return 0;
  if (weekNumber > currentWeek) return 7;
  return Math.max(1, 7 - new Date().getDay());
};

export const getCurrentWeek = (weeklyHours: Record<string, number> = {}, defaultHours: number = 15): number => {
  const totalHours = Object.values(weeklyHours).reduce((sum, hours) => sum + hours, 0);
  return Math.min(Math.floor(totalHours / defaultHours) + 1, 24);
};

export const getWeekStatus = (
  weekNumber: number, 
  studied: number, 
  target: number, 
  currentWeek: number
): 'Not Started' | 'In Progress' | 'Completed' | 'Behind' => {
  // If it's a future week, it's "Not Started"
  if (weekNumber > currentWeek) {
    return 'Not Started';
  }
  
  // If it's completed (100% or more), it's "Completed"
  if (studied >= target) {
    return 'Completed';
  }
  
  // If it's the current week and has some progress, it's "In Progress"
  if (weekNumber === currentWeek && studied > 0) {
    return 'In Progress';
  }
  
  // If it's a past week and not completed, it's "Behind"
  if (weekNumber < currentWeek) {
    return 'Behind';
  }
  
  // If it's the current week but no progress yet, it's "In Progress"
  if (weekNumber === currentWeek) {
    return 'In Progress';
  }
  
  // Default fallback
  return 'Not Started';
};
