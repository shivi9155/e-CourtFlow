import { useState, useEffect } from 'react';
import { getAllJudges, getPublicHearings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Court() {
  const [judges, setJudges] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
  };

  const today = new Date();
  const todayHearings = hearings.filter(h => {
    const raw = h.hearingDate || h.date; // support either field
    if (!raw) return false;
    // some entries might be ISO strings without time, Date handles them
    return isSameDay(raw, today) && (h.status === 'Scheduled' || !h.status);
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-12 text-center">Court Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center items-center">
        <div className="card p-6 flex flex-col items-center justify-center">
          <p className="muted text-sm uppercase tracking-wide">Total Judges</p>
          <p className="text-3xl font-semibold mt-2">{judges.length}</p>
        </div>

        <div className="card p-6 flex flex-col items-center justify-center">
          <p className="muted text-sm uppercase tracking-wide">Total Hearings</p>
          <p className="text-3xl font-semibold mt-2">{hearings.length}</p>
        </div>

        <div className="card p-6 flex flex-col items-center justify-center">
          <p className="muted text-sm uppercase tracking-wide">Today's Hearings</p>
          <p className="text-3xl font-semibold mt-2">{todayHearings.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Judges List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Judges</h2>
          <div className="space-y-4">
            {judges.map(judge => (
              <div key={judge._id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{judge.name}</h4>
                    <p className="text-gray-600 text-sm">{judge.court}</p>
                    {judge.specialization && <p className="text-gray-600 text-sm">{judge.specialization}</p>}
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      judge.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' :
                      judge.availabilityStatus === 'busy' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {judge.availabilityStatus ? judge.availabilityStatus.charAt(0).toUpperCase() + judge.availabilityStatus.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary text-sm">View</button>
                  <button className="btn-ghost text-sm">Contact</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Hearings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Today's Hearing Schedule</h2>
          {todayHearings.length === 0 ? (
            <p className="text-gray-500">No hearings scheduled for today</p>
          ) : (
            <div className="space-y-4">
              {todayHearings.map(hearing => (
                <div key={hearing._id} className="card p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Case: {hearing.caseId?.caseNumber || 'Unknown'}</p>
                      <p className="text-gray-600 text-sm">{hearing.hearingTime || 'Time not specified'}</p>
                      <p className="text-gray-600 text-sm">Courtroom {hearing.courtroom}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        hearing.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        hearing.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hearing.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button className="btn-primary text-sm">Details</button>
                    <button className="btn-ghost text-sm">Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
