import "./css/style.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

const App = () => {
  const [title, setTitle] = useState<string>("");
  const [showOpening, setShowOpening] = useState<boolean>(true);

  const handleOpeningComplete = () => {
    setShowOpening(false);
  };

  return (
    <AuthProvider>
      {showOpening ? (
        <Opening onComplete={handleOpeningComplete} />
      ) : (
        <Router>
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
      )}
    </AuthProvider>
  );
};

export default App;