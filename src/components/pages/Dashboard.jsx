// src/components/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, FiMessageSquare,
    FiTrendingUp, FiActivity, FiHeart, FiCode, FiBookmark, FiUsers,
    FiChevronRight, FiZap, FiAward, FiCalendar, FiBarChart2
} from 'react-icons/fi';

// --- Custom CSS for Dashboard ---
const dashboardStyles = `
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
`;

// --- Configuration ---
const SIDEBAR_EXPANDED_WIDTH = '280px';
const SIDEBAR_CONTRACTED_WIDTH = '90px';
const HEADER_HEIGHT = '80px';

// --- Enhanced Button Styles ---
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

// --- Enhanced NavLink Component ---
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

// --- Project Card Component ---
const ProjectCard = ({ title, description, author, votes, comments, tags, isFeatured }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="dashboard-card-hover dashboard-glass-effect"
        style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
        }}
    >
        {isFeatured && (
            <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '0.25rem 1rem',
                borderBottomLeftRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
            }}>
                <FiStar /> Featured
            </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'white',
                        fontWeight: 'bold',
                    }}>
                        {author?.charAt(0) || 'U'}
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{author}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f97316' }}>
                    <FiHeart /> {votes}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)' }}>
                    <FiMessageSquare /> {comments}
                </div>
            </div>
        </div>
        
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {description}
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {/* Ensure tags is an array before mapping */}
            {Array.isArray(tags) && tags.map((tag, index) => (
                <span key={index} style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '2rem',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    fontWeight: '500',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                }}>
                    {tag}
                </span>
            ))}
        </div>
    </motion.div>
);

