import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/common";
import ScrollToTop from "./components/ScrollToTop";
import { PolicyProvider } from "./context/PolicyContext";
import { AuthProvider } from "./context/AuthContext";
import LoadingFallback from "./components/common/LoadingFallback";
import { ProtectedRoute } from "./components/auth";
import MainLayout from "./layouts/MainLayout";
import { publicRoutes } from "./routes";
import "./styles/common.css";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PolicyProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {publicRoutes}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </PolicyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
