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
import Checklist from "./pages/Checklist";

import ReportList from "./pages/Reportlist";
import CleaningEdit from "./pages/CleaningEdit";
import List from "./pages/List";

const App = () => {
  const [title, setTitle] = useState<string>("");

  return (
    <AuthProvider>
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
                <ReportList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adimn/cleaning-edit"
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
