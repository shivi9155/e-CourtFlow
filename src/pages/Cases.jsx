import { useState, useEffect } from 'react';
import { getAllCases } from '../services/api';
import CaseCard from '../components/CaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadCases = async () => {
      try {
        const { data } = await getAllCases();
        setCases(data);
      } catch (err) {
        toast.error('Failed to load cases');
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const filteredCases = filter === 'All' ? cases : cases.filter(c => c.status === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">All Cases</h1>
      
      <div className="mb-6 flex gap-4 justify-center flex-wrap">
        {['All', 'Pending', 'Ongoing', 'Closed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded transition ${
              filter === status
                ? 'btn-primary'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredCases.length === 0 ? (
        <p className="text-center muted text-lg">No cases found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(caseItem => (
            <div key={caseItem._id} className="card p-4 rounded-lg">
              <CaseCard caseItem={caseItem} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
