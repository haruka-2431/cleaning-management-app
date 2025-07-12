import "./css/style.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import CleaningEdit from "./pages/CleaningEdit";
import List from "./pages/List";

const App = () => {
  const [title, setTitle] = useState<string>("編集画面");

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header title={title}/>
        <Routes>
          <Route path="/cleaning-edit" element={<CleaningEdit setTitle={setTitle}/>} />
          <Route path="/cleaning-edit/:type" element={<List setTitle={setTitle}/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;