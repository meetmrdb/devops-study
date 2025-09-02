'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeekCard } from '@/components/week-card';
import { useApp } from '@/lib/context';
import { curriculum } from '@/lib/data';
import { getCurrentWeek } from '@/lib/utils/date-utils';
import { BookOpen, Calendar, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { appData, theme, setTheme } = useApp();
  const [currentPhase, setCurrentPhase] = useState(1);

  const totalHours = Object.values(appData.weeklyHours).reduce((sum, hours) => sum + hours, 0);
  const totalTargetHours = 24 * appData.settings.defaultWeeklyHours;
  const overallProgress = Math.min((totalHours / totalTargetHours) * 100, 100);
  const currentWeek = getCurrentWeek(appData.weeklyHours, appData.settings.defaultWeeklyHours);
  const weekHours = appData.weeklyHours[currentWeek] || 0;

  const currentPhaseData = curriculum.find(p => p.phase === currentPhase);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} theme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your DevOps Journey</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress through the 24-week DevOps career transition plan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours Studied</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                of {totalTargetHours} target hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentWeek}</div>
              <p className="text-xs text-muted-foreground">
                of 24 weeks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {totalHours.toFixed(1)}h / {totalTargetHours}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                of {appData.settings.defaultWeeklyHours} target
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Phase Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {curriculum.map((phase) => (
              <Button
                key={phase.phase}
                variant={currentPhase === phase.phase ? "default" : "outline"}
                onClick={() => setCurrentPhase(phase.phase)}
                className="text-sm"
              >
                Phase {phase.phase}: {phase.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Phase Description */}
        {currentPhaseData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Phase {currentPhaseData.phase}: {currentPhaseData.name}
            </h2>
            <p className="text-muted-foreground">{currentPhaseData.description}</p>
          </div>
        )}

        {/* Weekly Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPhaseData?.weeks.map((weekNumber) => (
            <WeekCard
              key={weekNumber}
              weekNumber={weekNumber}
              topic={currentPhaseData.weeklyTopics[weekNumber.toString()]}
              studiedHours={appData.weeklyHours[weekNumber] || 0}
              targetHours={appData.settings.defaultWeeklyHours}
              currentWeek={currentWeek}
              onClick={() => {
                // Navigate to study log or notes
                window.location.href = '/study-log';
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
