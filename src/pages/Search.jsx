import { useState } from 'react';
import { searchCases } from '../services/api';
import CaseCard from '../components/CaseCard';
import toast from 'react-hot-toast';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const { data } = await searchCases(query);
      setSearchResults(data);
      setSearched(true);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">🔍 Search Cases</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Case ID, Case Number, Plaintiff, Defendant, or Judge Name..."
            className="flex-1 p-4 border-2 rounded focus:outline-none"
            style={{ borderColor: '#ccc' }}
            onFocus={(e) => e.target.style.borderColor = '#F26522'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white px-8 py-4 rounded hover:opacity-90 transition disabled:bg-gray-400"
            style={{ backgroundColor: '#F26522' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          <p className="text-center text-gray-600 mb-6">
            Found <span className="font-bold" style={{ color: '#F26522' }}>{searchResults.length}</span> result(s)
          </p>
          
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No cases found matching your search</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(caseItem => (
                <CaseCard key={caseItem._id} caseItem={caseItem} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
