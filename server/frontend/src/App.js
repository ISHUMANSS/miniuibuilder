
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={1000} />
    </div>
  );
}

export default App;
