import { useState } from 'react';
import { createJudge } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddJudge() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    court: '',
    specialization: '',
    experience: 0,
    availabilityStatus: 'available'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJudge(form);
      toast.success('Judge added successfully!');
      navigate('/admin/judges');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add judge');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'experience' ? parseInt(value) : value
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">➕ Add New Judge</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="e.g., John Smith"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="judge@court.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Court */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Court Name *</label>
            <input
              type="text"
              name="court"
              value={form.court}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="e.g., Supreme Court of Delhi"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="e.g., Criminal Law"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Experience (years) *</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
              placeholder="e.g., 10"
            />
          </div>

          {/* Availability Status */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Availability Status *</label>
            <select
              name="availabilityStatus"
              value={form.availabilityStatus}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded focus:outline-none"
              style={{ borderColor: '#ccc' }}
              onFocus={(e) => e.target.style.borderColor = '#F26522'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Adding Judge...' : '✅ Add Judge'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/judges')}
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
