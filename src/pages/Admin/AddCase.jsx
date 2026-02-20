import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCase } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function AddCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    description: '',
    parties: {
      petitioner: '',
      respondent: ''
    },
    plaintiffName: '',
    defendantName: '',
    filingDate: '',
    status: 'Pending',
    caseType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.caseNumber.trim()) {
      toast.error('Case number is required');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('Case title is required');
      return;
    }
    if (!formData.caseType) {
      toast.error('Case type is required');
      return;
    }
    if (!formData.parties.petitioner.trim()) {
      toast.error('Petitioner name is required');
      return;
    }
    if (!formData.parties.respondent.trim()) {
      toast.error('Respondent name is required');
      return;
    }
    if (!formData.filingDate) {
      toast.error('Filing date is required');
      return;
    }

    setLoading(true);
    try {
      await createCase(formData);
      toast.success('Case created successfully');
      navigate('/admin/cases');
    } catch (err) {
      console.error('Error creating case:', err);
      toast.error(err.response?.data?.message || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

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
            ADD NEW CASE
          </h1>
          <p className="text-[#C5A059] font-light mt-2">
            Create a new court case in the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-[#F8F5F0] border border-[#E8E0D5] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Number */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Case Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                placeholder="e.g., 2024-0001"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Case Title */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Case Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Smith v. Jones"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Case Type <span className="text-red-500">*</span>
              </label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              >
                <option value="">Select case type</option>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* Court Name */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Court Name
              </label>
              <input
                type="text"
                name="courtName"
                value={formData.courtName}
                onChange={handleChange}
                placeholder="e.g., District Court"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                disabled={loading}
              />
            </div>

            {/* Petitioner */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Petitioner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="parties.petitioner"
                value={formData.parties.petitioner}
                onChange={handleChange}
                placeholder="Petitioner name"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Respondent */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Respondent <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="parties.respondent"
                value={formData.parties.respondent}
                onChange={handleChange}
                placeholder="Respondent name"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter case details..."
                rows="4"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#C5A059] bg-white"
                disabled={loading}
              />
            </div>

            {/* Filing Date */}
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2">
                Filing Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleChange}
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
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#C5A059] hover:bg-[#8B4513] text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Case'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/cases')}
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
