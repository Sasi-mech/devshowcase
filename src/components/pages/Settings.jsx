// src/components/pages/Settings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, FiMessageSquare,
    FiTrendingUp, FiActivity, FiHeart, FiCode, FiBookmark, FiUsers,
    FiChevronRight, FiZap, FiAward, FiCalendar, FiBarChart2,
    FiMail, FiLock, FiGlobe, FiMoon, FiTrash2, FiSave, FiAlertCircle,
    FiCheckCircle, FiEdit2, FiEye, FiEyeOff, FiShield, FiDatabase,
    FiCamera, FiImage, FiUploadCloud, FiXCircle
} from 'react-icons/fi';

// --- Custom CSS for Settings (Same as Dashboard) ---
const settingsStyles = `
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    
    .dashboard-gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 8s ease infinite;
    }
    
    .dashboard-glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dashboard-card-hover {
        transition: all 0.3s ease;
    }
    
    .dashboard-card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .sidebar-gradient-bg {
        background: linear-gradient(180deg, rgba(15, 15, 25, 0.95) 0%, rgba(30, 30, 50, 0.95) 100%);
        backdrop-filter: blur(20px);
    }
    
    .nav-item-hover:hover {
        background: rgba(102, 126, 234, 0.1);
        border-left: 3px solid #667eea;
        transform: translateX(5px);
    }
    
    .settings-input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .settings-input:focus {
        background: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(102, 126, 234, 0.5) !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
`;

// --- Configuration (Same as Dashboard) ---
const SIDEBAR_EXPANDED_WIDTH = '280px';
const SIDEBAR_CONTRACTED_WIDTH = '90px';
const HEADER_HEIGHT = '80px';

// --- Button Styles (Same as Dashboard) ---
const primaryButtonStyle = { 
    padding: '0.75rem 1.5rem', 
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
};

const secondaryButtonStyle = { 
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    background: 'transparent',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    color: 'var(--color-text)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
};

