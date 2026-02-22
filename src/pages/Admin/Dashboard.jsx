import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCases, fetchJudges, fetchHearings } from '../../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const { admin } = useAuth();
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
            backgroundColor: ['#C5A059', '#2C3E50', '#5D6D7E'],
            borderRadius: 0,
            barPercentage: 0.7,
          }]
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-12 text-center">
        <p className="text-[#5D6D7E] text-lg mb-4">Failed to load dashboard</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#C5A059] hover:bg-[#8B4513] text-white px-8 py-3 font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'bottom',
        labels: {
          color: '#5D6D7E',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#2C3E50',
        titleColor: '#C5A059',
        bodyColor: '#FFFFFF',
        borderColor: '#C5A059',
        borderWidth: 1
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#E8E0D5' },
        ticks: { color: '#5D6D7E' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#5D6D7E' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#2C3E50] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 text-white">
                ADMIN DASHBOARD
              </h1>
              <p className="text-[#C5A059] font-light">
                System overview and management controls
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Welcome back, {admin?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
              {admin?.role && <p className="text-xs text-[#C5A059] uppercase tracking-wide mt-1">{admin.role}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            label="Total Cases" 
            value={stats.totalCases} 
            icon="⚖️"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Pending" 
            value={stats.pending} 
            icon="⏳"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Ongoing" 
            value={stats.ongoing} 
            icon="⚡"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Closed" 
            value={stats.closed} 
            icon="✅"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Judges" 
            value={stats.judges} 
            icon="👨‍⚖️"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Upcoming Hearings" 
            value={stats.upcoming} 
            icon="📅"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Completed Hearings" 
            value={stats.completedHearings} 
            icon="🎯"
            bgColor="bg-[#F8F5F0]"
            textColor="text-[#2C3E50]"
          />
          <StatCard 
            label="Clearance Rate" 
            value={stats.totalCases ? Math.round((stats.closed / stats.totalCases) * 100) + '%' : '0%'} 
            icon="📊"
            bgColor="bg-[#2C3E50]"
            textColor="text-white"
          />
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <ManagementCard 
            to="/admin/cases"
            icon="📁"
            title="Manage Cases"
            description="Add, edit, or delete court cases"
            stats={`${stats.totalCases} total cases`}
          />
          <ManagementCard 
            to="/admin/judges"
            icon="👨‍⚖️"
            title="Manage Judges"
            description="Add, edit, or delete judges"
            stats={`${stats.judges} active judges`}
          />
          <ManagementCard 
            to="/admin/hearings"
            icon="🗓️"
            title="Manage Hearings"
            description="Schedule or reschedule hearings"
            stats={`${stats.upcoming} upcoming`}
          />
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          {chartData && (
            <div className="lg:col-span-2 bg-white p-8 border border-[#E8E0D5]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-[#2C3E50]">Case Status Distribution</h2>
                <div className="flex gap-2">
                  <span className="text-xs bg-[#C5A059] text-white px-2 py-1">Pending</span>
                  <span className="text-xs bg-[#2C3E50] text-white px-2 py-1">Ongoing</span>
                  <span className="text-xs bg-[#5D6D7E] text-white px-2 py-1">Closed</span>
                </div>
              </div>
              <div style={{ height: '350px' }}>
                <Bar data={chartData} options={options} />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-[#F8F5F0] p-8 border border-[#E8E0D5]">
            <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <QuickActionLink 
                to="/admin/cases/new"
                icon="➕"
                title="Add New Case"
                description="Create a new court case"
              />
              <QuickActionLink 
                to="/admin/add-judge"
                icon="➕"
                title="Add New Judge"
                description="Register a new judge"
              />
              <QuickActionLink 
                to="/admin/hearings/schedule"
                icon="➕"
                title="Schedule Hearing"
                description="Set up a new hearing"
              />
              <QuickActionLink 
                to="/admin/reports"
                icon="📊"
                title="Generate Reports"
                description="View system analytics"
              />
            </div>

            {/* System Status */}
            <div className="mt-8 pt-6 border-t border-[#E8E0D5]">
              <h3 className="text-sm font-medium text-[#2C3E50] mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5D6D7E]">Database</span>
                  <span className="text-green-600">● Online</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5D6D7E]">API</span>
                  <span className="text-green-600">● Online</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5D6D7E]">Last Backup</span>
                  <span className="text-[#2C3E50]">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 pt-8 border-t border-[#E8E0D5]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-[#2C3E50]">Recent Activity</h2>
            <Link to="/admin/activity" className="text-[#C5A059] hover:text-[#8B4513] text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="bg-[#F8F5F0] border border-[#E8E0D5] divide-y divide-[#E8E0D5]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#C5A059]">📋</span>
                <div>
                  <p className="text-sm text-[#2C3E50] font-medium">New case filed</p>
                  <p className="text-xs text-[#5D6D7E]">Case #2024-0012 - Smith v. Jones</p>
                </div>
              </div>
              <span className="text-xs text-[#5D6D7E]">2 hours ago</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#C5A059]">👨‍⚖️</span>
                <div>
                  <p className="text-sm text-[#2C3E50] font-medium">Judge assigned</p>
                  <p className="text-xs text-[#5D6D7E]">Hon. Robert Miller to Case #2024-0010</p>
                </div>
              </div>
              <span className="text-xs text-[#5D6D7E]">5 hours ago</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#C5A059]">📅</span>
                <div>
                  <p className="text-sm text-[#2C3E50] font-medium">Hearing scheduled</p>
                  <p className="text-xs text-[#5D6D7E]">Case #2024-0008 - March 15, 2024</p>
                </div>
              </div>
              <span className="text-xs text-[#5D6D7E]">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-right">
          <p className="text-xs text-[#5D6D7E]">
            © 2016-2021 All Rights Reserved | Law Agency Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, bgColor, textColor }) {
  return (
    <div className={`${bgColor} border border-[#E8E0D5] p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#5D6D7E] text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-3xl font-light ${textColor}`}>{value}</p>
        </div>
        <span className="text-2xl text-[#C5A059]">{icon}</span>
      </div>
    </div>
  );
}

function ManagementCard({ to, icon, title, description, stats }) {
  return (
    <Link to={to} className="group">
      <div className="border border-[#E8E0D5] bg-white p-8 hover:shadow-lg transition-shadow">
        <div className="text-4xl text-[#C5A059] mb-4">{icon}</div>
        <h3 className="text-xl font-medium text-[#2C3E50] mb-2 group-hover:text-[#C5A059] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[#5D6D7E] mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#5D6D7E]">{stats}</span>
          <span className="text-[#C5A059] text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}

function QuickActionLink({ to, icon, title, description }) {
  return (
    <Link to={to} className="block group">
      <div className="flex items-start gap-3 p-3 hover:bg-white transition-colors">
        <span className="text-[#C5A059] text-xl">{icon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#2C3E50] group-hover:text-[#C5A059] transition-colors">
            {title}
          </h4>
          <p className="text-xs text-[#5D6D7E]">{description}</p>
        </div>
        <span className="text-[#C5A059] text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
    </Link>
  );
}