
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Briefcase, MessageSquare, Map, FileText, Settings, BarChart, Sun, Moon, LogOut, User as UserIcon, Sparkles, Target } from 'lucide-react';
import Logo from './src/components/Logo';
import { UserProfile } from './types';
import { auth, googleProvider, getUserProfile, saveUserProfile } from './src/services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { isAdmin } from './src/config/adminEmails';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InternshipPortal from './pages/InternshipPortal';
import AdvisorChat from './pages/AdvisorChat';
import PrepPlanner from './pages/PrepPlanner';
import Roadmap from './pages/Roadmap';
import ResumeBuilder from './pages/ResumeBuilder';
import AdminPanel from './pages/AdminPanel';
import ProfileSetup from './pages/ProfileSetup';
import CustomCursor from './src/components/CustomCursor';
import MockInterview from './pages/MockInterview';
import ApplicationTracker from './pages/ApplicationTracker';
import SkillGap from './pages/SkillGap';

// Contexts
const ThemeContext = createContext({ isDark: false, toggle: () => { } });
const UserContext = createContext<{
  user: UserProfile | null,
  login: (u?: UserProfile) => void,
  logout: () => void,
  updateProfile: (u: UserProfile) => void
}>({
  user: null,
  login: () => { },
  logout: () => { },
  updateProfile: () => { }
});

export const useTheme = () => useContext(ThemeContext);
export const useUser = () => useContext(UserContext);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { user, logout } = useUser();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard',  icon: Layout,       label: 'Dashboard' },
    { path: '/internships',icon: Briefcase,     label: 'Opportunities' },
    { path: '/advisor',    icon: MessageSquare, label: 'AI Advisor' },
    { path: '/planner',    icon: Settings,      label: 'Prep Planner' },
    { path: '/roadmap',    icon: Map,           label: 'Skill Roadmap' },
    { path: '/resume',     icon: FileText,      label: 'Resume Builder' },
    { path: '/interview',  icon: Sparkles,      label: 'Mock Interview' },
    { path: '/tracker',   icon: BarChart,       label: 'Job Tracker' },
    { path: '/skillgap',  icon: Target,         label: 'Skill Gap' },
  ];

  if (user && isAdmin(user.email)) {
    navItems.push({ path: '/admin', icon: BarChart, label: 'Admin Panel' });
  }

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/profile-setup') return null;

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 h-screen sticky top-0 flex flex-col transition-all duration-300 relative overflow-hidden">
      
      {/* Geometric Aesthetic Background Animations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-400/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 -left-6 w-20 h-20 border-[8px] border-gray-200/50 dark:border-slate-800/50 rounded-xl rotate-12 animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute bottom-1/4 -right-4 w-12 h-12 border-[4px] border-brand-500/20 rounded-full animate-[bounce_6s_infinite]"></div>
        <div className="absolute top-2/3 left-10 w-8 h-8 bg-brand-500/10 rotate-45 animate-[pulse_4s_infinite]"></div>
      </div>

      <div className="relative z-10 p-8 border-b dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <Link to="/dashboard" className="text-2xl font-black text-brand-600 dark:text-brand-400 flex items-center gap-3 tracking-tighter group">
          <Logo className="w-10 h-10 group-hover:rotate-12 transition-transform duration-500" />
          CareerCompass.AI
        </Link>
      </div>

      <nav className="relative z-10 flex-1 p-6 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group overflow-hidden ${isActive(item.path)
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            {isActive(item.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-600 dark:bg-brand-400 rounded-r-full"></div>
            )}
            <item.icon size={22} className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
            <span className="text-sm tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="relative z-10 p-6 border-t dark:border-slate-800 space-y-6 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex-1 flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 hover:text-brand-600 transition-all font-bold text-xs uppercase tracking-widest"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-300 flex-shrink-0 shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-black truncate dark:text-white tracking-tight">{user?.name || 'Guest'}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.targetRole || 'Explorer'}</p>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>

          {user?.targetRole && (
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
              <Sparkles size={12} className="text-brand-600" />
              <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 uppercase tracking-tighter">AI Optimized</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin(user.email)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          // New user - pre-fill from Google
          setUser({
            name: firebaseUser.displayName || 'Explorer',
            email: firebaseUser.email || '',
            targetRole: '',
            skills: [],
            graduationYear: '',
            currentLevel: 'Beginner',
            avatar: firebaseUser.photoURL || undefined
          });
        }
      } else {
        // Prevent Firebase from clearing our state if we are tracking a local/demo login
        if (!localStorage.getItem('mock_user')) {
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (u?: UserProfile) => {
    // If a profile is passed (dev/mock), use it. Otherwise trigger Google Auth.
    if (u) {
      setUser(u);
      localStorage.setItem('mock_user', JSON.stringify(u));
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('mock_user');
    localStorage.clear();
  };

  const updateProfile = async (u: UserProfile) => {
    if (auth.currentUser) {
      await saveUserProfile(auth.currentUser.uid, u);
    } else {
      localStorage.setItem('mock_user', JSON.stringify(u));
    }
    setUser(u);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile }}>
      <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(!isDark) }}>
        <Router>
          <CustomCursor />
          <div className="flex min-h-screen transition-colors">
            <Sidebar />
            <main className="flex-1 bg-graph-pattern bg-gray-50 dark:bg-slate-950 overflow-auto scroll-smooth">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/internships" element={<ProtectedRoute><InternshipPortal /></ProtectedRoute>} />
                <Route path="/advisor" element={<ProtectedRoute><AdvisorChat /></ProtectedRoute>} />
                <Route path="/planner" element={<ProtectedRoute><PrepPlanner /></ProtectedRoute>} />
                <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                <Route path="/resume"     element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                <Route path="/admin"      element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/interview"  element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
                <Route path="/tracker"    element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
                <Route path="/skillgap"   element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