// --- Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="dashboard-glass-effect dashboard-card-hover"
        style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            textAlign: 'center',
        }}
    >
        <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            background: `linear-gradient(135deg, ${color.start}, ${color.end})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem',
            color: 'white',
            boxShadow: `0 10px 20px ${color.start}30`,
        }}>
            <Icon />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
            {value}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</div>
        {trend && (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
                color: trend > 0 ? '#10b981' : '#ef4444',
            }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
        )}
    </motion.div>
);

// --- Main Dashboard Component ---
export default function Dashboard() {
    const { session, loading: authLoading, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState('dashboard');
    
    // --- NEW STATE FOR SUPABASE DATA ---
    const [statsData, setStatsData] = useState([]);
    const [trendingProjects, setTrendingProjects] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

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
            } catch (err) {
                console.error('Error fetching profile:', err.message);
            }
        };

        fetchProfile();
    }, [user_id]);

    // --- Data Fetching: Dashboard Content (Stats, Projects, Activity) ---
    useEffect(() => {
        if (!user_id) return;

        const fetchDashboardContent = async () => {
            setLoading(true);
            try {
                // 1. Fetch Top Projects and User's Follower Count
                const [
                    projectsResponse, 
                    userFollowersResponse
                ] = await Promise.all([
                    // Fetch top 3 projects, joining with the project owner's profile
                    // Assuming 'profiles(username)' joins the project owner
                    supabase.from('projects')
                        .select(`
                            id, title, description, tags, is_featured, created_at,
                            author:profiles(username)
                        `)
                        .order('created_at', { ascending: false }) // Order by creation date
                        .limit(4),
                    
                    // Count followers for the current user (following_id = user_id)
                    supabase.from('follows')
                        .select('id', { count: 'exact' })
                        .eq('following_id', user_id),
                ]);

                if (projectsResponse.error) throw projectsResponse.error;
                if (userFollowersResponse.error) throw userFollowersResponse.error;

                const fetchedProjects = projectsResponse.data;
                const userProjectIds = fetchedProjects.filter(p => p.author.username === profile?.username).map(p => p.id);
                
                // Fetch Total Projects by User
                const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact' }).eq('user_id', user_id);

                // Fetch total votes and comments received by the user's projects.
                let totalVotesReceived = 0;
                let totalCommentsReceived = 0;

                if (userProjectIds.length > 0) {
                    const [votesResponse, commentsResponse] = await Promise.all([
                        // Count votes for the user's projects
                        supabase.from('votes').select('id', { count: 'exact' }).in('project_id', userProjectIds),
                        // Count comments for the user's projects
                        supabase.from('comments').select('id', { count: 'exact' }).in('project_id', userProjectIds),
                    ]);
                    
                    if (votesResponse.error) console.warn('Votes fetch error:', votesResponse.error);
                    if (commentsResponse.error) console.warn('Comments fetch error:', commentsResponse.error);
                    
                    totalVotesReceived = votesResponse.count || 0;
                    totalCommentsReceived = commentsResponse.count || 0;
                }
                
                // --- Prepare Stats Data (Trend is still mock for lack of historical data) ---
                const generatedStats = [
                    { title: 'Total Projects', value: totalProjects || 0, icon: FiCode, color: { start: '#667eea', end: '#764ba2' }, trend: 25 },
                    { title: 'Votes Received', value: totalVotesReceived, icon: FiHeart, color: { start: '#f093fb', end: '#f5576c' }, trend: 12 },
                    { title: 'Comments', value: totalCommentsReceived, icon: FiMessageSquare, color: { start: '#4facfe', end: '#00f2fe' }, trend: 8 },
                    { title: 'Followers', value: userFollowersResponse.count || 0, icon: FiUsers, color: { start: '#43e97b', end: '#38f9d7' }, trend: 15 },
                ];
                
                setStatsData(generatedStats);
                
                // --- Prepare Projects Data (Fetch vote/comment counts per project) ---
                const formattedProjects = await Promise.all(fetchedProjects.map(async (project) => {
                    const { count: projectVotesCount } = await supabase.from('votes').select('*', { count: 'exact' }).eq('project_id', project.id);
                    const { count: projectCommentsCount } = await supabase.from('comments').select('*', { count: 'exact' }).eq('project_id', project.id);

                    return {
                        title: project.title,
                        description: project.description,
                        author: project.author?.username || 'Unknown',
                        votes: projectVotesCount || 0,
                        comments: projectCommentsCount || 0,
                        tags: project.tags || [],
                        isFeatured: project.is_featured,
                    };
                }));
                
                setTrendingProjects(formattedProjects);
                
                // 2. Fetch Recent Activity (Simplification: last 4 comments and votes globally/on a large sample)
                const { data: activityData, error: activityError } = await supabase
                    .from('comments') 
                    .select('content, created_at, project:projects(title), user:profiles(username)')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (activityError) {
                    console.error('Error fetching activity:', activityError.message);
                } else {
                    const formattedActivity = activityData.map(item => ({
                        action: `${item.user.username} commented on "${item.project.title}"`,
                        time: new Date(item.created_at).toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' }),
                        icon: FiMessageSquare, 
                        color: '#4facfe',
                    }));
                    setRecentActivity(formattedActivity);
                }

            } catch (err) {
                console.error('Error fetching dashboard content:', err.message);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch dashboard content once profile is loaded to use profile?.username
        if (profile) {
            fetchDashboardContent();
        }
    }, [user_id, profile]); // Depend on profile to ensure we have the username

    // --- Animation Styles (no change) ---
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
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to view the dashboard.</h2>
                <Link to="/auth?mode=login" style={primaryButtonStyle}>
                    Go to Login
                </Link>
            </div>
        );
    }
    
    // Quick Actions remain hardcoded as they are navigation links
    const quickActions = [
        { title: 'New Project', description: 'Share your latest creation', icon: FiUpload, color: '#667eea', path: '/create' },
        { title: 'Explore Feed', description: 'Discover trending projects', icon: FiCompass, color: '#f093fb', path: '/feed' },
        { title: 'Notifications', description: 'Check your alerts', icon: FiBell, color: '#4facfe', path: '/notifications' },
        { title: 'Analytics', description: 'View your stats', icon: FiBarChart2, color: '#43e97b', path: '/analytics' },
    ];

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
            display: 'flex',
            position: 'relative',
        }}>
            {/* Add CSS styles */}
            <style>{dashboardStyles}</style>
            
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
            
            {/* --- ENHANCED SIDEBAR (no change) --- */}
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
                        isActive={true}
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
                
                {/* --- HEADER (no change) --- */}
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
                            placeholder="Search projects, developers, or tags..."
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

                {/* --- DASHBOARD CONTENT --- */}
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
                            Welcome back,{' '}
                            <span className="dashboard-gradient-text">{profile?.username || 'Developer'}! 👋</span>
                        </h1>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                        }}>
                            Here's what's happening with your projects and community activity.
                        </p>
                    </motion.div>

                    {/* Stats Grid (Updated to use statsData) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                            gap: '1.5rem', 
                            marginBottom: '3rem' 
                        }}
                    >
                        {statsData.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        
                        {/* Left Column: Projects Feed (Updated to use trendingProjects) */}
                        <div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                marginBottom: '1.5rem' 
                            }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                    <span className="dashboard-gradient-text">Trending Projects</span>
                                </h2>
                                <Link 
                                    to="/discover" 
                                    style={{
                                        ...secondaryButtonStyle,
                                        padding: '0.75rem 1.25rem',
                                    }}
                                >
                                    View All <FiChevronRight />
                                </Link>
                            </div>
                            
                            <div>
                                {trendingProjects.map((project, index) => (
                                    <ProjectCard key={index} {...project} />
                                ))}
                                {trendingProjects.length === 0 && (
                                    <div style={{ padding: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'center' }} className="dashboard-glass-effect">
                                        No projects found. Be the first to upload one!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Quick Actions & Activity */}
                        <div>
                            {/* Quick Actions (no change) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="dashboard-glass-effect"
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>⚡ Quick Actions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {quickActions.map((action, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => window.location.href = action.path}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '1rem',
                                                borderRadius: '0.75rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'var(--color-text)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = `rgba(${parseInt(action.color.slice(1, 3), 16)}, ${parseInt(action.color.slice(3, 5), 16)}, ${parseInt(action.color.slice(5, 7), 16)}, 0.1)`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            }}
                                        >
                                            <div style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '0.5rem',
                                                background: `${action.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: action.color,
                                                fontSize: '1.25rem',
                                            }}>
                                                <action.icon />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{action.title}</div>
                                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{action.description}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Activity (Updated to use recentActivity) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="dashboard-glass-effect"
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                }}
                            >
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📈 Recent Activity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {recentActivity.map((item, index) => (
                                        <div key={index} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '1rem',
                                            padding: '0.75rem',
                                            borderRadius: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                        }}>
                                            <div style={{
                                                width: '2.25rem',
                                                height: '2.25rem',
                                                borderRadius: '0.5rem',
                                                background: `${item.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: item.color,
                                            }}>
                                                <item.icon />
                                            </div>
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.action}</div>
                                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {recentActivity.length === 0 && (
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '0.5rem' }}>
                                            No recent activity to display.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* Footer */}
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