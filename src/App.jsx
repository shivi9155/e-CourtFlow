import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import CaseDetail from './pages/CaseDetail';
import Cases from './pages/Cases';
import Search from './pages/Search';
import Judges from './pages/Judges';
import JudgeProfile from './pages/JudgeProfile';
import JudgeSearch from './pages/JudgeSearch';
import Court from './pages/Court';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminCases from './pages/Admin/Cases';
import AddCase from './pages/Admin/AddCase';
import AddJudge from './pages/Admin/AddJudge';
import AdminJudges from './pages/Admin/Judges';
import Hearings from './pages/Admin/Hearings';
import ScheduleHearing from './pages/Admin/ScheduleHearing';
import Reports from './pages/Admin/Reports';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Toaster position="top-right" />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/case/:id" element={<CaseDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/judges" element={<Judges />} />
          <Route path="/judge/:id" element={<JudgeProfile />} />
          <Route path="/judge-search" element={<JudgeSearch />} />
          <Route path="/court" element={<Court />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/cases" element={<PrivateRoute><AdminCases /></PrivateRoute>} />
          <Route path="/admin/cases/new" element={<PrivateRoute><AddCase /></PrivateRoute>} />
          <Route path="/admin/judges" element={<PrivateRoute><AdminJudges /></PrivateRoute>} />
          <Route path="/admin/add-judge" element={<PrivateRoute><AddJudge /></PrivateRoute>} />
          <Route path="/admin/hearings" element={<PrivateRoute><Hearings /></PrivateRoute>} />
          <Route path="/admin/hearings/schedule" element={<PrivateRoute><ScheduleHearing /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;