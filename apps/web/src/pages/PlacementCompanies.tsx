import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  Plus, 
  X, 
  Search, 
  Filter, 
  Building,
  User,
  Calendar
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const PlacementCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Company Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Software / IT',
    recruiterName: '',
    recruiterEmail: '',
    recruiterPhone: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // We extract companies by fetching jobs and grouping them
      const res = await apiClient.get('/jobs');
      const jobs = res.data.data.jobs || [];
      
      const compMap = new Map<string, any>();
      jobs.forEach((j: any) => {
        if (!compMap.has(j.companyName)) {
          compMap.set(j.companyName, {
            name: j.companyName,
            industry: 'Information Technology',
            recruiterName: 'Recruiting Team',
            recruiterEmail: `recruitment@${j.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            recruiterPhone: '+91 99000 88000',
            activeDrivesCount: jobs.filter((job: any) => job.companyName === j.companyName && job.status === 'ACTIVE').length,
            totalDrivesCount: jobs.filter((job: any) => job.companyName === j.companyName).length,
            lastActivity: new Date(j.updatedAt || j.createdAt).toLocaleDateString()
          });
        }
      });

      // Default mock entries if map is empty
      if (compMap.size === 0) {
        compMap.set('ABC Technologies', {
          name: 'ABC Technologies',
          industry: 'Software Engineering',
          recruiterName: 'Sanjay Kumar',
          recruiterEmail: 'sanjay.k@abctech.com',
          recruiterPhone: '+91 98888 77777',
          activeDrivesCount: 2,
          totalDrivesCount: 3,
          lastActivity: 'Yesterday'
        });
        compMap.set('XYZ Solutions', {
          name: 'XYZ Solutions',
          industry: 'Cloud Infrastructure',
          recruiterName: 'Priya Sen',
          recruiterEmail: 'priya.s@xyzsolutions.com',
          recruiterPhone: '+91 97777 66666',
          activeDrivesCount: 1,
          totalDrivesCount: 2,
          lastActivity: 'Aug 20, 2026'
        });
      }

      setCompanies(Array.from(compMap.values()));
    } catch (err: any) {
      setError('Failed to fetch companies directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding company
    const addedCompany = {
      name: newCompany.name,
      industry: newCompany.industry,
      recruiterName: newCompany.recruiterName,
      recruiterEmail: newCompany.recruiterEmail,
      recruiterPhone: newCompany.recruiterPhone,
      activeDrivesCount: 0,
      totalDrivesCount: 0,
      lastActivity: 'Today'
    };

    setCompanies((prev) => [addedCompany, ...prev]);
    setIsAddOpen(false);
    setNewCompany({
      name: '',
      industry: 'Software / IT',
      recruiterName: '',
      recruiterEmail: '',
      recruiterPhone: '',
      notes: ''
    });
  };

  const filteredCompanies = companies.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.recruiterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Corporate Partners</h1>
          <p className="text-brand-500 mt-1">Manage recruiting companies lists, update corporate contact details, and review relationship timelines.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 font-bold">
          <Plus className="h-4.5 w-4.5" />
          <span>Add Corporate Partner</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name, recruiter, or industry..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-brand-100 rounded-xl border border-brand-200"></div>
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <Card className="text-center py-16 border border-brand-200/60 shadow-sm bg-white">
          <CardContent className="space-y-3">
            <Building className="h-8 w-8 text-brand-400 mx-auto" />
            <h3 className="font-bold text-brand-900 text-sm">No corporate partners found</h3>
            <p className="text-brand-500 text-xs">
              Try adjusting your search criteria or register a new company partner using the button above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredCompanies.map((c, index) => (
            <div key={index} className="border border-brand-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Building className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-950 text-sm">{c.name}</h3>
                    <p className="text-brand-500 font-semibold">{c.industry}</p>
                  </div>
                </div>
                <Badge variant={c.activeDrivesCount > 0 ? 'success' : 'secondary'} className="font-bold text-[9px]">
                  {c.activeDrivesCount} Active Drives
                </Badge>
              </div>

              <div className="border-t border-brand-100 pt-3.5 space-y-2 text-brand-650 font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  <span>HR: {c.recruiterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  <a href={`mailto:${c.recruiterEmail}`} className="hover:underline text-indigo-650">{c.recruiterEmail}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  <span>{c.recruiterPhone}</span>
                </div>
              </div>

              <div className="border-t border-brand-100 pt-2 flex items-center justify-between text-[10px] text-brand-450 font-semibold">
                <span>Last Activity: <strong>{c.lastActivity}</strong></span>
                <span>Total Drives: <strong>{c.totalDrivesCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD PARTNER MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between">
            <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h3 className="font-bold text-brand-900 uppercase tracking-wider">Add Corporate Partner</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-brand-200 rounded-full text-brand-450">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Company Name *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Industry Sector *</label>
                <input
                  required
                  type="text"
                  name="industry"
                  value={newCompany.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Cloud Services"
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Recruiter Contact Name *</label>
                <input
                  required
                  type="text"
                  name="recruiterName"
                  value={newCompany.recruiterName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sanjay Sen"
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Recruiter Email *</label>
                  <input
                    required
                    type="email"
                    name="recruiterEmail"
                    value={newCompany.recruiterEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. hr@aws.com"
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Phone number</label>
                  <input
                    type="tel"
                    name="recruiterPhone"
                    value={newCompany.recruiterPhone}
                    onChange={handleInputChange}
                    placeholder="+91 99000..."
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)} className="flex-1 font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold">
                  Save Partner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default PlacementCompanies;
