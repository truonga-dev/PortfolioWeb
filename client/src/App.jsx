import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';

const Home = lazy(() => import('./pages/Home'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const SkillsManager = lazy(() => import('./pages/admin/SkillsManager'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const MessagesManager = lazy(() => import('./pages/admin/MessagesManager'));
const AnalyticsManager = lazy(() => import('./pages/admin/AnalyticsManager'));
const SettingsManager = lazy(() => import('./pages/admin/SettingsManager'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark-950">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="visitors" element={<AnalyticsManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/*" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
    </Router>
  );
}

export default App;