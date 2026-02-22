import { useState } from 'react';
import { searchJudge, getHearingsByJudge } from '../services/api';
import toast from 'react-hot-toast';
import { Search, X } from 'lucide-react';

export default function JudgeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [judge, setJudge] = useState(null);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a judge name');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // Search for judge
      const judgeRes = await searchJudge(searchQuery);
      setJudge(judgeRes.data);

      // Get hearings for this judge
      try {
        const hearingsRes = await getHearingsByJudge(judgeRes.data._id);
        setHearings(hearingsRes.data || []);
      } catch (err) {
        setHearings([]);
      }

      toast.success('Judge found!');
    } catch (err) {
      console.error('Search error:', err);
      setJudge(null);
      setHearings([]);
      toast.error(err.response?.data?.message || 'Judge not found');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setJudge(null);
    setHearings([]);
    setSearched(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">🔍 Search Judge</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter judge name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition bg-gray-700 text-white placeholder-gray-400"
                  style={{ borderColor: '#F26522' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-60"
                style={{ backgroundColor: '#F26522' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              {judge && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-white px-4 py-3 rounded-lg transition"
                  style={{ backgroundColor: '#999' }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Judge Details */}
        {searched && !judge && !loading && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-8 text-center">
            <p className="text-red-100 text-lg">No judge found matching "{searchQuery}"</p>
            <p className="text-red-200 mt-2">Try searching with a different name</p>
          </div>
        )}

        {judge && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Judge Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl" style={{ backgroundColor: '#F26522' }}>
                    ⚖️
                  </div>
                  <h2 className="text-2xl font-bold text-white">{judge.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{judge.specialization} Specialist</p>
                </div>

                <div className="space-y-4 border-t border-gray-700 pt-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                    <p className="text-gray-100 font-semibold break-all">{judge.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                    <p className="text-gray-100 font-semibold">{judge.phone}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Court</p>
                    <p className="text-gray-100 font-semibold">{judge.court}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Experience</p>
                    <p className="text-gray-100 font-semibold">{judge.experience} years</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Status</p>
                    <p className={`text-sm font-bold px-3 py-1 rounded-full inline-block mt-2 ${
                      judge.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' :
                      judge.availabilityStatus === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {judge.availabilityStatus?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Cases & Hearings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Assigned Cases */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📋</span> Assigned Cases [{judge.assignedCases?.length || 0}]
                </h3>

                {judge.assignedCases && judge.assignedCases.length > 0 ? (
                  <div className="space-y-4">
                    {judge.assignedCases.map((caseItem) => (
                      <div key={caseItem._id} className="border border-gray-700 bg-gray-700 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">{caseItem.caseNumber}</h4>
                            <p className="text-gray-300 mt-1">{caseItem.title}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                caseItem.caseType === 'Criminal' ? 'bg-red-100 text-red-800' :
                                caseItem.caseType === 'Civil' ? 'bg-blue-100 text-blue-800' :
                                caseItem.caseType === 'Family' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {caseItem.caseType}
                              </span>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                caseItem.status === 'Ongoing' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {caseItem.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-400">
                              <div>
                                <p className="text-xs uppercase tracking-wide font-semibold">Plaintiff</p>
                                <p>{caseItem.plaintiffName}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-wide font-semibold">Defendant</p>
                                <p>{caseItem.defendantName}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No cases assigned</p>
                  </div>
                )}
              </div>

              {/* Hearings */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>🗓️</span> Scheduled Hearings [{hearings.length}]
                </h3>

                {hearings.length > 0 ? (
                  <div className="space-y-4">
                    {hearings.map((hearing) => (
                      <div key={hearing._id} className="border border-gray-700 bg-gray-700 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-white">
                                📅 {new Date(hearing.hearingDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </h4>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                hearing.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                hearing.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {hearing.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                              <div>
                                <p className="text-gray-400">⏰ Time</p>
                                <p className="font-semibold text-white">{hearing.hearingTime || 'TBD'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">🚪 Courtroom</p>
                                <p className="font-semibold text-white">{hearing.courtroom || 'TBD'}</p>
                              </div>
                            </div>

                            {hearing.purpose && (
                              <div className="mt-3 p-2 bg-gray-600 rounded">
                                <p className="text-xs text-gray-300">Purpose</p>
                                <p className="text-gray-100">{hearing.purpose}</p>
                              </div>
                            )}

                            {hearing.notes && (
                              <div className="mt-2 p-2 bg-blue-900 rounded">
                                <p className="text-xs text-gray-300">Notes</p>
                                <p className="text-gray-100">{hearing.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No hearings scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