// --- NavLink Component (Same as Dashboard) ---
const NavLink = ({ to, icon: Icon, text, isExpanded, isActive = false, badge }) => (
    <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
    >
        <Link 
            to={to} 
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1.25rem',
                borderRadius: '0.75rem',
                background: isActive ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                color: isActive ? '#667eea' : 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                position: 'relative',
                borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                margin: '0.25rem 0',
            }}
            className="nav-item-hover"
        >
            <Icon style={{ 
                minWidth: '1.5rem', 
                height: '1.5rem', 
                color: isActive ? '#667eea' : 'var(--color-primary)',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.5))' : 'none'
            }} />
            {isExpanded && (
                <>
                    <span style={{ 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap',
                        fontSize: '0.95rem'
                    }}>
                        {text}
                    </span>
                    {badge && (
                        <span style={{
                            marginLeft: 'auto',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem',
                            fontWeight: '600',
                        }}>
                            {badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    </motion.div>
);

// --- Settings Section Component ---
const SettingsSection = ({ title, icon: Icon, children, color = '#667eea' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-glass-effect dashboard-card-hover"
        style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                boxShadow: `0 5px 15px ${color}30`,
            }}>
                <Icon />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                {title}
            </h2>
        </div>
        {children}
    </motion.div>
);

// --- Main Settings Component ---
export default function SettingsPage() {
    const { session, loading: authLoading, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState('settings');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Form states
    const [profileForm, setProfileForm] = useState({
        username: '',
        full_name: '',
        bio: '',
        avatar_url: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        projectUpdates: true,
        upvoteNotifications: true,
        mentionNotifications: true,
        weeklyDigest: false
    });

    const user_id = session?.user?.id;
    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Data Fetching: Profile ---
    useEffect(() => {
        if (!user_id) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, full_name, bio')
                    .eq('id', user_id)
                    .single();

                if (error) throw error;
                setProfile(data);
                setProfileForm({
                    username: data.username || '',
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || ''
                });
                if (data.avatar_url) {
                    setImagePreview(data.avatar_url);
                }
            } catch (err) {
                console.error('Error fetching profile:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user_id]);

    // --- Profile Image Upload Handlers ---
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ 
                type: 'error', 
                text: 'Image size should be less than 5MB' 
            });
            return;
        }

        // Check file type
        if (!file.type.match('image.*')) {
            setMessage({ 
                type: 'error', 
                text: 'Please select an image file' 
            });
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        await uploadImageToSupabase(file);
    };

    const uploadImageToSupabase = async (file) => {
        if (!file || !user_id) return;
        
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user_id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user_id);

            if (updateError) throw updateError;

            // Update local state
            setProfileForm(prev => ({ ...prev, avatar_url: publicUrl }));
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            
            setMessage({ 
                type: 'success', 
                text: 'Profile image updated successfully!' 
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to upload image' 
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async () => {
        setUploading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', user_id);

            if (error) throw error;

            setProfileForm(prev => ({ ...prev, avatar_url: '' }));
            setProfile(prev => ({ ...prev, avatar_url: null }));
            setImagePreview(null);
            
            setMessage({ 
                type: 'success', 
                text: 'Profile image removed' 
            });
        } catch (error) {
            console.error('Error removing image:', error);
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to remove image' 
            });
        } finally {
            setUploading(false);
        }
    };

    // --- Form Handlers ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update(profileForm)
                .eq('id', user_id);

            if (error) throw error;

            setProfile({ ...profile, ...profileForm });
            setMessage({ 
                type: 'success', 
                text: 'Profile updated successfully!' 
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to update profile' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ 
                type: 'error', 
                text: 'New passwords do not match!' 
            });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.newPassword
            });

            if (error) throw error;

            setMessage({ 
                type: 'success', 
                text: 'Password updated successfully!' 
            });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to update password' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion would be processed. In a real app, this would call an API.');
        }
    };

    // --- Animation Styles ---
    const mainContainerStyle = {
        flexGrow: 1,
        marginLeft: currentSidebarWidth,
        padding: '2rem',
        paddingTop: HEADER_HEIGHT,
        minHeight: '100vh',
        background: 'var(--color-background-dark)',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: currentSidebarWidth,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 100,
        padding: '0 2rem',
        background: 'rgba(15, 15, 25, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (authLoading || loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--color-background-dark)',
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '3rem',
                        height: '3rem',
                        border: '3px solid rgba(102, 126, 234, 0.3)',
                        borderTopColor: '#667eea',
                        borderRadius: '50%',
                    }}
                />
            </div>
        );
    }
    
    if (!session) {
        return (
            <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-background-dark)',
                minHeight: '100vh',
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to access settings.</h2>
                <Link to="/auth?mode=login" style={primaryButtonStyle}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
            display: 'flex',
            position: 'relative',
        }}>
            {/* Add CSS styles */}
            <style>{settingsStyles}</style>
            
            {/* Animated background elements */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                animation: 'float 20s ease-in-out infinite',
                zIndex: 0,
            }} />
            
            {/* --- EXACT SAME SIDEBAR AS DASHBOARD --- */}
            <motion.aside
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="sidebar-gradient-bg"
                style={{
                    width: currentSidebarWidth,
                    minWidth: currentSidebarWidth,
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 200,
                    padding: '1.5rem 0',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '20px 0 40px rgba(0, 0, 0, 0.3)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                
                {/* Sidebar Header */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isSidebarExpanded ? 'space-between' : 'center', 
                    padding: '0 1.5rem',
                    marginBottom: '2rem',
                }}>
                    
                    {isSidebarExpanded ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                        >
                            <div style={{ 
                                width: '3rem', 
                                height: '3rem', 
                                borderRadius: '1rem', 
                                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                            }}>
                                <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">DevShowcase</span>
                        </motion.div>
                    ) : (
                        <div style={{ 
                            width: '3rem', 
                            height: '3rem', 
                            borderRadius: '1rem', 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        }}>
                            <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                        </div>
                    )}
                    
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSidebar} 
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.1)', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: 'var(--color-text)',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.5rem',
                            height: '2.5rem',
                        }}
                    >
                        {isSidebarExpanded ? <FiX size={20} /> : <FiMenu size={20} />}
                    </motion.button>
                </div>
                
                {/* User Profile */}
                {isSidebarExpanded && profile && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '1.5rem',
                            margin: '0 1rem 2rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '3.5rem',
                                height: '3.5rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'white',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                            }}>
                                {profile.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt={profile.username}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    profile.username?.charAt(0) || 'U'
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{profile.username}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{profile.full_name || 'Developer'}</div>
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.85rem',
                            color: '#667eea',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <FiStar /> Pro Member
                        </div>
                    </motion.div>
                )}
                
                {/* Navigation Links */}
                <nav style={{ padding: '0 1rem', marginBottom: '2rem' }}>
                    <NavLink 
                        to="/dashboard" 
                        icon={FiHome} 
                        text="Dashboard" 
                        isExpanded={isSidebarExpanded} 
                        isActive={false}
                    />
                    <NavLink 
                        to="/feed" 
                        icon={FiCompass} 
                        text="Discover" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                    />
                    <NavLink 
                        to="/notifications" 
                        icon={FiBell} 
                        text="Notifications" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                        
                    />
                    <NavLink 
                        to={`/u/${profile?.username}`} 
                        icon={FiUser} 
                        text="Profile" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                    />
                    <NavLink 
                        to="/bookmarks" 
                        icon={FiBookmark} 
                        text="Bookmarks" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                    />
                    <NavLink 
                        to="/analytics" 
                        icon={FiBarChart2} 
                        text="Analytics" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                    />
                    <NavLink 
                        to="/settings" 
                        icon={FiSettings} 
                        text="Settings" 
                        isExpanded={isSidebarExpanded}
                        isActive={true}
                    />
                </nav>
                {/* Upload Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{ padding: '0 1rem', marginBottom: '2rem' }}
                >
                    <Link 
                        to="/create" 
                        style={{
                            ...primaryButtonStyle,
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.95rem',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                        }}
                    >
                        <FiUpload /> {isSidebarExpanded && 'Upload Project'}
                    </Link>
                </motion.div>
                
                {/* Footer / Logout */}
                <div style={{ 
                    marginTop: 'auto', 
                    padding: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '0.75rem',
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                            width: '100%',
                        }}
                        onMouseEnter={e => { 
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; 
                            e.currentTarget.style.color = '#ef4444'; 
                        }}
                        onMouseLeave={e => { 
                            e.currentTarget.style.background = 'transparent'; 
                            e.currentTarget.style.color = 'var(--color-text-muted)'; 
                        }}
                    >
                        <FiLogOut style={{ minWidth: '1.5rem', height: '1.5rem' }} />
                        {isSidebarExpanded && <span>Logout</span>}
                    </motion.button>
                </div>
            </motion.aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main style={mainContainerStyle}>
                
                {/* --- HEADER (Same as Dashboard) --- */}
                <header style={headerStyle}>
                    
                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ position: 'relative', flexGrow: 1, maxWidth: '600px' }}
                    >
                        <FiSearch style={{ 
                            position: 'absolute', 
                            left: '1.25rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'var(--color-text-muted)',
                            fontSize: '1.25rem',
                        }} />
                        <input
                            type="text"
                            placeholder="Search settings..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1.25rem 0.875rem 3.5rem',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--color-text)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </motion.div>
                    
                    {/* User Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--color-text)', 
                                cursor: 'pointer',
                                position: 'relative',
                                fontSize: '1.5rem',
                            }}
                        >
                            <FiBell />
                            <span style={{ 
                                position: 'absolute', 
                                top: '-5px', 
                                right: '-5px', 
                                background: '#ef4444', 
                                color: 'white', 
                                borderRadius: '50%', 
                                width: '18px', 
                                height: '18px', 
                                fontSize: '11px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontWeight: 'bold',
                            }}>
                                3
                            </span>
                        </motion.button>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{profile?.username || 'User'}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Pro Member</div>
                            </div>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                color: 'white',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                            }}>
                                {profile?.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt={profile.username}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    profile?.username?.charAt(0) || 'U'
                                )}
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* --- SETTINGS CONTENT --- */}
                <section style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                    
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: '3rem' }}
                    >
                        <h1 style={{ 
                            fontSize: '3rem', 
                            fontWeight: 'bold', 
                            marginBottom: '1rem',
                            lineHeight: '1.2',
                        }}>
                            Account{' '}
                            <span className="dashboard-gradient-text">Settings</span>
                        </h1>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                        }}>
                            Manage your profile, security, and preferences.
                        </p>
                    </motion.div>

                    {/* Message Alert */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '0.75rem',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: message.type === 'success' 
                                    ? 'rgba(34, 197, 94, 0.1)' 
                                    : 'rgba(239, 68, 68, 0.1)',
                                borderLeft: `4px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                            }}
                        >
                            {message.type === 'success' ? (
                                <FiCheckCircle style={{ color: '#22c55e', fontSize: '1.25rem' }} />
                            ) : (
                                <FiAlertCircle style={{ color: '#ef4444', fontSize: '1.25rem' }} />
                            )}
                            <span style={{ 
                                color: message.type === 'success' ? '#22c55e' : '#ef4444',
                                fontWeight: '500',
                            }}>
                                {message.text}
                            </span>
                        </motion.div>
                    )}

                    {/* Settings Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        
                        {/* Left Column: Main Settings */}
                        <div>
                            {/* Profile Settings with Image Upload */}
                            <SettingsSection title="Profile Information" icon={FiUser} color="#667eea">
                                <form onSubmit={handleProfileUpdate}>
                                    {/* Profile Image Upload Section */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '2rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ position: 'relative' }}>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={handleImageClick}
                                                    style={{
                                                        width: '8rem',
                                                        height: '8rem',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        border: '3px solid rgba(102, 126, 234, 0.3)',
                                                    }}
                                                >
                                                    {imagePreview ? (
                                                        <img 
                                                            src={imagePreview} 
                                                            alt="Profile preview"
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                    ) : profile?.avatar_url ? (
                                                        <img 
                                                            src={profile.avatar_url} 
                                                            alt={profile.username}
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                    ) : (
                                                        <FiUser size={40} style={{ color: 'white' }} />
                                                    )}
                                                    
                                                    {uploading && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            background: 'rgba(0, 0, 0, 0.7)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '50%',
                                                        }}>
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                style={{
                                                                    width: '2rem',
                                                                    height: '2rem',
                                                                    border: '3px solid rgba(255, 255, 255, 0.3)',
                                                                    borderTopColor: 'white',
                                                                    borderRadius: '50%',
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Camera icon overlay */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '0.5rem',
                                                        right: '0.5rem',
                                                        width: '2.5rem',
                                                        height: '2.5rem',
                                                        borderRadius: '50%',
                                                        background: 'rgba(0, 0, 0, 0.7)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        border: '2px solid white',
                                                    }}>
                                                        <FiCamera size={16} />
                                                    </div>
                                                </motion.div>
                                                
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                            
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                    Profile Photo
                                                </h3>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                    Click on the avatar to upload a new image. Recommended size: 400x400px. Max 5MB.
                                                </p>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        type="button"
                                                        onClick={handleImageClick}
                                                        disabled={uploading}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '0.5rem',
                                                            background: 'rgba(102, 126, 234, 0.1)',
                                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                                            color: '#667eea',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        <FiUploadCloud /> Upload New
                                                    </motion.button>
                                                    
                                                    {(imagePreview || profile?.avatar_url) && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            type="button"
                                                            onClick={removeImage}
                                                            disabled={uploading}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '0.5rem',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontSize: '0.9rem',
                                                            }}
                                                        >
                                                            <FiXCircle /> Remove
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.username}
                                                onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                                                className="settings-input"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    color: 'var(--color-text)',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.full_name}
                                                onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                                                className="settings-input"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    color: 'var(--color-text)',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                Bio
                                            </label>
                                            <textarea
                                                value={profileForm.bio}
                                                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                                                rows="4"
                                                className="settings-input"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    color: 'var(--color-text)',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    resize: 'vertical',
                                                }}
                                            />
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || uploading}
                                            style={{
                                                ...primaryButtonStyle,
                                                width: '100%',
                                                padding: '1rem',
                                                opacity: (loading || uploading) ? 0.7 : 1,
                                                cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            <FiSave /> Save Profile Changes
                                        </motion.button>
                                    </div>
                                </form>
                            </SettingsSection>

                            {/* Security Settings */}
                            <SettingsSection title="Security & Password" icon={FiLock} color="#ef4444">
                                <form onSubmit={handlePasswordUpdate}>
                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                Current Password
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                                    className="settings-input"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                                        borderRadius: '0.75rem',
                                                        color: 'var(--color-text)',
                                                        fontSize: '1rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                <FiLock style={{
                                                    position: 'absolute',
                                                    left: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--color-text-muted)',
                                                }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--color-text-muted)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                New Password
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                                    className="settings-input"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                                        borderRadius: '0.75rem',
                                                        color: 'var(--color-text)',
                                                        fontSize: '1rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                <FiLock style={{
                                                    position: 'absolute',
                                                    left: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--color-text-muted)',
                                                }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    style={{
                                                        position: 'absolute',
right: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--color-text-muted)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '0.5rem', 
                                                fontWeight: '500',
                                                color: 'var(--color-text-muted)'
                                            }}>
                                                Confirm New Password
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                                    className="settings-input"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                                        borderRadius: '0.75rem',
                                                        color: 'var(--color-text)',
                                                        fontSize: '1rem',
                                                        outline: 'none',
                                                    }}
                                                />
                                                <FiLock style={{
                                                    position: 'absolute',
                                                    left: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: 'var(--color-text-muted)',
                                                }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--color-text-muted)',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                ...primaryButtonStyle,
                                                width: '100%',
                                                padding: '1rem',
                                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                opacity: loading ? 0.7 : 1,
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            <FiSave /> Update Password
                                        </motion.button>
                                    </div>
                                </form>
                            </SettingsSection>
                        </div>

                        {/* Right Column: Preferences & Actions */}
                        <div>
                            {/* Notifications */}
                            <SettingsSection title="Notifications" icon={FiBell} color="#f59e0b">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <div key={key} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </div>
                                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                                    Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                                                </div>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleToggleNotification(key)}
                                                style={{
                                                    width: '3rem',
                                                    height: '1.5rem',
                                                    borderRadius: '0.75rem',
                                                    background: value ? '#22c55e' : '#6b7280',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ x: value ? '1.5rem' : '0.25rem' }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0.25rem',
                                                        width: '1rem',
                                                        height: '1rem',
                                                        borderRadius: '50%',
                                                        background: 'white',
                                                    }}
                                                />
                                            </motion.button>
                                        </div>
                                    ))}
                                </div>
                            </SettingsSection>

                            {/* Appearance */}
                            <SettingsSection title="Appearance" icon={FiMoon} color="#8b5cf6">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>Dark Mode</div>
                                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Toggle dark/light theme</div>
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            style={{
                                                width: '3rem',
                                                height: '1.5rem',
                                                borderRadius: '0.75rem',
                                                background: isDarkMode ? '#8b5cf6' : '#6b7280',
                                                border: 'none',
                                                cursor: 'pointer',
                                                position: 'relative',
                                            }}
                                        >
                                            <motion.div
                                                animate={{ x: isDarkMode ? '1.5rem' : '0.25rem' }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '0.25rem',
                                                    width: '1rem',
                                                    height: '1rem',
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                }}
                                            />
                                        </motion.button>
                                    </div>
                                </div>
                            </SettingsSection>

                            {/* Danger Zone */}
                            <SettingsSection title="Danger Zone" icon={FiTrash2} color="#ef4444">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDeleteAccount}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            background: 'transparent',
                                            border: '2px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <FiTrash2 /> Delete Account
                                    </motion.button>
                                </div>
                            </SettingsSection>

                            {/* Account Info */}
                            <SettingsSection title="Account Info" icon={FiDatabase} color="#06b6d4">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Email</div>
                                        <div style={{ fontWeight: '500', fontSize: '1rem' }}>{session?.user?.email}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>User ID</div>
                                        <div style={{ 
                                            fontWeight: '500', 
                                            fontSize: '0.9rem',
                                            fontFamily: 'monospace',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {session?.user?.id.substring(0, 20)}...
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Account Type</div>
                                        <div style={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                            color: '#667eea',
                                            fontWeight: '500',
                                            fontSize: '0.85rem',
                                        }}>
                                            <FiStar /> Pro Member
                                        </div>
                                    </div>
                                </div>
                            </SettingsSection>
                        </div>
                    </div>
                </section>
                
                {/* Footer (Same as Dashboard) */}
                <footer style={{ 
                    padding: '3rem 0', 
                    textAlign: 'center', 
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: '3rem',
                    fontSize: '0.9rem',
                }}>
                    © {new Date().getFullYear()} DevShowcase. Built with ❤ for developers.
                </footer>
            </main>
        </div>
    );
}       