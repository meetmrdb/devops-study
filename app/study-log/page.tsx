'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/context';
import { curriculum } from '@/lib/data';
import { StudyLog } from '@/lib/types';
import { formatDate, getCurrentDate, getWeekFromDate } from '@/lib/utils/date-utils';
import { BookOpen, Calendar, Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function StudyLogPage() {
  const { appData, setAppData, theme, setTheme } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    sessionType: '',
    hours: '',
    topic: '',
    notes: ''
  });

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLog: StudyLog = {
      id: editingLog?.id || Date.now().toString(),
      date: formData.date,
      sessionType: formData.sessionType as any,
      hours: parseFloat(formData.hours),
      topic: formData.topic,
      notes: formData.notes,
      createdAt: editingLog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedLogs;
    if (editingLog) {
      updatedLogs = appData.studyLogs.map(log => 
        log.id === editingLog.id ? newLog : log
      );
    } else {
      updatedLogs = [...appData.studyLogs, newLog];
    }

    // Update weekly hours
    const updatedWeeklyHours = { ...appData.weeklyHours };
    const week = getWeekFromDate(formData.date);
    if (week >= 1 && week <= 24) {
      updatedWeeklyHours[week] = (updatedWeeklyHours[week] || 0) + parseFloat(formData.hours);
    }

    const updatedData = {
      ...appData,
      studyLogs: updatedLogs,
      weeklyHours: updatedWeeklyHours
    };

    setAppData(updatedData);
    
    // Reset form
    setFormData({
      date: getCurrentDate(),
      sessionType: '',
      hours: '',
      topic: '',
      notes: ''
    });
    setShowForm(false);
    setEditingLog(null);
  };

  const handleEdit = (log: StudyLog) => {
    setEditingLog(log);
    setFormData({
      date: log.date,
      sessionType: log.sessionType,
      hours: log.hours.toString(),
      topic: log.topic,
      notes: log.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = (logId: string) => {
    if (confirm('Are you sure you want to delete this study log?')) {
      const updatedLogs = appData.studyLogs.filter(log => log.id !== logId);
      const updatedData = { ...appData, studyLogs: updatedLogs };
      setAppData(updatedData);
    }
  };

  const sortedLogs = [...appData.studyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navigation onThemeToggle={handleThemeToggle} theme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Study Log</h1>
            <p className="text-muted-foreground mt-2">
              Track your daily study sessions and progress
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Study Session
          </Button>
        </div>

        {/* Study Log Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingLog ? 'Edit Study Session' : 'Log Study Session'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      onClick={(e) => {
                        console.log('Date input clicked');
                        // Try to show the native date picker
                        if (e.currentTarget.showPicker) {
                          console.log('showPicker method available');
                          e.currentTarget.showPicker();
                        } else {
                          console.log('showPicker not available, using focus');
                        }
                        // Fallback: focus the input to trigger the date picker
                        e.currentTarget.focus();
                      }}
                      onFocus={(e) => {
                        console.log('Date input focused');
                      }}
                      required
                      className="cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session Type</label>
                    <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Full Day">Full Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Hours Studied</label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="12"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      {[0.5, 1, 2, 4].map((hours) => (
                        <Button
                          key={hours}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, hours: hours.toString() })}
                        >
                          {hours === 0.5 ? '30min' : `${hours}h`}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Topic/Focus</label>
                    <Select value={formData.topic} onValueChange={(value) => setFormData({ ...formData, topic: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {curriculum.map((phase) => (
                          <div key={phase.phase}>
                            <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                              Phase {phase.phase}: {phase.name}
                            </div>
                            {phase.weeks.map((week) => (
                              <SelectItem key={week} value={phase.weeklyTopics[week.toString()]}>
                                Week {week}: {phase.weeklyTopics[week.toString()]}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="What did you learn today?"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingLog ? 'Update Log Entry' : 'Save Log Entry'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingLog(null);
                    setFormData({
                      date: getCurrentDate(),
                      sessionType: '',
                      hours: '',
                      topic: '',
                      notes: ''
                    });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Study Logs List */}
        <div className="space-y-4">
          {sortedLogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No study sessions logged yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start tracking your learning progress by adding your first study session.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {log.sessionType}
                        </div>
                        <div className="text-sm font-medium">
                          {log.hours}h
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{log.topic}</h3>
                      {log.notes && (
                        <p className="text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(log)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
