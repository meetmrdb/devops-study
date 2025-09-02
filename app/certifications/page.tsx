'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/lib/context';
import { availableCertifications } from '@/lib/data';
import { Certification } from '@/lib/types';
import { formatDate } from '@/lib/utils/date-utils';
import { Award, Calendar, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function CertificationsPage() {
  const { appData, setAppData, theme, setTheme } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetDate: '',
    status: '',
    materials: ''
  });

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCert = availableCertifications.find(c => c.name === formData.name);
    
    const newCert: Certification = {
      id: editingCert?.id || Date.now().toString(),
      name: formData.name,
      provider: selectedCert?.provider,
      difficulty: selectedCert?.difficulty,
      targetDate: formData.targetDate,
      status: formData.status as any,
      materials: formData.materials,
      estimatedStudyWeeks: selectedCert?.estimatedStudyWeeks,
      createdAt: editingCert?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedCerts;
    if (editingCert) {
      updatedCerts = appData.certifications.map(cert => 
        cert.id === editingCert.id ? newCert : cert
      );
    } else {
      updatedCerts = [...appData.certifications, newCert];
    }

    const updatedData = {
      ...appData,
      certifications: updatedCerts
    };

    setAppData(updatedData);
    
    // Reset form
    setFormData({
      name: '',
      targetDate: '',
      status: '',
      materials: ''
    });
    setShowForm(false);
    setEditingCert(null);
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      targetDate: cert.targetDate,
      status: cert.status,
      materials: cert.materials || ''
    });
    setShowForm(true);
  };

  const handleDelete = (certId: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      const updatedCerts = appData.certifications.filter(cert => cert.id !== certId);
      const updatedData = { ...appData, certifications: updatedCerts };
      setAppData(updatedData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Studying':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Planning':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const sortedCerts = [...appData.certifications].sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navigation onThemeToggle={handleThemeToggle} theme={theme} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Certification Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Track your progress towards industry certifications
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>

        {/* Certification Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingCert ? 'Edit Certification' : 'Add Certification Goal'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Certification Name</label>
                    <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCertifications.map((cert) => (
                          <SelectItem key={cert.name} value={cert.name}>
                            {cert.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Date</label>
                    <Input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
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
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Studying">Studying</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Study Materials</label>
                    <Input
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      placeholder="Links to study resources"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingCert ? 'Update Certification' : 'Save Certification'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingCert(null);
                    setFormData({
                      name: '',
                      targetDate: '',
                      status: '',
                      materials: ''
                    });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Certifications List */}
        <div className="space-y-4">
          {sortedCerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No certifications tracked yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add certifications to track your progress towards industry credentials.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Certification
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedCerts.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Target: {formatDate(cert.targetDate)}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                          {cert.status}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{cert.name}</h3>
                      {cert.provider && (
                        <p className="text-sm text-muted-foreground mb-2">{cert.provider}</p>
                      )}
                      {cert.difficulty && (
                        <p className="text-sm text-muted-foreground mb-2">Difficulty: {cert.difficulty}</p>
                      )}
                      {cert.materials && (
                        <p className="text-sm text-muted-foreground">{cert.materials}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
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
