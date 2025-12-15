// src/App.jsx

import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter, 
    Routes, 
    Route, 
    useNavigate, 
    Navigate 
} from 'react-router-dom';

// Import the separate context and hook file
// Assuming AuthContext and useAuth are defined in src/hooks/useAuth.js
import { AuthContext, useAuth } from './hooks/useAuth';

// Import Supabase client
// Path is relative to src/
import { supabase } from './supabaseClient.js'; 

// Import core page components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage'; 

// Import page components from the NEW structure: components/pages/
import DashboardPage from './components/pages/Dashboard.jsx'; 
import ProjectFeedPage from './components/pages/Discover.jsx'; 
import CreateProjectPage from './components/pages/CreateProject.jsx'; 
import ProjectDetailPage from './components/pages/ProjectDetail.jsx'; 
import UserProfilePage from './components/pages/UserProfile.jsx';
import NotificationsPage from './components/pages/Notifications.jsx'; 
import SettingsPage from './components/pages/Settings.jsx'; 

// --- NEW IMPORTS ---
import BookmarksPage from './components/pages/BookmarksPage';
import AnalyticsPage from './components/pages/AnalyticsPage.jsx';
// -------------------


// --- 2. Auth Provider Component (Handles Session Management) ---
const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Fetch initial session status
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false); // Done loading initial session
        });

        // 2. Set up listener for auth state changes (This handles redirects)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    // Redirect from auth page after successful login
                    if (window.location.pathname.includes('/auth')) {
                        navigate('/dashboard');
                    }
                }
                if (event === 'SIGNED_OUT') {
                    // Redirect to home after logout
                    navigate('/');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate]);

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Supabase Logout error:', error);
    };

    const value = {
        session,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div 
                    style={{ 
                        height: '100vh', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        color: 'var(--color-text, white)', 
                        backgroundColor: 'var(--color-background, #111827)',
                        fontSize: '1.5rem'
                    }}
                >
                    <p>Loading Authentication...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};


// --- 3. Protected Route Wrapper Component ---
const ProtectedRoute = ({ element: Component }) => {
    const { session, loading } = useAuth();
    
    // Show nothing while loading auth state
    if (loading) return false; 
    
    // Redirect to login/auth if no session is found
    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    // Render the component if authenticated
    return Component;
};


// --- 4. Main App Content Component with Routes ---
const AppContent = () => {
    return (
        <Routes>
            {/* Public and Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes (Require Login) */}
            <Route 
                path="/dashboard" 
                element={<ProtectedRoute element={<DashboardPage />} />} 
            />
            <Route 
                path="/feed" 
                element={<ProtectedRoute element={<ProjectFeedPage />} />} 
            />
            <Route 
                path="/create" 
                element={<ProtectedRoute element={<CreateProjectPage />} />} 
            />
            <Route 
                path="/notifications" 
                element={<ProtectedRoute element={<NotificationsPage />} />} 
            />
            <Route 
                path="/settings" 
                element={<ProtectedRoute element={<SettingsPage />} />}
            />
            <Route 
                path="/bookmarks" 
                element={<ProtectedRoute element={<BookmarksPage />} />} 
            />
            <Route 
                path="/analytics" 
                element={<ProtectedRoute element={<AnalyticsPage />} />} 
            />
            {/* ----------------------------- */}

            {/* Public/Dynamic Routes */}
            <Route 
                path="/p/:username/:slug" 
                element={<ProjectDetailPage />} 
            />
            <Route 
                path="/u/:username" 
                element={<UserProfilePage />} 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

// --- 5. Exporting Main App Component ---
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}