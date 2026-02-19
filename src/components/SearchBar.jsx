import { useState } from 'react';
import { searchCases } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchCases(query);
      if (data.length === 1) {
        navigate(`/case/${data[0]._id}`);
      } else if (data.length > 0) {
        navigate('/search', { state: { results: data } });
      } else {
        toast.error('No cases found');
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Search failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by Case Number, Party, or Advocate"
        className="w-full p-4 pr-12 text-lg border-2 rounded-full focus:outline-none focus:ring-2 transition shadow-lg"
        style={{ borderColor: '#F26522', focusRingColor: '#F26522' }}
      />
      <button
        type="submit"
        disabled={loading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
        style={{ backgroundColor: '#F26522' }}
      >
        {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
      </button>
    </form>
  );
}