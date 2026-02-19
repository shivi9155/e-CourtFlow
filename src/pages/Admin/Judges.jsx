import { useState, useEffect } from 'react';
import { fetchJudges, createJudge, updateJudge, deleteJudge } from '../../services/api';
import toast from 'react-hot-toast';

export default function Judges() {
  const [judges, setJudges] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    court: '',
    experience: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadJudges();
  }, []);

  const loadJudges = async () => {
    const { data } = await fetchJudges();
    setJudges(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateJudge(editingId, form);
        toast.success('Judge updated');
      } else {
        await createJudge(form);
        toast.success('Judge created');
      }

      setForm({ name: '', email: '', court: '', experience: '' });
      setEditingId(null);
      loadJudges();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (j) => {
    setEditingId(j._id);
    setForm({
      name: j.name,
      email: j.email,
      court: j.court,
      experience: j.experience
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteJudge(id);
      toast.success('Deleted');
      loadJudges();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Judges</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <input className="border p-2 mr-2" placeholder="Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} required />

        <input className="border p-2 mr-2" placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} required />

        <input className="border p-2 mr-2" placeholder="Court"
          value={form.court}
          onChange={e => setForm({...form, court: e.target.value})} required />

        <input className="border p-2 mr-2" placeholder="Experience (years)"
          value={form.experience}
          onChange={e => setForm({...form, experience: e.target.value})} required />

        <button type="submit"
          className="bg-blue-600 text-white p-2 rounded">
          {editingId ? 'Update' : 'Create'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '', email: '', court: '', experience: '' });
            }}
            className="ml-2 bg-gray-500 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Court</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {judges.map(j => (
            <tr key={j._id} className="border-t">
              <td className="p-2">{j.name}</td>
              <td>{j.email}</td>
              <td>{j.court}</td>
              <td>{j.experience} yrs</td>
              <td>
                <button
                  onClick={() => handleEdit(j)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(j._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
