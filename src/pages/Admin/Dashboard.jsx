import { useEffect, useState } from 'react';
import { fetchCases, fetchJudges, fetchHearings } from '../../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [casesRes, judgesRes, hearingsRes] = await Promise.all([
          fetchCases(),
          fetchJudges(),
          fetchHearings()
        ]);

        const cases = casesRes.data;
        const judges = judgesRes.data;
        const hearings = hearingsRes.data;

        const pending = cases.filter(c => c.status === 'Pending').length;
        const ongoing = cases.filter(c => c.status === 'Ongoing').length;
        const closed = cases.filter(c => c.status === 'Closed').length;
        const upcoming = hearings.filter(h => new Date(h.hearingDate) > new Date()).length;

        setStats({
          totalCases: cases.length,
          pending,
          ongoing,
          closed,
          judges: judges.length,
          upcoming,
          completedHearings: hearings.filter(h => h.status === 'Completed').length
        });

        setChartData({
          labels: ['Pending', 'Ongoing', 'Closed'],
          datasets: [{
            label: 'Cases',
            data: [pending, ongoing, closed],
            backgroundColor: ['#FFA500', '#8B4513', '#00AA00'],
            borderRadius: 8,
          }]
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div className="text-center p-6">Failed to load dashboard</div>;

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">📊 Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="📋 Total Cases" value={stats.totalCases} color="bg-blue-600" />
        <StatCard label="⏳ Pending" value={stats.pending} color="bg-yellow-600" />
        <StatCard label="⚡ Ongoing" value={stats.ongoing} color="bg-orange-600" />
        <StatCard label="✅ Closed" value={stats.closed} color="bg-green-600" />
        <StatCard label="👨‍⚖️ Judges" value={stats.judges} color="bg-purple-600" />
        <StatCard label="📅 Upcoming Hearings" value={stats.upcoming} color="bg-indigo-600" />
        <StatCard label="🎯 Completed Hearings" value={stats.completedHearings} color="bg-rose-600" />
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/admin/cases" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center border-l-4"
          style={{ borderLeftColor: '#F26522' }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#F26522' }}>📁</h3>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Manage Cases</h2>
          <p className="text-gray-600">Add, edit, or delete court cases</p>
        </Link>

        <Link 
          to="/admin/judges" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center border-l-4"
          style={{ borderLeftColor: '#F26522' }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#F26522' }}>👨‍⚖️</h3>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Manage Judges</h2>
          <p className="text-gray-600">Add, edit, or delete judges</p>
        </Link>

        <Link 
          to="/admin/hearings" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition text-center border-l-4"
          style={{ borderLeftColor: '#F26522' }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#F26522' }}>🗓️</h3>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Manage Hearings</h2>
          <p className="text-gray-600">Schedule or reschedule hearings</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/admin/cases" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            ➕ Add New Case
          </Link>
          <Link 
            to="/admin/add-judge" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-bold"
          >
            ➕ Add New Judge
          </Link>
          <Link 
            to="/admin/hearings" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold"
          >
            ➕ Schedule Hearing
          </Link>
        </div>
      </div>

      {/* Chart */}
      {chartData && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Case Status Distribution</h2>
          <div className="flex justify-center">
            <div style={{ width: '400px', height: '400px' }}>
              <Bar data={chartData} options={options} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg shadow-lg p-6 flex justify-between items-center`}>
      <div>
        <p className="text-sm opacity-90 mb-1">{label}</p>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    </div>
  );
}