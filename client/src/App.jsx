import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import LoadingSpinner from './components/shared/LoadingSpinner';
import RedirectAuthenticatedUser from './components/auth/RedirectAuthenticatedUser';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedLayout from './components/auth/ProtectedLayout';
import Home from './pages/Home';
import About from './pages/About';
import Exhibits from './pages/Exhibits';
import Archive from './pages/Archive';
import ExhibitDetails from './pages/ExhibitDetails';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CreateExhibit from './pages/admin/CreateExhibit';
import Profile from './pages/private/Profile';
import NotFound from './pages/private/NotFound';

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC PAGES START */}
        <Route
          path='/'
          element={
            <>
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            </>
          }
        />
        <Route
          path='/about'
          element={
            <>
              <ProtectedLayout>
                <About />
              </ProtectedLayout>
            </>
          }
        />
        <Route
          path='/exhibits'
          element={
            <>
              <ProtectedLayout>
                <Exhibits />
              </ProtectedLayout>
            </>
          }
        />
        <Route
          path='/exhibits/archive'
          element={
            <>
              <ProtectedLayout>
                <Archive />
              </ProtectedLayout>
            </>
          }
        />
        <Route
          path='/exhibits/:id'
          element={
            <>
              <ProtectedLayout>
                <ExhibitDetails />
              </ProtectedLayout>
            </>
          }
        />
        {/* PUBLIC PAGES END */}

        {/* AUTH PAGES START */}
        <Route
          path='/signup'
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/verify-email/:email'
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/reset-password/:token/:email'
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />
        {/* AUTH PAGES END */}

        {/* ADMIN PAGES START */}
        <Route
          path='/admin/create-exhibit'
          element={
            <AdminRoute>
              <AuthLayout>
                <CreateExhibit />
              </AuthLayout>
            </AdminRoute>
          }
        />
        {/* ADMIN PAGES END */}

        {/* PRIVATE PAGES START */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={
            <ProtectedLayout>
              <NotFound />
            </ProtectedLayout>
          }
        />
        {/* PRIVATE PAGES END */}
      </Routes>

      <Toaster position='top-center' reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
