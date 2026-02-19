import { useState, useEffect } from 'react';
import { getAllJudges } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Judges() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJudges = async () => {
      try {
        const { data } = await getAllJudges();
        setJudges(data);
      } catch (err) {
        toast.error('Failed to load judges');
      } finally {
        setLoading(false);
      }
    };
    loadJudges();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-12 text-center">👩‍⚖️ Our Judges</h1>

      {judges.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No judges found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {judges.map(judge => (
            <div key={judge._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{judge.name}</h3>
              <p className="text-gray-600 mb-1">📧 {judge.email}</p>
              <p className="text-gray-600 mb-1">📞 {judge.phone}</p>
              <p className="text-gray-600 mb-1">🏛️ {judge.court}</p>
              {judge.specialization && <p className="text-gray-600 mb-1">🎓 {judge.specialization}</p>}
              <p className="text-gray-600 mb-4">⏱️ {judge.experience} years of experience</p>
              
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  judge.availabilityStatus === 'available' ? 'bg-green-200 text-green-800' :
                  judge.availabilityStatus === 'busy' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {judge.availabilityStatus.charAt(0).toUpperCase() + judge.availabilityStatus.slice(1)}
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                📋 <span className="font-bold">{judge.assignedCases?.length || 0}</span> active cases
              </p>

              <Link
                to={`/judge/${judge._id}`}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-center block"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
