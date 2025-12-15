// src/components/pages/Notifications.jsx
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
    FiCamera, FiImage, FiUploadCloud, FiXCircle, FiCheck, FiX as FiXIcon,
    FiThumbsUp, FiMessageCircle, FiGitBranch, FiUserPlus, FiAtSign
} from 'react-icons/fi';

// --- Custom CSS for Notifications (Same as Dashboard) ---
const notificationsStyles = `
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
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
    
    .notification-unread {
        background: rgba(102, 126, 234, 0.1);
        border-left: 3px solid #667eea;
        /* Subtle pulse for unread */
        /* animation: pulse 2s infinite; */ 
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

// --- Notification Item Component ---
const NotificationItem = ({ 
    id, 
    type, 
    // message prop removed as it's not fetched from DB and not strictly necessary
    isRead, 
    created_at, 
    sender, 
    project, 
    onMarkAsRead, 
    onDelete 
}) => {
    
    // --- Logic to construct message and link from fetched data ---
    let title = '';
    let linkTo = '/notifications'; // Default link
    let senderUsername = sender?.username || 'A user';
    let senderAvatar = sender?.avatar_url;
    let projectSlug = project?.slug;
    let projectTitle = project?.title;
    // Use a clear variable for the message to be displayed
    let displayMessage = ''; 

    switch (type) {
        case 'upvote': 
            title = 'New Upvote!';
            displayMessage = `${senderUsername} upvoted your project "${projectTitle}"`;
            linkTo = projectSlug ? `/p/${projectSlug}` : linkTo;
            break;
        case 'comment': 
            title = 'New Comment';
            displayMessage = `${senderUsername} commented on your project "${projectTitle}"`;
            linkTo = projectSlug ? `/p/${projectSlug}#comments` : linkTo;
            break;
        case 'follow': 
            title = 'New Follower';
            displayMessage = `${senderUsername} started following you.`;
            linkTo = senderUsername ? `/u/${senderUsername}` : linkTo;
            break;
        case 'mention': 
            title = 'You were mentioned';
            displayMessage = `${senderUsername} mentioned you in a comment on "${projectTitle}"`;
            linkTo = projectSlug ?`/p/${projectSlug}#comments` : linkTo;
            break;
        case 'featured': 
            title = 'Project Featured!';
            displayMessage = `Your project "${projectTitle}" has been featured on the homepage.`;
            linkTo = projectSlug ? `/p/${projectSlug}` : linkTo;
            break;
        case 'collab': 
            title = 'Collaboration Request';
            displayMessage = `${senderUsername} invited you to collaborate on "${projectTitle}"`;
            linkTo = projectSlug ? `/p/${projectSlug}/collab` : linkTo;
            break;
        default:
            title = 'New Activity';
            // Fallback for unknown/generic notification types
            displayMessage = 'An event occurred related to your account.';
    }

    const getNotificationIcon = () => {
        switch (type) {
            case 'upvote': return <FiThumbsUp style={{ color: '#10b981' }} />;
            case 'comment': return <FiMessageCircle style={{ color: '#3b82f6' }} />;
            case 'follow': return <FiUserPlus style={{ color: '#8b5cf6' }} />;
            case 'mention': return <FiAtSign style={{ color: '#f59e0b' }} />;
            case 'featured': return <FiStar style={{ color: '#eab308' }} />;
            case 'collab': return <FiGitBranch style={{ color: '#ec4899' }} />;
            default: return <FiBell style={{ color: '#667eea' }} />;
        }
    };

    const getNotificationColor = () => {
        switch (type) {
            case 'upvote': return '#10b981';
            case 'comment': return '#3b82f6';
            case 'follow': return '#8b5cf6';
            case 'mention': return '#f59e0b';
            case 'featured': return '#eab308';
            case 'collab': return '#ec4899';
            default: return '#667eea';
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffMs = now - notificationTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notificationTime.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`dashboard-glass-effect dashboard-card-hover ${!isRead ? 'notification-unread' : ''}`}
            style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                marginBottom: '1rem',
                position: 'relative',
                cursor: 'pointer',
            }}
            onClick={() => {
                // Navigate on click (only if project/user link exists)
                if (linkTo !== '/notifications') {
                    window.location.href = linkTo;
                }
                !isRead && onMarkAsRead(id);
            }}
        >
            {/* Unread indicator */}
            {!isRead && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#667eea',
                }} />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Notification Icon */}
                <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.75rem',
                    background: `${getNotificationColor()}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getNotificationColor(),
                    fontSize: '1.25rem',
                    flexShrink: 0,
                    marginTop: '0.25rem',
                }}>
                    {getNotificationIcon()}
                </div>

                {/* Notification Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ 
                            fontSize: '1rem', 
                            fontWeight: '600', 
                            color: 'var(--color-text)',
                            margin: 0,
                        }}>
                            {title}
                        </h3>
                        <span style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--color-text-muted)',
                            whiteSpace: 'nowrap',
                        }}>
                            {formatTime(created_at)}
                        </span>
                    </div>
                    
                    <p style={{ 
                        color: 'var(--color-text-muted)', 
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem',
                        lineHeight: '1.4',
                    }}>
                        {displayMessage}
                    </p>
                    
                    {/* User info */}
                    {sender && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: 'white',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                            }}>
                                {senderAvatar ? (
                                    <img 
                                        src={senderAvatar} 
                                        alt={senderUsername}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    senderUsername.charAt(0)
                                )}
                            </div>
                            <span style={{ 
                                fontSize: '0.85rem', 
                                color: 'var(--color-text-muted)',
                                fontWeight: '500',
                            }}>
                                @{senderUsername}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isRead && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(id);
                            }}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            title="Mark as read"
                        >
                            <FiCheck size={14} />
                        </motion.button>
                    )}
                    
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(id);
                        }}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Delete notification"
                    >
                        <FiXIcon size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Filter Button Component ---
const FilterButton = ({ label, icon: Icon, isActive, onClick, count }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            background: isActive ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: isActive ? '#667eea' : 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
        }}
    >
        {Icon && <Icon />}
        {label}
        {count > 0 && (
            <span style={{
                marginLeft: '0.5rem',
                background: isActive ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? 'white' : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: '1rem',
                fontWeight: '600',
            }}>
                {count}
            </span>
        )}
    </motion.button>
);

// --- Main Notifications Component ---
export default function NotificationsPage() {
    const { session, loading: authLoading, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Data Fetching: Profile (Dependency on session) ---
    useEffect(() => {
        const userId = session?.user?.id;

        if (!userId) {
            setLoading(false);
            setProfile(null); 
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, full_name, bio')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err instanceof Error ? err.message : err);
            }
        };

        fetchProfile();
    }, [session]); 

    // --- Data Fetching: Notifications (Dependency on session) ---
    const fetchNotifications = async () => {
        const userId = session?.user?.id;
        
        if (!userId) {
            setLoading(false);
            setNotifications([]);
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    id,
                    type,
                    read,
                    created_at,
                    sender:sender_id (username, avatar_url),
                    project:project_id (title, slug)
                `)
                .eq('recipient_id', userId) 
                .order('created_at', { ascending: false })
                .limit(50); 

            if (error) throw error;
            
            setNotifications(data || []);
            const unread = (data || []).filter(n => !n.read).length;
            setUnreadCount(unread);

        } catch (err) {
            console.error('Error fetching notifications:', err instanceof Error ? err.message : err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (session) {
            fetchNotifications();
        } else {
             setLoading(false);
             setNotifications([]);
             setUnreadCount(0);
        }
    }, [session]); 

    // --- Data Mutation: Mark As Read / Delete ---
    
    const handleMarkAsRead = async (id) => {
        const userId = session?.user?.id;
        if (!userId) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (!error) {
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } else {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const userId = session?.user?.id;
        if (!userId) return;

        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        
        if (unreadIds.length === 0) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('recipient_id', userId)
            .eq('read', false);

        if (!error) {
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
        } else {
             console.error('Error marking all notifications as read:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        const userId = session?.user?.id;
        if (!userId) return;

        const deletedNotif = notifications.find(n => n.id === id);
        
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)
            .eq('recipient_id', userId); 
            
        if (!error) {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
            if (deletedNotif && !deletedNotif.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } else {
            console.error('Error deleting notification:', error);
        }
    };

    const handleDeleteAll = async () => {
        const userId = session?.user?.id;
        if (!userId) return;

        if (!window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
            return;
        }

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('recipient_id', userId);

        if (!error) {
            setNotifications([]);
            setUnreadCount(0);
        } else {
             console.error('Error deleting all notifications:', error);
        }
    };

    // --- Filtering and Search Logic ---
    const filteredNotifications = notifications.filter(notification => {
        // 1. Filter by active filter
        if (activeFilter === 'unread' && notification.read) return false;
        if (activeFilter !== 'all' && activeFilter !== 'unread' && notification.type !== activeFilter) return false;

        // 2. Filter by search term
        const search = searchTerm.toLowerCase();
        // Since we removed 'message', we check against sender/project info.
        const notificationText = [
            notification.sender?.username,
            notification.project?.title,
            notification.type
        ].join(' ').toLowerCase();

        return notificationText.includes(search);
    });

    // Filter counts (based on ALL notifications, not filtered list)
    const filterCounts = {
        all: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        upvote: notifications.filter(n => n.type === 'upvote').length,
        comment: notifications.filter(n => n.type === 'comment').length,
        follow: notifications.filter(n => n.type === 'follow').length,
        mention: notifications.filter(n => n.type === 'mention').length,
    };

    // --- Render Logic ---
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
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to view notifications.</h2>
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
            <style>{notificationsStyles}</style>
            
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
                        isActive={true}
                        
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
                        isActive={false}
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
                            placeholder="Search notifications..."
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
                                {filterCounts.unread}
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

                {/* --- NOTIFICATIONS CONTENT --- */}
                <section style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                    
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: '3rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h1 style={{ 
                                fontSize: '3rem', 
                                fontWeight: 'bold', 
                                lineHeight: '1.2',
                            }}>
                                <span className="dashboard-gradient-text">Notifications</span>
                                {filterCounts.unread > 0 && (
                                    <span style={{
                                        marginLeft: '1rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        fontSize: '1rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontWeight: '600',
                                        verticalAlign: 'middle',
                                    }}>
                                        {filterCounts.unread} new
                                    </span>
                                )}
                            </h1>
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {filterCounts.unread > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleMarkAllAsRead}
                                        style={{
                                            ...secondaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        <FiCheck /> Mark all as read
                                    </motion.button>
                                )}
                                {notifications.length > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDeleteAll}
                                        style={{
                                            ...secondaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                            background: 'transparent',
                                            border: '2px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                        }}
                                    >
                                        <FiTrash2 /> Clear all
                                    </motion.button>
                                )}
                            </div>
                        </div>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                        }}>
                            Stay updated with your activity and community interactions.
                        </p>
                    </motion.div>

                    {/* Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ 
                            marginBottom: '2rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '1rem',
                        }}
                    >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <FilterButton 
                                label="All" 
                                icon={FiBell}
                                isActive={activeFilter === 'all'}
                                onClick={() => setActiveFilter('all')}
                                count={filterCounts.all}
                            />
                            <FilterButton 
                                label="Unread" 
                                icon={FiEye}
                                isActive={activeFilter === 'unread'}
                                onClick={() => setActiveFilter('unread')}
                                count={filterCounts.unread}
                            />
                            <FilterButton 
                                label="Upvotes" 
                                icon={FiThumbsUp}
                                isActive={activeFilter === 'upvote'}
                                onClick={() => setActiveFilter('upvote')}
                                count={filterCounts.upvote}
                            />
                            <FilterButton 
                                label="Comments" 
                                icon={FiMessageCircle}
                                isActive={activeFilter === 'comment'}
                                onClick={() => setActiveFilter('comment')}
                                count={filterCounts.comment}
                            />
                            <FilterButton 
                                label="Follows" 
                                icon={FiUserPlus}
                                isActive={activeFilter === 'follow'}
                                onClick={() => setActiveFilter('follow')}
                                count={filterCounts.follow}
                            />
                            <FilterButton 
                                label="Mentions" 
                                icon={FiAtSign}
                                isActive={activeFilter === 'mention'}
                                onClick={() => setActiveFilter('mention')}
                                count={filterCounts.mention}
                            />
                        </div>
                    </motion.div>

                    {/* Notifications List */}
                    <div className="dashboard-glass-effect" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                        {filteredNotifications.length > 0 ? (
                            <AnimatePresence>
                                {filteredNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        id={notification.id}
                                        type={notification.type}
                                        // message prop is no longer passed as it's not fetched
                                        isRead={notification.read}
                                        created_at={notification.created_at}
                                        sender={notification.sender}
                                        project={notification.project}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDeleteNotification}
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                <div style={{
                                    width: '6rem',
                                    height: '6rem',
                                    borderRadius: '50%',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    fontSize: '2.5rem',
                                    color: '#667eea',
                                }}>
                                    <FiBell />
                                </div>
                                <h3 style={{ 
                                    fontSize: '1.5rem', 
                                    fontWeight: 'bold', 
                                    marginBottom: '0.5rem',
                                    color: 'var(--color-text)',
                                }}>
                                    No notifications
                                </h3>
                                <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                                    {activeFilter === 'all' 
                                        ? "You're all caught up! Check back later for updates."
                                        : `No ${activeFilter} notifications found.`
                                    }
                                </p>
                                {activeFilter !== 'all' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter('all')}
                                        style={{
                                            ...primaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        View all notifications
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Stats Summary */}
                    {notifications.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                                marginTop: '2rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                            }}
                        >
                            <div className="dashboard-glass-effect" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                    {notifications.length}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Notifications</div>
                            </div>
                            
                            <div className="dashboard-glass-effect" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                    {filterCounts.unread}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Unread</div>
                            </div>
                            
                            <div className="dashboard-glass-effect" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                    {filterCounts.upvote}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Upvotes</div>
                            </div>
                            
                            <div className="dashboard-glass-effect" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                    {filterCounts.comment}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Comments</div>
                            </div>
                        </motion.div>
                    )}
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