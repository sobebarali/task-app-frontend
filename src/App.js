import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TaskApp from "./pages/TaskApp";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskApp />} />
      </Routes>
    </div>
  );
}

export default App;
