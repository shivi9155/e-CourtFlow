import { Link } from 'react-router-dom';

export default function CaseCard({ caseItem }) {
  return (
    <div className="border rounded-lg shadow-lg hover:shadow-xl transition p-5 bg-white">
      <div className="mb-3">
        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded">
          {caseItem.caseType || 'General'}
        </span>
        <span className={`text-xs font-bold ml-2 px-3 py-1 rounded ${
          caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          caseItem.status === 'Ongoing' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {caseItem.status}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-blue-900 mb-2">{caseItem.caseNumber}</h3>
      <p className="text-gray-700 font-semibold mb-2">{caseItem.title}</p>
      
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>👤 <span className="font-semibold">Plaintiff:</span> {caseItem.plaintiffName || caseItem.parties?.petitioner}</p>
        <p>👤 <span className="font-semibold">Defendant:</span> {caseItem.defendantName || caseItem.parties?.respondent}</p>
        {caseItem.assignedJudge && (
          <p>⚖️ <span className="font-semibold">Judge:</span> {caseItem.assignedJudge.name || 'Not Assigned'}</p>
        )}
      </div>

      <Link 
        to={`/case/${caseItem._id}`} 
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-bold"
      >
        📋 View Details →
      </Link>
    </div>
  );
}