import { useState, useEffect } from 'react';
import { getAllJudges, getPublicHearings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Court() {
  const navigate = useNavigate();
  const [judges, setJudges] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [judgeFilter, setJudgeFilter] = useState('All');
  const [hearingFilter, setHearingFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [judgesRes, hearingsRes] = await Promise.all([
          getAllJudges(),
          getPublicHearings()
        ]);
        setJudges(judgesRes.data);
        setHearings(hearingsRes.data);
      } catch (err) {
        toast.error('Failed to load court data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const today = new Date();
  
  // Show upcoming scheduled hearings (not just today's)
  const upcomingHearings = hearings.filter(h => {
    const raw = h.hearingDate || h.date;
    if (!raw) return false;
    const hearingDate = new Date(raw);
    // Show hearings from today onwards that are scheduled
    return hearingDate >= today && (h.status === 'Scheduled' || !h.status);
  }).sort((a, b) => {
    const dateA = new Date(a.hearingDate || a.date);
    const dateB = new Date(b.hearingDate || b.date);
    return dateA - dateB;
  });

  // Filter judges based on availability
  const filteredJudges = judgeFilter === 'All' 
    ? judges 
    : judges.filter(j => j.availabilityStatus?.toLowerCase() === judgeFilter.toLowerCase());

  // Filter hearings based on status
  const filteredHearings = hearingFilter === 'All'
    ? upcomingHearings
    : upcomingHearings.filter(h => h.status === hearingFilter);

  const getAvailabilityColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-red-100 text-red-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-[#E8E0D5] text-[#5D6D7E]';
    }
  };

  const getHearingStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-[#C5A059]/20 text-[#8B4513]';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-[#E8E0D5] text-[#5D6D7E]';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#2C3E50] text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Courthouse" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50] to-[#2C3E50]/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-white">
              COURT INFORMATION
            </h1>
            <p className="text-xl text-[#C5A059] font-light mb-6">
              Judges directory and daily hearing schedule
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#C5A059]">Court</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#F8F5F0] p-8 text-center border border-[#E8E0D5] hover:shadow-lg transition-shadow">
            <div className="text-[#C5A059] text-3xl mb-3">👨‍⚖️</div>
            <p className="text-[#5D6D7E] text-sm uppercase tracking-wider mb-2">Total Judges</p>
            <p className="text-4xl font-light text-[#2C3E50]">{judges.length}</p>
          </div>

          <div className="bg-[#F8F5F0] p-8 text-center border border-[#E8E0D5] hover:shadow-lg transition-shadow">
            <div className="text-[#C5A059] text-3xl mb-3">📋</div>
            <p className="text-[#5D6D7E] text-sm uppercase tracking-wider mb-2">Total Hearings</p>
            <p className="text-4xl font-light text-[#2C3E50]">{hearings.length}</p>
          </div>

          <div className="bg-[#F8F5F0] p-8 text-center border border-[#E8E0D5] hover:shadow-lg transition-shadow">
            <div className="text-[#C5A059] text-3xl mb-3">📅</div>
            <p className="text-[#5D6D7E] text-sm uppercase tracking-wider mb-2">Upcoming Hearings</p>
            <p className="text-4xl font-light text-[#2C3E50]">{upcomingHearings.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Judges List */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-[#2C3E50]">Available Judges</h2>
              
              {/* Judge Filter */}
              <div className="flex gap-2">
                {['All', 'Available', 'Busy', 'On Leave'].map(status => (
                  <button
                    key={status}
                    onClick={() => setJudgeFilter(status)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      judgeFilter === status
                        ? 'bg-[#C5A059] text-white'
                        : 'bg-[#F8F5F0] text-[#5D6D7E] hover:bg-[#E8E0D5] border border-[#E8E0D5]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredJudges.length === 0 ? (
              <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-12 text-center">
                <p className="text-[#5D6D7E]">No judges found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJudges.map(judge => (
                  <div key={judge._id} className="border border-[#E8E0D5] bg-white p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-[#2C3E50] mb-1">{judge.name}</h4>
                        <p className="text-sm text-[#5D6D7E]">{judge.court}</p>
                        {judge.specialization && (
                          <p className="text-xs text-[#5D6D7E] mt-1">{judge.specialization}</p>
                        )}
                      </div>
                      <div>
                        <span className={`text-xs px-3 py-1 ${getAvailabilityColor(judge.availabilityStatus)}`}>
                          {judge.availabilityStatus || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Judge Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-[#5D6D7E] uppercase tracking-wider">Experience</p>
                        <p className="text-sm text-[#2C3E50]">{judge.experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#5D6D7E] uppercase tracking-wider">Cases Assigned</p>
                        <p className="text-sm text-[#2C3E50]">{judge.casesAssigned || 0}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-[#E8E0D5]">
                      <button 
                        onClick={() => navigate(`/judge/${judge._id}`)}
                        className="text-[#C5A059] hover:text-[#8B4513] text-sm font-medium transition-colors"
                      >
                        View Profile →
                      </button>
                      <button className="text-[#5D6D7E] hover:text-[#2C3E50] text-sm font-medium transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Hearings */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-[#2C3E50]">Upcoming Hearing Schedule</h2>
              
              {/* Hearing Filter */}
              <div className="flex gap-2">
                {['All', 'Scheduled', 'Completed', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setHearingFilter(status)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      hearingFilter === status
                        ? 'bg-[#C5A059] text-white'
                        : 'bg-[#F8F5F0] text-[#5D6D7E] hover:bg-[#E8E0D5] border border-[#E8E0D5]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredHearings.length === 0 ? (
              <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-12 text-center">
                <p className="text-[#5D6D7E] mb-2">No upcoming hearings scheduled</p>
                <p className="text-xs text-[#5D6D7E]">Check back later for new hearings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHearings.map(hearing => (
                  <div key={hearing._id} className="border border-[#E8E0D5] bg-white p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg font-medium text-[#2C3E50] mb-1">
                          Case: {hearing.caseId?.caseNumber || 'Unknown'}
                        </p>
                        <p className="text-sm text-[#5D6D7E]">{hearing.purpose || 'Hearing'}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 ${getHearingStatusColor(hearing.status)}`}>
                        {hearing.status || 'Scheduled'}
                      </span>
                    </div>

                    {/* Hearing Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-[#5D6D7E] uppercase tracking-wider">Time</p>
                        <p className="text-sm text-[#2C3E50]">
                          {hearing.hearingTime || new Date(hearing.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#5D6D7E] uppercase tracking-wider">Courtroom</p>
                        <p className="text-sm text-[#2C3E50]">{hearing.courtroom || 'Not assigned'}</p>
                      </div>
                    </div>

                    {/* Judge Info */}
                    {hearing.judge && (
                      <div className="mb-4">
                        <p className="text-xs text-[#5D6D7E] uppercase tracking-wider">Presiding Judge</p>
                        <p className="text-sm text-[#2C3E50]">{hearing.judge.name || hearing.judge}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-3 border-t border-[#E8E0D5]">
                      <button 
                        onClick={() => hearing.caseId && navigate(`/case/${hearing.caseId._id || hearing.caseId}`)}
                        className="text-[#C5A059] hover:text-[#8B4513] text-sm font-medium transition-colors"
                      >
                        View Details →
                      </button>
                      <button className="text-[#5D6D7E] hover:text-[#2C3E50] text-sm font-medium transition-colors">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Hearings Link */}
            <div className="mt-6 text-right">
              <Link to="/hearings" className="text-[#C5A059] hover:text-[#8B4513] text-sm font-medium inline-flex items-center">
                View All Hearings
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Court Information Footer */}
        <div className="mt-16 pt-8 border-t border-[#E8E0D5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-medium text-[#2C3E50] mb-3">Court Hours</h4>
              <p className="text-xs text-[#5D6D7E]">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-xs text-[#5D6D7E]">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-xs text-[#5D6D7E]">Sunday: Closed</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#2C3E50] mb-3">Contact</h4>
              <p className="text-xs text-[#5D6D7E]">Main Clerk: (555) 123-4567</p>
              <p className="text-xs text-[#5D6D7E]">Judge's Chambers: (555) 123-4568</p>
              <p className="text-xs text-[#5D6D7E]">Email: court@lawagency.com</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#2C3E50] mb-3">Location</h4>
              <p className="text-xs text-[#5D6D7E]">123 Court Street</p>
              <p className="text-xs text-[#5D6D7E]">Cityville, ST 12345</p>
              <p className="text-xs text-[#5D6D7E]">Room 2B - Civil Division</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-right">
          <p className="text-xs text-[#5D6D7E]">
            © 2016-2021 All Rights Reserved | Law Agency Court System
          </p>
        </div>
      </div>
    </div>
  );
}