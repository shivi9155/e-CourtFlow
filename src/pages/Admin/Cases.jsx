import { useState, useEffect } from 'react';
import { fetchCases, createCase, updateCase, deleteCase } from '../../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    parties: { petitioner: '', respondent: '' },
    status: 'pending'
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const { data } = await fetchCases();
    setCases(data);
  };

  const openCreateModal = () => {
    setEditingCase(null);
    setFormData({ caseNumber: '', title: '', parties: { petitioner: '', respondent: '' }, status: 'pending' });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCase(c);
    setFormData({
      caseNumber: c.caseNumber,
      title: c.title,
      parties: { petitioner: c.parties.petitioner, respondent: c.parties.respondent },
      status: c.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCase) {
        await updateCase(editingCase._id, formData);
        toast.success('Case updated');
      } else {
        await createCase(formData);
        toast.success('Case created');
      }
      setModalOpen(false);
      loadCases();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await deleteCase(id);
      toast.success('Deleted');
      loadCases();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Case Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> New Case
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Case Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Petitioner</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Respondent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cases.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{c.caseNumber}</td>
                <td className="px-6 py-4">{c.title}</td>
                <td className="px-6 py-4">{c.parties.petitioner}</td>
                <td className="px-6 py-4">{c.parties.respondent}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${c.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${c.status === 'closed' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => openEditModal(c)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingCase ? 'Edit Case' : 'Create Case'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Case Number"
                value={formData.caseNumber}
                onChange={e => setFormData({...formData, caseNumber: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Petitioner"
                value={formData.parties.petitioner}
                onChange={e => setFormData({...formData, parties: {...formData.parties, petitioner: e.target.value}})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Respondent"
                value={formData.parties.respondent}
                onChange={e => setFormData({...formData, parties: {...formData.parties, respondent: e.target.value}})}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="closed">Closed</option>
              </select>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}