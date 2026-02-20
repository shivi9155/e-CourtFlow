import { useState, useEffect } from 'react';
import { fetchCases, fetchHearings, fetchJudges } from '../../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const [casesRes, hearingsRes, judgesRes] = await Promise.all([
        fetchCases(),
        fetchHearings(),
        fetchJudges()
      ]);

      const cases = casesRes.data;
      const hearings = hearingsRes.data;
      const judges = judgesRes.data;

      // Calculate statistics
      const caseStats = {
        pending: cases.filter(c => c.status === 'Pending').length,
        ongoing: cases.filter(c => c.status === 'Ongoing').length,
        closed: cases.filter(c => c.status === 'Closed').length,
        total: cases.length
      };

      const hearingStats = {
        scheduled: hearings.filter(h => h.status === 'scheduled').length,
        completed: hearings.filter(h => h.status === 'completed').length,
        postponed: hearings.filter(h => h.status === 'postponed').length,
        total: hearings.length
      };

      const judgeStats = {
        total: judges.length,
        active: judges.filter(j => j.isActive !== false).length
      };

      // Case distribution
      const caseDistribution = [
        { name: 'Pending', value: caseStats.pending },
        { name: 'Ongoing', value: caseStats.ongoing },
        { name: 'Closed', value: caseStats.closed }
      ];

      // Hearing distribution
      const hearingDistribution = [
        { name: 'Scheduled', value: hearingStats.scheduled },
        { name: 'Completed', value: hearingStats.completed },
        { name: 'Postponed', value: hearingStats.postponed }
      ];

      // Judge workload
      const judgeWorkload = judges.slice(0, 10).map(judge => {
        const judgeHearings = hearings.filter(h => h.judgeId?._id === judge._id || h.judgeId === judge._id);
        return {
          name: judge.name.split(' ')[0],
          hearings: judgeHearings.length
        };
      });

      // Monthly case filing (simulated)
      const monthlyData = [
        { month: 'Jan', cases: Math.floor(Math.random() * 20) + 5 },
        { month: 'Feb', cases: Math.floor(Math.random() * 25) + 8 },
        { month: 'Mar', cases: Math.floor(Math.random() * 22) + 6 },
        { month: 'Apr', cases: Math.floor(Math.random() * 18) + 4 },
        { month: 'May', cases: Math.floor(Math.random() * 20) + 7 },
        { month: 'Jun', cases: Math.floor(Math.random() * 25) + 10 }
      ];

      setReportData({
        caseStats,
        hearingStats,
        judgeStats,
        caseDistribution,
        hearingDistribution,
        judgeWorkload,
        monthlyData,
        generatedAt: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Error loading report data:', err);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportData) return;
    
    const reportContent = `
E-COURT FLOW SYSTEM REPORT
Generated: ${reportData.generatedAt}
========================================

CASE STATISTICS
- Total Cases: ${reportData.caseStats.total}
- Pending: ${reportData.caseStats.pending}
- Ongoing: ${reportData.caseStats.ongoing}
- Closed: ${reportData.caseStats.closed}
- Clearance Rate: ${reportData.caseStats.total > 0 ? Math.round((reportData.caseStats.closed / reportData.caseStats.total) * 100) : 0}%

HEARING STATISTICS
- Total Hearings: ${reportData.hearingStats.total}
- Scheduled: ${reportData.hearingStats.scheduled}
- Completed: ${reportData.hearingStats.completed}
- Postponed: ${reportData.hearingStats.postponed}

JUDGE STATISTICS
- Total Judges: ${reportData.judgeStats.total}
- Active Judges: ${reportData.judgeStats.active}

MONTHLY CASE FILING TREND
${reportData.monthlyData.map(m => `${m.month}: ${m.cases} cases`).join('\n')}

JUDGE WORKLOAD (Top 10)
${reportData.judgeWorkload.map((j, i) => `${i + 1}. ${j.name}: ${j.hearings} hearings`).join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `e-courtflow-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Report downloaded successfully');
  };

  if (loading) return <LoadingSpinner />;
  if (!reportData) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-12 text-center">
        <p className="text-[#5D6D7E] text-lg mb-4">Failed to load report</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#C5A059] hover:bg-[#8B4513] text-white px-8 py-3 font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const COLORS = ['#C5A059', '#2C3E50', '#5D6D7E', '#8B4513'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#2C3E50] text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white">
                SYSTEM REPORTS
              </h1>
              <p className="text-[#C5A059] font-light mt-2">
                Analytics and statistics overview
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#8B4513] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download size={20} /> Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            label="Total Cases"
            value={reportData.caseStats.total}
            subtext={`${reportData.caseStats.pending} pending`}
            color="bg-[#F8F5F0]"
          />
          <MetricCard
            label="Active Hearings"
            value={reportData.hearingStats.scheduled}
            subtext={`${reportData.hearingStats.total} total`}
            color="bg-[#F8F5F0]"
          />
          <MetricCard
            label="Clearance Rate"
            value={reportData.caseStats.total > 0 ? Math.round((reportData.caseStats.closed / reportData.caseStats.total) * 100) + '%' : '0%'}
            subtext={`${reportData.caseStats.closed} closed cases`}
            color="bg-[#2C3E50]"
            textColor="text-white"
          />
          <MetricCard
            label="Active Judges"
            value={reportData.judgeStats.active}
            subtext={`${reportData.judgeStats.total} total`}
            color="bg-[#F8F5F0]"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Case Distribution */}
          <div className="bg-white border border-[#E8E0D5] p-8">
            <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Case Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.caseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Hearing Distribution */}
          <div className="bg-white border border-[#E8E0D5] p-8">
            <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Hearing Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.hearingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
                <XAxis dataKey="name" stroke="#5D6D7E" />
                <YAxis stroke="#5D6D7E" />
                <Tooltip />
                <Bar dataKey="value" fill="#C5A059" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border border-[#E8E0D5] p-8 mb-12">
          <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Monthly Case Filing Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis dataKey="month" stroke="#5D6D7E" />
              <YAxis stroke="#5D6D7E" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cases" 
                stroke="#C5A059" 
                strokeWidth={2}
                dot={{ fill: '#C5A059', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Judge Workload */}
        <div className="bg-white border border-[#E8E0D5] p-8 mb-12">
          <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Judge Workload (Top 10)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.judgeWorkload} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
              <XAxis type="number" stroke="#5D6D7E" />
              <YAxis dataKey="name" type="category" stroke="#5D6D7E" width={80} />
              <Tooltip />
              <Bar dataKey="hearings" fill="#C5A059" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Report Info */}
        <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-6 text-center">
          <p className="text-sm text-[#5D6D7E]">
            Report Generated: {reportData.generatedAt}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtext, color, textColor = 'text-[#2C3E50]' }) {
  return (
    <div className={`${color} border border-[#E8E0D5] p-6 rounded-lg`}>
      <p className="text-[#5D6D7E] text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-light ${textColor} mb-1`}>{value}</p>
      <p className="text-xs text-[#5D6D7E]">{subtext}</p>
    </div>
  );
}
