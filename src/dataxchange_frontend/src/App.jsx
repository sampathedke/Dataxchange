import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { UserContext } from "./context/UserContext";
import RequireAuth from "./routes/RequireAuth";

// Page Components
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ExplorePage from "./pages/ExplorePage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import MyRequestsPage from "./pages/MyRequestsPage";
import MyUploadsPage from "./pages/MyUploadsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ContactPage from "./pages/ContactPage";
import DatasetDetailPage from "./pages/DatasetDetailPage";
import AdminApprovalPage from "./pages/AdminApprovalPage";

// UI Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AnimatePresence, motion } from "framer-motion"; // Import motion
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const { loading } = useContext(UserContext);
  const location = useLocation(); // Initialize useLocation hook

  if (loading) return <div className="loading-screen">⏳ Checking session...</div>;

  return (
    <main>
      <div className="app-wrapper">
        <Navbar />
        <div className="page-content">
          {/*
            AnimatePresence wraps the Routes.
            - mode="wait": Ensures the exiting component finishes animating before the new one enters.
            - initial={false}: Prevents an initial animation on the first mount of the app.
          */}
          <AnimatePresence mode="wait" initial={false}>
            {/*
              Routes component needs the 'location' prop and a 'key' prop.
              The 'key' prop (location.pathname) tells AnimatePresence that
              the content within Routes is changing when the URL path changes,
              triggering the exit/enter animations.
            */}
            <Routes location={location} key={location.pathname}>
              {/*
                Each Route's 'element' prop should wrap the page component
                in a 'motion.div' (or other motion component).
                The 'key' on the motion.div should be unique for that route path.
                The 'initial', 'animate', and 'exit' props define the animation states.
              */}
              <Route path="/" element={
                <motion.div
                  key="/" // Unique key for this route
                  initial={{ opacity: 0, x: -50 }} // Start slightly to the left, invisible
                  animate={{ opacity: 1, x: 0 }}   // Slide in and become visible
                  exit={{ opacity: 0, x: 50 }}     // Slide out to the right, invisible
                  transition={{ duration: 0.3 }}   // Animation duration
                  className="page-transition-wrapper" // Optional: for consistent styling
                >
                  <LandingPage />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div
                  key="/about"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <AboutPage />
                </motion.div>
              } />

              {/* Protected Routes - Wrap RequireAuth and its children in motion.div */}
              <Route path="/explore" element={
                <motion.div
                  key="/explore"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><ExplorePage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/upload" element={
                <motion.div
                  key="/upload"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><UploadPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/profile" element={
                <motion.div
                  key="/profile"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><ProfilePage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/myrequests" element={
                <motion.div
                  key="/myrequests"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><MyRequestsPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/myuploads" element={
                <motion.div
                  key="/myuploads"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><MyUploadsPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/categories/:cat" element={
                <motion.div
                  key={location.pathname} // Use location.pathname for dynamic routes
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><CategoriesPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/dataset/:id" element={
                <motion.div
                  key={location.pathname} // Use location.pathname for dynamic routes
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><DatasetDetailPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/admin/requests/:id" element={
                <motion.div
                  key={location.pathname} // Use location.pathname for dynamic routes
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <RequireAuth><AdminApprovalPage /></RequireAuth>
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div
                  key="/contact"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <ContactPage />
                </motion.div>
              } />

              {/* Default redirect - also wrap in motion.div if you want it to animate */}
              <Route path="*" element={
                <motion.div
                  key="not-found" // Unique key for the fallback route
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition-wrapper"
                >
                  <Navigate to="/" replace />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
        {/* ToastContainer should typically be outside AnimatePresence to avoid being animated */}
        <ToastContainer position="top-right" autoClose={4000} />
        <Footer />
      </div>
    </main>
  );
}