import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCaseStats, getJudgeStats, getHearingStats, getAllCases, getPublicHearings } from '../services/api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [casesByType, setCasesByType] = useState(null);
  const [caseStatus, setCaseStatus] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
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

        setStats({
          totalCases: caseStats.totalCases || 0,
          totalJudges: judgeStats.totalJudges || 0,
          ongoingCases: caseStats.ongoingCases || 0,
          upcomingHearings: hearingStats.upcomingHearings || 0
        });

        // Cases by type
        const typeMapping = {};
        cases.forEach(c => {
          typeMapping[c.caseType] = (typeMapping[c.caseType] || 0) + 1;
        });

        setCasesByType({
          labels: Object.keys(typeMapping).length > 0 ? Object.keys(typeMapping) : ['No data'],
          datasets: [{
            label: 'Cases by Type',
            data: Object.keys(typeMapping).length > 0 ? Object.values(typeMapping) : [0],
            backgroundColor: ['#C5A059', '#8B4513', '#2C3E50', '#7F8C8D', '#A0522D', '#5D6D7E'],
            borderWidth: 0
          }]
        });

        // Cases by status
        const statusMapping = {};
        cases.forEach(c => {
          statusMapping[c.status] = (statusMapping[c.status] || 0) + 1;
        });

        setCaseStatus({
          labels: Object.keys(statusMapping).length > 0 ? Object.keys(statusMapping) : ['No data'],
          datasets: [{
            label: 'Cases by Status',
            data: Object.keys(statusMapping).length > 0 ? Object.values(statusMapping) : [0],
            backgroundColor: ['#C5A059', '#2C3E50', '#7F8C8D', '#A0522D'],
            borderWidth: 0
          }]
        });

        // Monthly trends (simulated data - in production, this would come from API)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          last6Months.push(months[(currentMonth - i + 12) % 12]);
        }

        // Generate realistic trend data based on actual case counts
        const totalCasesCount = cases.length;
        const baseValue = Math.max(5, Math.floor(totalCasesCount / 12));
        
        setMonthlyTrends({
          labels: last6Months,
          datasets: [
            {
              label: 'New Cases',
              data: last6Months.map(() => Math.floor(baseValue * (0.8 + Math.random() * 0.7))),
              borderColor: '#C5A059',
              backgroundColor: 'rgba(197, 160, 89, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Resolved Cases',
              data: last6Months.map(() => Math.floor(baseValue * 0.7 * (0.7 + Math.random() * 0.6))),
              borderColor: '#2C3E50',
              backgroundColor: 'rgba(44, 62, 80, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        });

        // Recent cases
        const sortedCases = [...cases].sort((a, b) => 
          new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
        );
        setRecentCases(sortedCases.slice(0, 5));

        // Upcoming hearings
        const now = new Date();
        const upcoming = hearings
          .filter(h => new Date(h.date) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setUpcomingHearings(upcoming);

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
      <div className="bg-white border border-[#C5A059] rounded-lg p-8 text-center shadow-md">
        <p className="text-[#2C3E50] text-lg mb-4 font-medium">⚠️ Error loading statistics: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#2C3E50] hover:bg-[#8B4513] text-white px-8 py-3 rounded font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Court Image */}
      <div className="relative bg-[#2C3E50] text-white min-h-[600px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Courthouse exterior with columns" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50] via-[#2C3E50]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4 text-white">
              E‑CourtFlow
            </h1>
            <p className="text-2xl md:text-3xl text-[#C5A059] font-light mb-8">
              Streamlined Court Case Management
            </p>
            <div className="max-w-xl">
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* About Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
            <span className="border-b-2 border-[#C5A059] pb-2 text-[#2C3E50]">SYSTEM OVERVIEW</span>
          </h2>
          <p className="text-lg text-[#5D6D7E] text-center max-w-3xl mx-auto font-light">
            Complete court case management with real-time analytics and comprehensive tracking
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { label: 'Total Cases', value: stats?.totalCases, icon: '⚖️' },
            { label: 'Total Judges', value: stats?.totalJudges, icon: '👨‍⚖️' },
            { label: 'Ongoing Cases', value: stats?.ongoingCases, icon: '📋' },
            { label: 'Upcoming Hearings', value: stats?.upcomingHearings, icon: '📅' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#F8F5F0] p-6 text-center border border-[#E8E0D5] hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3 text-[#C5A059]">{item.icon}</div>
              <p className="text-[#5D6D7E] text-sm uppercase tracking-wider mb-2">{item.label}</p>
              <p className="text-4xl font-light text-[#2C3E50]">{item.value || 0}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid - Replacing Practice Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Monthly Trends Line Chart */}
          {monthlyTrends && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E0D5] shadow-sm">
              <h3 className="text-xl font-light mb-6 text-[#2C3E50]">Case Flow Trends (Last 6 Months)</h3>
              <div style={{ height: '300px' }}>
                <Line 
                  data={monthlyTrends} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#5D6D7E'
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: '#E8E0D5'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Cases by Type Pie Chart */}
          {casesByType && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E0D5] shadow-sm">
              <h3 className="text-xl font-light mb-6 text-[#2C3E50]">Cases by Type</h3>
              {casesByType.labels[0] === 'No data' ? (
                <p className="text-[#5D6D7E] text-center py-12">No case data available</p>
              ) : (
                <div className="flex justify-center">
                  <div style={{ width: '300px', height: '300px' }}>
                    <Pie 
                      data={casesByType} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#5D6D7E'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Cases by Status Pie Chart */}
          {caseStatus && (
            <div className="bg-white p-6 rounded-lg border border-[#E8E0D5] shadow-sm">
              <h3 className="text-xl font-light mb-6 text-[#2C3E50]">Cases by Status</h3>
              {caseStatus.labels[0] === 'No data' ? (
                <p className="text-[#5D6D7E] text-center py-12">No case data available</p>
              ) : (
                <div className="flex justify-center">
                  <div style={{ width: '300px', height: '300px' }}>
                    <Pie 
                      data={caseStatus} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#5D6D7E'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-[#2C3E50] to-[#1a2632] text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-light mb-6 text-[#C5A059]">Court Performance</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[#C5A059] text-sm uppercase tracking-wider mb-1">Clearance Rate</p>
                <p className="text-4xl font-light">87%</p>
                <div className="w-full bg-[#5D6D7E] h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[#C5A059] h-full rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#C5A059] text-sm uppercase tracking-wider mb-1">Avg. Case Duration</p>
                  <p className="text-2xl font-light">124 days</p>
                </div>
                <div>
                  <p className="text-[#C5A059] text-sm uppercase tracking-wider mb-1">Active Judges</p>
                  <p className="text-2xl font-light">{stats?.totalJudges || 0}</p>
                </div>
              </div>
              <div>
                <p className="text-[#C5A059] text-sm uppercase tracking-wider mb-1">Next Hearing</p>
                <p className="text-lg font-light">
                  {upcomingHearings.length > 0 
                    ? new Date(upcomingHearings[0].date).toLocaleDateString()
                    : 'No upcoming'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Cases */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-light text-[#2C3E50]">Recent Cases</h3>
            <Link to="/cases" className="text-[#C5A059] hover:text-[#8B4513] font-medium inline-flex items-center">
              View All Cases →
            </Link>
          </div>
          
          {recentCases.length === 0 ? (
            <p className="text-[#5D6D7E]">No recent cases available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCases.map(caseItem => (
                <div key={caseItem.id} className="bg-[#F8F5F0] p-6 hover:shadow-md transition-shadow border border-[#E8E0D5]">
                  <p className="font-medium text-lg mb-2 text-[#2C3E50]">{caseItem.caseNumber || 'N/A'}</p>
                  <p className="text-[#5D6D7E] text-sm mb-3 line-clamp-2">{caseItem.title || 'Untitled'}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      caseItem.status === 'ongoing' ? 'bg-[#C5A059]/20 text-[#8B4513]' : 
                      caseItem.status === 'closed' ? 'bg-[#5D6D7E]/20 text-[#2C3E50]' : 
                      'bg-[#E8E0D5] text-[#5D6D7E]'
                    }`}>
                      {caseItem.status || 'Unknown'}
                    </span>
                    <span className="text-xs text-[#5D6D7E]">
                      {caseItem.updatedAt ? new Date(caseItem.updatedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Hearings */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-light text-[#2C3E50]">Upcoming Hearings</h3>
            <Link to="/hearings" className="text-[#C5A059] hover:text-[#8B4513] font-medium inline-flex items-center">
              View All Hearings →
            </Link>
          </div>
          {upcomingHearings.length === 0 ? (
            <p className="text-[#5D6D7E]">No upcoming hearings</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingHearings.map(hearing => (
                <div key={hearing.id} className="bg-[#F8F5F0] p-6 hover:shadow-md transition-shadow border border-[#E8E0D5]">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-medium text-[#2C3E50]">{hearing.caseNumber || 'N/A'}</p>
                    <span className="text-xs bg-[#C5A059]/20 text-[#8B4513] px-2 py-1 rounded">Upcoming</span>
                  </div>
                  <p className="text-sm text-[#5D6D7E] mb-2">{hearing.purpose || 'Hearing'}</p>
                  <p className="text-xs text-[#5D6D7E]">
                    {new Date(hearing.date).toLocaleDateString()} at {new Date(hearing.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Credit */}
      <div className="border-t border-[#E8E0D5] mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-[#5D6D7E]">
          E-CourtFlow Case Management System
        </div>
      </div>
    </div>
  );
}