'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/context';
import { curriculum } from '@/lib/data';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotesPage() {
  const { appData, setAppData, theme, setTheme } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(appData.weeklyNotes[selectedWeek] || '');
  }, [selectedWeek, appData.weeklyNotes]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
  };

  const handleSaveNotes = () => {
    const updatedNotes = {
      ...appData.weeklyNotes,
      [selectedWeek]: notes
    };
    const updatedData = {
      ...appData,
      weeklyNotes: updatedNotes
    };
    setAppData(updatedData);
  };

  const handleClearNotes = () => {
    if (confirm('Are you sure you want to clear the notes for this week?')) {
      setNotes('');
      const updatedNotes = { ...appData.weeklyNotes };
      delete updatedNotes[selectedWeek];
      const updatedData = {
        ...appData,
        weeklyNotes: updatedNotes
      };
      setAppData(updatedData);
    }
  };

  const getCurrentWeekTopic = () => {
    const phase = curriculum.find(p => p.weeks.includes(selectedWeek));
    return phase ? phase.weeklyTopics[selectedWeek.toString()] : `Week ${selectedWeek}`;
  };

  const getCurrentPhase = () => {
    return curriculum.find(p => p.weeks.includes(selectedWeek));
  };

  const hasNotes = (week: number) => {
    return appData.weeklyNotes[week] && appData.weeklyNotes[week].trim() !== '';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onThemeToggle={handleThemeToggle} theme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Weekly Notes & Reflections</h1>
          <p className="text-muted-foreground mt-2">
            Document your learnings, challenges, and insights for each week
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Week Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Week Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {curriculum.map((phase) => (
                    <div key={phase.phase}>
                      <div className="font-medium text-sm text-muted-foreground mb-2">
                        Phase {phase.phase}: {phase.name}
                      </div>
                      <div className="space-y-1">
                        {phase.weeks.map((week) => (
                          <button
                            key={week}
                            onClick={() => handleWeekChange(week)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedWeek === week
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            } ${hasNotes(week) ? 'font-medium' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>Week {week}</span>
                              {hasNotes(week) && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {phase.weeklyTopics[week.toString()]}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Week {selectedWeek}: {getCurrentWeekTopic()}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getCurrentPhase()?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Notes
                    </Button>
                    <Button onClick={handleClearNotes} variant="outline" size="sm">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share your thoughts, learnings, challenges, and insights from this week..."
                  className="min-h-[400px] resize-none"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>💡 Tips for effective note-taking:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>What concepts did you learn this week?</li>
                    <li>What challenges did you face and how did you overcome them?</li>
                    <li>What resources or tools were most helpful?</li>
                    <li>What would you do differently next time?</li>
                    <li>How does this week's content connect to previous weeks?</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
