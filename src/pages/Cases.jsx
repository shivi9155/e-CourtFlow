import { useState, useEffect } from 'react';
import { getAllCases } from '../services/api';
import CaseCard from '../components/CaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb text-white">
              CASES
            </h1>
            <p className="text-xl text-[#C5A059] font-light mb-6">
              Comprehensive case tracking and management
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#C5A059]">All Cases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Header with Stats */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-light text-[#2C3E50] mb-2">All Cases</h2>
            <p className="text-[#5D6D7E]">
              Showing {filteredCases.length} of {cases.length} total cases
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'Ongoing', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-[#C5A059] text-white'
                    : 'bg-[#F8F5F0] text-[#5D6D7E] hover:bg-[#E8E0D5] border border-[#E8E0D5]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="bg-[#F8F5F0] border border-[#E8E0D5] p-12 text-center">
            <p className="text-[#5D6D7E] text-lg mb-4">No cases found</p>
            <p className="text-sm text-[#5D6D7E]">Try adjusting your filter or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map(caseItem => (
              <div key={caseItem._id} className="border border-[#E8E0D5] bg-white hover:shadow-lg transition-shadow">
                <CaseCard caseItem={caseItem} />
              </div>
            ))}
          </div>
        )}

        {/* Practice Areas Navigation */}
        <div className="mt-20 pt-12 border-t border-[#E8E0D5]">
          <h3 className="text-xl font-light text-[#2C3E50] mb-6">Explore Practice Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/cases?type=civil" className="group">
              <div className="border border-[#E8E0D5] p-6 hover:border-[#C5A059] transition-colors">
                <h4 className="text-lg font-medium text-[#2C3E50] mb-2 group-hover:text-[#C5A059]">Civil Litigation</h4>
                <p className="text-sm text-[#5D6D7E]">View civil cases →</p>
              </div>
            </Link>
            <Link to="/cases?type=criminal" className="group">
              <div className="border border-[#E8E0D5] p-6 hover:border-[#C5A059] transition-colors">
                <h4 className="text-lg font-medium text-[#2C3E50] mb-2 group-hover:text-[#C5A059]">Criminal Defense</h4>
                <p className="text-sm text-[#5D6D7E]">View criminal cases →</p>
              </div>
            </Link>
            <Link to="/cases?type=employment" className="group">
              <div className="border border-[#E8E0D5] p-6 hover:border-[#C5A059] transition-colors">
                <h4 className="text-lg font-medium text-[#2C3E50] mb-2 group-hover:text-[#C5A059]">Employment Law</h4>
                <p className="text-sm text-[#5D6D7E]">View employment cases →</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-right">
          <p className="text-xs text-[#5D6D7E]">
            © 2016-2021 All Rights Reserved | Case Management System
          </p>
        </div>
      </div>
    </div>
  );
}