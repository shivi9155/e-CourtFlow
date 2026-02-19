import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJudgeById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CaseCard from '../components/CaseCard';
import toast from 'react-hot-toast';

export default function JudgeProfile() {
  const { id } = useParams();
  const [judge, setJudge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJudge = async () => {
      try {
        const { data } = await getJudgeById(id);
        setJudge(data);
      } catch (err) {
        toast.error('Failed to load judge details');
      } finally {
        setLoading(false);
      }
    };
    loadJudge();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!judge) return <div className="container mx-auto p-6 text-center">Judge not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">👨‍⚖️ {judge.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2"><span className="font-bold">📧 Email:</span> {judge.email}</p>
            <p className="mb-2"><span className="font-bold">📞 Phone:</span> {judge.phone}</p>
            <p className="mb-2"><span className="font-bold">🏛️ Court:</span> {judge.court}</p>
          </div>
          <div>
            {judge.specialization && <p className="mb-2"><span className="font-bold">🎓 Specialization:</span> {judge.specialization}</p>}
            <p className="mb-2"><span className="font-bold">⏱️ Experience:</span> {judge.experience} years</p>
            <p className="mb-2">
              <span className={`px-4 py-2 rounded font-bold ${
                judge.availabilityStatus === 'available' ? 'bg-green-200 text-green-800' :
                judge.availabilityStatus === 'busy' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                Status: {judge.availabilityStatus.charAt(0).toUpperCase() + judge.availabilityStatus.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">📋 Assigned Cases ({judge.assignedCases?.length || 0})</h2>
        
        {judge.assignedCases && judge.assignedCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {judge.assignedCases.map(caseItem => (
              <CaseCard key={caseItem._id} caseItem={caseItem} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">No assigned cases</p>
        )}
      </div>
    </div>
  );
}
