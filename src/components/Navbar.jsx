import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold flex items-center gap-2">
            E-CourtFlow
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link to="/" className={`hover:opacity-80 transition ${isActive('/') ? 'opacity-100 font-bold' : ''}`}>Home</Link>
            <Link to="/cases" className={`hover:opacity-80 transition ${isActive('/cases') ? 'opacity-100 font-bold' : ''}`}>Cases</Link>
            <Link to="/search" className={`hover:opacity-80 transition ${isActive('/search') ? 'opacity-100 font-bold' : ''}`}>Search</Link>
            <Link to="/court" className={`hover:opacity-80 transition ${isActive('/court') ? 'opacity-100 font-bold' : ''}`}>Court</Link>
            <Link to="/judges" className={`hover:opacity-80 transition ${isActive('/judges') ? 'opacity-100 font-bold' : ''}`}>Judges</Link>
            <Link to="/judge-search" className={`hover:opacity-80 transition ${isActive('/judge-search') ? 'opacity-100 font-bold' : ''}`}>Judge Search</Link>

            {admin && (
              <>
                <Link to="/admin" className={`hover:opacity-80 transition ${isActive('/admin') ? 'opacity-100 font-bold' : ''}`}>📊 Dashboard</Link>
                <button 
                  onClick={logout}
                  className="btn-ghost px-4 py-2 rounded transition font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            )}
            <button onClick={toggle} className="ml-4 p-2 text-sm rounded bg-white text-black" title="Toggle theme">{theme === 'dark' ? 'Light' : 'Dark'}</button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 muted-bg rounded-lg-smooth">
            <Link to="/" className="block py-2 px-4 hover:opacity-80 rounded">Home</Link>
            <Link to="/cases" className="block py-2 px-4 hover:opacity-80 rounded">Cases</Link>
            <Link to="/search" className="block py-2 px-4 hover:opacity-80 rounded">Search</Link>
            <Link to="/court" className="block py-2 px-4 hover:opacity-80 rounded">Court</Link>
            <Link to="/judges" className="block py-2 px-4 hover:opacity-80 rounded">Judges</Link>
            <Link to="/judge-search" className="block py-2 px-4 hover:opacity-80 rounded">Judge Search</Link>
            {admin && (
              <>
                <Link to="/admin" className="block py-2 px-4 hover:opacity-80 rounded">📊 Dashboard</Link>
                <button 
                  onClick={logout}
                  className="w-full text-left btn-ghost py-2 px-4 rounded hover:opacity-90"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}