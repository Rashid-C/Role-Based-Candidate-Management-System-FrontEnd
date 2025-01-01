import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout/index";
import Navbar from "./components/common/Navbar";

import AdminLogin from "./pages/auth/AdminLogin";
import CandidateLogin from "./pages/auth/CandidateLogin";

import AdminDashboard from "./pages/admin/Dashboard";
import CandidateList from "./pages/admin/CandidateList";
import CreateCandidate from "./pages/admin/CreateCandidate";

import CandidateProfile from "./pages/candidate/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="candidates" element={<CandidateList />} />
                    <Route
                      path="candidates/create"
                      element={<CreateCandidate />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidate/*"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <Layout>
                  <Routes>
                    <Route path="profile" element={<CandidateProfile />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
