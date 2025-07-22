import "./css/style.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CleaningEdit from "./pages/CleaningEdit";
import List from "./pages/List";

const App = () => {
  const [title, setTitle] = useState<string>("");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />}/>
        <Route path="/admin" element={<CleaningEdit title={title} setTitle={setTitle} />} />
        <Route path="/admin/:type" element={<List title={title} setTitle={setTitle} />} />
      </Routes>
    </Router>
  );
};

export default App;