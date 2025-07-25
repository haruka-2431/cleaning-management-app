import "./css/style.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate, 
  useLocation
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import ManagerSelect from "./pages/ManagerSelect";
import CleanSelect from "./pages/CleanSelect";
import Checklist from "./pages/CheckList";
import Reportlist from "./pages/ReportList";
import CleaningEdit from "./pages/CleaningEdit";
import List from "./pages/List";
import Opening from './pages/Opening';

// Router内でLocalStorage処理を行うコンポーネント
const RouterEffect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('cleaning-manager-user');
    
    if (savedUser && location.pathname === '/manager-select') {
      const userSelection = JSON.parse(savedUser);
      const targetPath = userSelection.userType === 'admin' ? '/admin' : '/worker';
      navigate(targetPath, { replace: true });
    }
  }, [location, navigate]);

  return null; 
};

const App = () => {
  const [title, setTitle] = useState<string>("");
  const [showOpening, setShowOpening] = useState<boolean>(true);

  const handleOpeningComplete = () => {
    setShowOpening(false);
  };

  if (showOpening) {
    return <Opening onComplete={handleOpeningComplete} />;
  }

  return (
    <AuthProvider>
      <Router>
        <RouterEffect />
        <Routes>
          <Route path="/" element={<Navigate to="/manager-select" />} />
          <Route path="/manager-select" element={<ManagerSelect />} />
          <Route
            path="/worker"
            element={
              <ProtectedRoute allowedRoles={["worker"]}>
                <CleanSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/Checklist"
            element={
              <ProtectedRoute allowedRoles={["worker"]}>
                <Checklist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reportlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cleaning-edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CleaningEdit title={title} setTitle={setTitle} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cleaning-edit/:type"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <List title={title} setTitle={setTitle} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/manager-select" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;