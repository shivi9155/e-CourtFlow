import { useState, useEffect } from 'react';
import { fetchHearings, createHearing, updateHearing, deleteHearing, fetchCases, fetchJudges } from '../../services/api';
import toast from 'react-hot-toast';

export default function Hearings() {
  const [hearings, setHearings] = useState([]);
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    caseId: '',
    judgeId: '',
    hearingDate: '',
    courtroom: '',
    status: 'scheduled'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [hRes, cRes, jRes] = await Promise.all([
      fetchHearings(),
      fetchCases(),
      fetchJudges()
    ]);

    setHearings(hRes.data);
    setCases(cRes.data);
    setJudges(jRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHearing(editingId, form);
        toast.success('Hearing updated');
      } else {
        await createHearing(form);
        toast.success('Hearing created');
      }

      setEditingId(null);
      setForm({
        caseId: '',
        judgeId: '',
        hearingDate: '',
        courtroom: '',
        status: 'scheduled'
      });

      loadData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (h) => {
    setEditingId(h._id);
    setForm({
      caseId: h.caseId?._id,
      judgeId: h.judgeId?._id,
      hearingDate: h.hearingDate?.slice(0, 10),
      courtroom: h.courtroom,
      status: h.status
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await deleteHearing(id);
      toast.success('Deleted');
      loadData();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Hearings</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">

        <select className="border p-2 mr-2"
          value={form.caseId}
          onChange={e => setForm({...form, caseId: e.target.value})}
          required>
          <option value="">Select Case</option>
          {cases.map(c => (
            <option key={c._id} value={c._id}>{c.caseNumber}</option>
          ))}
        </select>

        <select className="border p-2 mr-2"
          value={form.judgeId}
          onChange={e => setForm({...form, judgeId: e.target.value})}
          required>
          <option value="">Select Judge</option>
          {judges.map(j => (
            <option key={j._id} value={j._id}>{j.name}</option>
          ))}
        </select>

        <input type="date"
          className="border p-2 mr-2"
          value={form.hearingDate}
          onChange={e => setForm({...form, hearingDate: e.target.value})}
          required />

        <input className="border p-2 mr-2"
          placeholder="Courtroom"
          value={form.courtroom}
          onChange={e => setForm({...form, courtroom: e.target.value})}
          required />

        <select className="border p-2 mr-2"
          value={form.status}
          onChange={e => setForm({...form, status: e.target.value})}>
          <option value="scheduled">Scheduled</option>
          <option value="adjourned">Adjourned</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit"
          className="bg-blue-600 text-white p-2 rounded">
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Case</th>
            <th>Judge</th>
            <th>Date</th>
            <th>Courtroom</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hearings.map(h => (
            <tr key={h._id} className="border-t">
              <td>{h.caseId?.caseNumber}</td>
              <td>{h.judgeId?.name}</td>
              <td>{new Date(h.hearingDate).toLocaleDateString()}</td>
              <td>{h.courtroom}</td>
              <td>{h.status}</td>
              <td>
                <button
                  onClick={() => handleEdit(h)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(h._id)}
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
