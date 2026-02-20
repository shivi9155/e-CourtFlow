import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHearing, fetchCases, fetchJudges } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ScheduleHearing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  
  const [formData, setFormData] = useState({
    caseId: '',
    judgeId: '',
    hearingDate: '',
    hearingTime: '',
    courtroom: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cRes, jRes] = await Promise.all([
        fetchCases(),
        fetchJudges()
      ]);
      setCases(cRes.data);
      setJudges(jRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load cases and judges');
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.caseId) {
      toast.error('Please select a case');
      return;
    }
    if (!formData.judgeId) {
      toast.error('Please select a judge');
      return;
    }
    if (!formData.hearingDate) {
      toast.error('Please select a hearing date');
      return;
    }
    if (!formData.hearingTime) {
      toast.error('Please select a hearing time');
      return;
    }
    if (!formData.courtroom.trim()) {
      toast.error('Please enter the courtroom number/name');
      return;
    }

    // Combine date and time
    const hearingDateTime = new Date(`${formData.hearingDate}T${formData.hearingTime}`);
    if (hearingDateTime < new Date()) {
      toast.error('Hearing date and time cannot be in the past');
      return;
    }

    setLoading(true);
    try {
      await createHearing({
        caseId: formData.caseId,
        judgeId: formData.judgeId,
        hearingDate: hearingDateTime,
        courtroom: formData.courtroom,
        status: formData.status
      });
      toast.success('Hearing scheduled successfully');
      navigate('/admin/hearings');
    } catch (err) {
      console.error('Error scheduling hearing:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule hearing');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner />;

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
          <h1 className="text-4xl font-light tracking-tight text-white">
            SCHEDULE HEARING
          </h1>
          <p className="text-[#C5A059] font-light mt-2">
            Schedule a new court hearing
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-[#F8F5F0] border border-[#E8E0D5] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Selection */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Select Case <span className="text-red-500">*</span>
              </label>
              <select
                name="caseId"
                value={formData.caseId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              >
                <option value="">-- Select a case --</option>
                {cases.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.caseNumber} - {c.title}
                  </option>
                ))}
              </select>
              {cases.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No cases available. Please create a case first.</p>
              )}
            </div>

            {/* Judge Selection */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Select Judge <span className="text-red-500">*</span>
              </label>
              <select
                name="judgeId"
                value={formData.judgeId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              >
                <option value="">-- Select a judge --</option>
                {judges.map(j => (
                  <option key={j._id} value={j._id}>
                    Hon. {j.name}
                  </option>
                ))}
              </select>
              {judges.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No judges available. Please add a judge first.</p>
              )}
            </div>

            {/* Hearing Date */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Hearing Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="hearingDate"
                value={formData.hearingDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Hearing Time */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Hearing Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="hearingTime"
                value={formData.hearingTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Courtroom */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Courtroom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courtroom"
                value={formData.courtroom}
                onChange={handleChange}
                placeholder="e.g., Room 101 or Courtroom A"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                disabled={loading}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#C5A059] hover:bg-[#8B4513] text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Scheduling...' : 'Schedule Hearing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/hearings')}
                disabled={loading}
                className="flex-1 bg-[#5D6D7E] hover:bg-[#2C3E50] text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
