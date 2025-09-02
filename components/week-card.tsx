'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getDaysLeftInWeek, getWeekStatus } from '@/lib/utils/date-utils';

interface WeekCardProps {
  weekNumber: number;
  topic: string;
  studiedHours: number;
  targetHours: number;
  currentWeek: number;
  onClick?: () => void;
}

export function WeekCard({ weekNumber, topic, studiedHours, targetHours, currentWeek, onClick }: WeekCardProps) {
  const progress = Math.min((studiedHours / targetHours) * 100, 100);
  const status = getWeekStatus(weekNumber, studiedHours, targetHours, currentWeek);
  const daysLeft = getDaysLeftInWeek(weekNumber);
  
  const statusClass = status.toLowerCase().replace(' ', '-');
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        status === 'Completed' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
        status === 'In Progress' && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
        status === 'Behind' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
        status === 'Not Started' && "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Week {weekNumber}
          </div>
          <div className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            status === 'Completed' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            status === 'In Progress' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            status === 'Behind' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            status === 'Not Started' && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          )}>
            {status}
          </div>
        </div>
        <h3 className="text-lg font-semibold leading-tight">{topic}</h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {studiedHours.toFixed(1)}h studied
          </span>
          <span className="text-muted-foreground">
            / {targetHours}h target
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              status === 'Completed' && "bg-green-500",
              status === 'In Progress' && "bg-blue-500",
              status === 'Behind' && "bg-red-500",
              status === 'Not Started' && "bg-gray-400"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress.toFixed(0)}% complete</span>
          <span>{daysLeft} days left</span>
        </div>
      </CardContent>
    </Card>
  );
}
