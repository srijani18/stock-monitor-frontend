
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useKeycloak } from "./authentication/KeycloakProvider";
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import './App.css';
import { NavbarComponent } from './components/Navbar';


const App: React.FC = () => {
  const { authenticated, initialized } = useKeycloak();

  if (!initialized) return <div>Loading...</div>;
  if (!authenticated) return <div>Not authenticated</div>;

  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Router>
  );
};

export default App;
