import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Results from "./pages/Results";
import Practice from "./pages/Practice";
import Assessments from "./pages/Assessments";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";

// Layout
import AppShell from "./components/AppShell";

import TestChecklist from "./pages/TestChecklist";
import ShipPage from "./pages/ShipPage";
import ProofPage from "./pages/ProofPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Test & Ship routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/proof" element={<ProofPage />} />
        <Route path="/prp/08-ship" element={<ShipPage />} />

        {/* Protected / Layout */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/results" element={<Results />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
