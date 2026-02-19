import { useState, useEffect } from 'react';
import { getCaseStats, getJudgeStats, getHearingStats, getAllCases, getPublicHearings } from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [casesByType, setCasesByType] = useState(null);
  const [caseStatus, setCaseStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Fetch all stats in parallel
        const [caseStatsRes, judgeStatsRes, hearingStatsRes, casesRes, hearingsRes] = await Promise.all([
          getCaseStats(),
          getJudgeStats(),
          getHearingStats(),
          getAllCases(),
          getPublicHearings()
        ]);

        const caseStats = caseStatsRes.data;
        const judgeStats = judgeStatsRes.data;
        const hearingStats = hearingStatsRes.data;
        const cases = casesRes.data;
        const hearings = hearingsRes.data;

        console.log('Case Stats:', caseStats);
        console.log('Judge Stats:', judgeStats);
        console.log('Hearing Stats:', hearingStats);

        setStats({
          totalCases: caseStats.totalCases || 0,
          totalJudges: judgeStats.totalJudges || 0,
          ongoingCases: caseStats.ongoingCases || 0,
          upcomingHearings: hearingStats.upcomingHearings || 0
        });

        // Group cases by type
        const typeMapping = {};
        cases.forEach(c => {
          typeMapping[c.caseType] = (typeMapping[c.caseType] || 0) + 1;
        });

        setCasesByType({
          labels: Object.keys(typeMapping).length > 0 ? Object.keys(typeMapping) : ['No data'],
          datasets: [{
            label: 'Cases by Type',
            data: Object.keys(typeMapping).length > 0 ? Object.values(typeMapping) : [0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          }]
        });

        // Group cases by status
        const statusMapping = {};
        cases.forEach(c => {
          statusMapping[c.status] = (statusMapping[c.status] || 0) + 1;
        });

        setCaseStatus({
          labels: Object.keys(statusMapping).length > 0 ? Object.keys(statusMapping) : ['No data'],
          datasets: [{
            label: 'Cases by Status',
            data: Object.keys(statusMapping).length > 0 ? Object.values(statusMapping) : [0],
            backgroundColor: ['#FFA500', '#8B4513', '#00AA00'],
          }]
        });

      } catch (err) {
        console.error('Error loading statistics:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load statistics');
        toast.error('Failed to load statistics: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-grey-50 border border-grey-200 rounded-lg p-6 text-center">
        <p className="text-grey-600 text-lg mb-4">Error loading statistics: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-grey hover:bg-grey-700 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
        <div className="hero py-16">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl font-extrabold mb-4">E-CourtFlow</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto muted">
              A professional court case management system. Search, track, and manage proceedings efficiently.
            </p>
            <div className="max-w-2xl mx-auto p-4 card">
              <SearchBar />
            </div>
          </div>
        </div>

      {/* Statistics Cards */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-12 text-center">📊 System Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="muted text-sm uppercase tracking-wide">Total Cases</p>
                  <p className="text-3xl font-semibold">{stats?.totalCases || 0}</p>
                </div>
                <div className="muted text-sm">Cases</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="muted text-sm uppercase tracking-wide">Total Judges</p>
                  <p className="text-3xl font-semibold">{stats?.totalJudges || 0}</p>
                </div>
                <div className="muted text-sm">Judges</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="muted text-sm uppercase tracking-wide">Ongoing Cases</p>
                  <p className="text-3xl font-semibold">{stats?.ongoingCases || 0}</p>
                </div>
                <div className="muted text-sm">Ongoing</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="muted text-sm uppercase tracking-wide">Upcoming Hearings</p>
                  <p className="text-3xl font-semibold">{stats?.upcomingHearings || 0}</p>
                </div>
                <div className="muted text-sm">Hearings</div>
              </div>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {casesByType && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Cases by Type</h3>
              <div className="flex justify-center">
                <div style={{ width: '300px', height: '300px' }}>
                  <Pie data={casesByType} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}

          {caseStatus && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Cases by Status</h3>
              <div className="flex justify-center">
                <div style={{ width: '300px', height: '300px' }}>
                  <Pie data={caseStatus} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}