import { useState } from 'react';
import { searchCases } from '../services/api';
import CaseCard from '../components/CaseCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#2C3E50] text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Courthouse" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50] to-[#2C3E50]/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4 text-white">
              CASE SEARCH
            </h1>
            <p className="text-xl text-[#C5A059] font-light mb-6">
              Find cases by ID, number, parties, or judge
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#C5A059]">Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-[#F8F5F0] p-8 border border-[#E8E0D5]">
            <h2 className="text-2xl font-light text-[#2C3E50] mb-6">Search Cases</h2>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Case ID, Case Number, Plaintiff, Defendant, or Judge Name..."
                    className="w-full p-4 bg-white border border-[#E8E0D5] text-[#2C3E50] placeholder-[#5D6D7E] focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                  <p className="text-xs text-[#5D6D7E] mt-2">
                    Enter at least 3 characters for best results
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C5A059] hover:bg-[#8B4513] text-white px-8 py-4 font-medium transition-colors disabled:bg-[#5D6D7E] min-w-[120px]"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-light text-[#2C3E50] mb-2">Search Results</h3>
                <p className="text-[#5D6D7E]">
                  Found <span className="text-[#C5A059] font-medium">{searchResults.length}</span> case{searchResults.length !== 1 ? 's' : ''} matching "{query}"
                </p>
              </div>
              
              {/* Search Tips */}
              <div className="text-right">
                <p className="text-xs text-[#5D6D7E]">Search Tips:</p>
                <p className="text-xs text-[#5D6D7E]">• Use case numbers for exact matches</p>
                <p className="text-xs text-[#5D6D7E]">• Party names are case-insensitive</p>
              </div>
            </div>

            {/* Results Grid */}
            {searchResults.length === 0 ? (
              <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-16 text-center">
                <div className="text-5xl mb-4 text-[#C5A059]">🔍</div>
                <p className="text-xl text-[#2C3E50] font-light mb-2">No cases found</p>
                <p className="text-[#5D6D7E] mb-6">Try adjusting your search terms or browse all cases</p>
                <Link 
                  to="/cases" 
                  className="inline-block bg-[#C5A059] hover:bg-[#8B4513] text-white px-8 py-3 font-medium transition-colors"
                >
                  Browse All Cases
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map(caseItem => (
                    <div key={caseItem._id} className="border border-[#E8E0D5] bg-white hover:shadow-lg transition-shadow">
                      <CaseCard caseItem={caseItem} />
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 text-center">
                  <p className="text-sm text-[#5D6D7E] mb-4">Need more specific results?</p>
                  <button
                    onClick={() => {
                      setQuery('');
                      setSearched(false);
                    }}
                    className="text-[#C5A059] hover:text-[#8B4513] font-medium transition-colors"
                  >
                    New Search →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Recent Searches / Help Section (shown when no search performed) */}
        {!searched && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-[#C5A059] text-5xl mb-4">⚖️</div>
            <h3 className="text-2xl font-light text-[#2C3E50] mb-4">Case Law Search</h3>
            <p className="text-[#5D6D7E] mb-8">
              Search our comprehensive database of court cases by case number, 
              party names, or presiding judge. Our system provides instant access 
              to case details, status, and hearing information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="border border-[#E8E0D5] p-6">
                <p className="text-[#C5A059] text-2xl mb-2">📋</p>
                <p className="text-sm text-[#2C3E50] font-medium mb-2">By Case Number</p>
                <p className="text-xs text-[#5D6D7E]">Search using unique case identifiers</p>
              </div>
              <div className="border border-[#E8E0D5] p-6">
                <p className="text-[#C5A059] text-2xl mb-2">👥</p>
                <p className="text-sm text-[#2C3E50] font-medium mb-2">By Party Name</p>
                <p className="text-xs text-[#5D6D7E]">Find cases by plaintiff or defendant</p>
              </div>
              <div className="border border-[#E8E0D5] p-6">
                <p className="text-[#C5A059] text-2xl mb-2">👨‍⚖️</p>
                <p className="text-sm text-[#2C3E50] font-medium mb-2">By Judge</p>
                <p className="text-xs text-[#5D6D7E]">Browse cases by presiding judge</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[#E8E0D5]">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#5D6D7E]">
              © 2016-2021 All Rights Reserved | Law Agency Case Management
            </p>
            <p className="text-xs text-[#5D6D7E]">
              Search powered by E-CourtFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}