import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCaseById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setError(null);
        const { data } = await getCaseById(id);
        console.log('Case data loaded:', data);
        setCaseData(data);
      } catch (err) {
        console.error('Error fetching case:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load case details';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="container mx-auto p-6 text-center">
      <p className="text-red-500 text-lg mb-4">Error: {error}</p>
      <a href="/cases" className="text-blue-600 hover:underline">← Back to Cases</a>
    </div>
  );

  if (!caseData) return (
    <div className="container mx-auto p-6 text-center">
      <p className="text-gray-500 text-lg">Case not found</p>
      <a href="/cases" className="text-blue-600 hover:underline mt-4 inline-block">← Back to Cases</a>
    </div>
  );

  const statusColor = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Ongoing': 'bg-orange-100 text-orange-800',
    'Closed': 'bg-green-100 text-green-800'
  }[caseData.status] || 'bg-gray-100 text-gray-800';

  const caseTypeColor = {
    'Civil': 'bg-blue-100 text-blue-800',
    'Criminal': 'bg-red-100 text-red-800',
    'Family': 'bg-purple-100 text-purple-800',
    'Corporate': 'bg-green-100 text-green-800'
  }[caseData.caseType] || 'bg-gray-100 text-gray-800';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <a href="/cases" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Cases</a>
      
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 text-white" style={{ backgroundColor: '#F26522' }}>
          <h1 className="text-4xl font-bold mb-2">{caseData.caseNumber}</h1>
          <p className="opacity-90 text-lg">{caseData.title}</p>
        </div>

        <div className="p-8">
          {/* Status & Type Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
              📊 {caseData.status || 'Unknown'}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${caseTypeColor}`}>
              ⚖️ {caseData.caseType || 'General'}
            </span>
            {caseData.caseId && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gray-200 text-gray-800">
                ID: {caseData.caseId}
              </span>
            )}
          </div>

          {/* Case Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2" style={{ borderBottomColor: '#F26522' }}>📋 Case Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">Filing Date</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {caseData.filingDate ? new Date(caseData.filingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">Plaintiff</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {caseData.plaintiffName || caseData.parties?.petitioner || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">Defendant</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {caseData.defendantName || caseData.parties?.respondent || 'N/A'}
                  </p>
                </div>

                {caseData.description && (
                  <div>
                    <p className="text-gray-600 text-sm uppercase tracking-wide">Description</p>
                    <p className="text-gray-800">{caseData.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2" style={{ borderBottomColor: '#F26522' }}>⚖️ Judge & Hearings</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">Assigned Judge</p>
                  {caseData.assignedJudge ? (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff3e8' }}>
                      <p className="text-lg font-bold text-gray-800">
                        {typeof caseData.assignedJudge === 'string' 
                          ? caseData.assignedJudge 
                          : (caseData.assignedJudge.name || 'Unknown')}
                      </p>
                      {caseData.assignedJudge.email && (
                        <p className="text-sm text-gray-600">📧 {caseData.assignedJudge.email}</p>
                      )}
                      {caseData.assignedJudge.court && (
                        <p className="text-sm text-gray-600">🏛️ {caseData.assignedJudge.court}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Not yet assigned</p>
                  )}
                </div>

                {caseData.hearingDates && Array.isArray(caseData.hearingDates) && caseData.hearingDates.length > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm uppercase tracking-wide">Hearing Dates</p>
                    <div className="space-y-2">
                      {caseData.hearingDates.map((hearing, idx) => (
                        <div key={hearing._id || idx} className="bg-gray-50 p-3 rounded border-l-4" style={{ borderLeftColor: '#F26522' }}>
                          <p className="font-semibold text-gray-800">
                            📅 {hearing.hearingDate ? new Date(hearing.hearingDate).toLocaleDateString() : 'Date N/A'}
                          </p>
                          {hearing.courtroom && <p className="text-sm text-gray-600">🚪 Courtroom {hearing.courtroom}</p>}
                          {hearing.hearingTime && <p className="text-sm text-gray-600">⏰ {hearing.hearingTime}</p>}
                          <p className={`text-xs font-bold mt-1 px-2 py-1 rounded inline-block ${
                            hearing.status === 'Scheduled' ? 'bg-blue-200 text-blue-800' :
                            hearing.status === 'Completed' ? 'bg-green-200 text-green-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {hearing.status || 'Scheduled'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Case History */}
          {caseData.history && Array.isArray(caseData.history) && caseData.history.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2" style={{ borderBottomColor: '#F26522' }}>📜 Case History</h2>
              <div className="space-y-3">
                {caseData.history.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl">📝</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Date N/A'} 
                        {item.date && ` - ${new Date(item.date).toLocaleTimeString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}`}
                      </p>
                      <p className="text-gray-600">{item.description || 'No description'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}