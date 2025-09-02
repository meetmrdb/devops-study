'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/context';
import { JobApplication } from '@/lib/types';
import { formatDate, getCurrentDate } from '@/lib/utils/date-utils';
import { Building, Calendar, DollarSign, Edit, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function JobApplicationsPage() {
  const { appData, setAppData, theme, setTheme } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    applicationDate: getCurrentDate(),
    status: '',
    salary: '',
    notes: ''
  });

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob: JobApplication = {
      id: editingJob?.id || Date.now().toString(),
      company: formData.company,
      position: formData.position,
      location: formData.location,
      applicationDate: formData.applicationDate,
      status: formData.status as any,
      salary: formData.salary,
      notes: formData.notes,
      createdAt: editingJob?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedJobs;
    if (editingJob) {
      updatedJobs = appData.jobApplications.map(job => 
        job.id === editingJob.id ? newJob : job
      );
    } else {
      updatedJobs = [...appData.jobApplications, newJob];
    }

    const updatedData = {
      ...appData,
      jobApplications: updatedJobs
    };

    setAppData(updatedData);
    
    // Reset form
    setFormData({
      company: '',
      position: '',
      location: '',
      applicationDate: getCurrentDate(),
      status: '',
      salary: '',
      notes: ''
    });
    setShowForm(false);
    setEditingJob(null);
  };

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location || '',
      applicationDate: job.applicationDate,
      status: job.status,
      salary: job.salary || '',
      notes: job.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job application?')) {
      const updatedJobs = appData.jobApplications.filter(job => job.id !== jobId);
      const updatedData = { ...appData, jobApplications: updatedJobs };
      setAppData(updatedData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Phone Screen':
      case 'Technical Interview':
      case 'Final Interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Rejected':
      case 'Withdrawn':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const sortedJobs = [...appData.jobApplications].sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navigation onThemeToggle={handleThemeToggle} theme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Application Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Track your job applications and interview progress
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Job Application Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingJob ? 'Edit Job Application' : 'Add Job Application'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Job title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State or Remote"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Application Date</label>
                    <Input
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                      onClick={(e) => {
                        // Try to show the native date picker
                        if (e.currentTarget.showPicker) {
                          e.currentTarget.showPicker();
                        }
                        // Fallback: focus the input to trigger the date picker
                        e.currentTarget.focus();
                      }}
                      required
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                        <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                        <SelectItem value="Final Interview">Final Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Salary Range</label>
                    <Input
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g., $80k - $100k"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Interview feedback, requirements, etc."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingJob ? 'Update Application' : 'Save Application'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingJob(null);
                    setFormData({
                      company: '',
                      position: '',
                      location: '',
                      applicationDate: getCurrentDate(),
                      status: '',
                      salary: '',
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

        {/* Job Applications List */}
        <div className="space-y-4">
          {sortedJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No job applications tracked yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start tracking your job applications to monitor your progress.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Applied: {formatDate(job.applicationDate)}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{job.position}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                      {job.notes && (
                        <p className="text-sm text-muted-foreground">{job.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(job)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
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
