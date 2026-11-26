import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AppLayout } from './components/layout/AppLayout';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { EnvironmentSetup } from './pages/EnvironmentSetup';
import { MidtermExam } from './pages/MidtermExam';
import { FinalExam } from './pages/FinalExam';
import { SessionGuide } from './pages/SessionGuide';
import { WeekOverview } from './pages/WeekOverview';
import { PrivateMenu } from './pages/PrivateMenu';
import { useParams } from 'react-router-dom';

const PrivateSession = () => {
  const { id } = useParams<{ id: string }>();
  return <SessionGuide key={id} privateId={id} />;
};
import { standaloneSessions } from './data/curriculum';
import '@cloudscape-design/global-styles/index.css';
import './styles/theme.css';
import './styles/responsive.css';
import './styles/components.css';
import './styles/app-layout.css';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // 페이지 이동 시 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  // 홈 페이지는 AppLayout 없이 렌더링
  if (location.pathname === '/') {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </>
    );
  }

  // 다른 페이지들은 AppLayout과 함께 렌더링
  return (
    <>
      <div className="app-content-wrapper">
        <AppLayout currentPath={currentPath} onNavigate={handleNavigate}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setup" element={<EnvironmentSetup />} />
            <Route path="/week/:weekNumber" element={<WeekOverview />} />
            <Route
              path="/week/:weekNumber/session/:sessionNumber"
              element={<SessionGuide />}
            />
            {standaloneSessions.map(({ week, session, path }) => (
              <Route
                key={path}
                path={path}
                element={<SessionGuide fixedWeek={week} fixedSession={session.session} />}
              />
            ))}
            {standaloneSessions.map(({ week, session, path }) => (
              <Route
                key={`old-${path}`}
                path={`/week/${week}/session/${session.session}`}
                element={<Navigate to={path} replace />}
              />
            ))}
            <Route path="/private-menu" element={<PrivateMenu />} />
            <Route path="/private/:id" element={<PrivateSession />} />
            <Route path="/midterm" element={<MidtermExam />} />
            <Route path="/final" element={<FinalExam />} />
          </Routes>
        </AppLayout>
      </div>
      <Footer />
    </>
  );
}

function App() {
  // Vite 환경 변수: 프로덕션 빌드 시 base 경로 적용
  const basename =
    import.meta.env.MODE === 'production' ? '/chatbot-1' : '/';

  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router
          basename={basename}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
