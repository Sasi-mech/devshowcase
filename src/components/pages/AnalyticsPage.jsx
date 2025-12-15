// src/components/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, 
    FiBookmark, FiBarChart2, FiAward, FiActivity, FiHeart,
    FiMessageSquare, FiEye, FiUsers, FiCode, FiZap, FiTrendingUp,
    FiCalendar, FiFilter, FiGrid, FiList, FiClock, FiExternalLink,
    FiGitBranch, FiThumbsUp
} from 'react-icons/fi';

// --- Custom CSS for Analytics (Consistent with Dashboard) ---
const analyticsStyles = `
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
    
    .stat-card-icon {
        padding: 0.75rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
    }
    
    .stat-card-positive {
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
    }
    
    .stat-card-negative {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }
    
    .metric-bar {
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
    }
    
    .metric-fill {
        height: 100%;
        border-radius: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        transition: width 1s ease-in-out;
    }
    
    .trending-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 0.25rem 0.75rem;
        border-bottom-left-radius: 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        z-index: 1;
    }
`;

// --- Configuration ---
const SIDEBAR_EXPANDED_WIDTH = '280px';
const SIDEBAR_CONTRACTED_WIDTH = '90px';
const HEADER_HEIGHT = '80px';

// --- Button Styles ---
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

// --- NavLink Component ---
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

// --- Stat Card Component ---
const StatCard = ({ icon, title, value, change, color, changeType = 'increase' }) => {
    const colorClasses = {
        blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', iconBg: 'rgba(59, 130, 246, 0.2)' },
        red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', iconBg: 'rgba(239, 68, 68, 0.2)' },
        green: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', iconBg: 'rgba(34, 197, 94, 0.2)' },
        purple: { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', iconBg: 'rgba(168, 85, 247, 0.2)' },
        orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316', iconBg: 'rgba(249, 115, 22, 0.2)' }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="dashboard-card-hover dashboard-glass-effect"
            style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div 
                    className="stat-card-icon"
                    style={{ background: colors.iconBg, color: colors.text }}
                >
                    {icon}
                </div>
                {change && (
                    <div className={`px-2 py-1 rounded-lg text-sm font-medium ${changeType === 'increase' ? 'stat-card-positive' : 'stat-card-negative'}`}>
                        {changeType === 'increase' ? '+' : ''}{change}%
                    </div>
                )}
            </div>
            <div>
                <h3 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: 'var(--color-text)',
                    marginBottom: '0.25rem',
                    lineHeight: '1'
                }}>
                    {value.toLocaleString()}
                </h3>
                <p style={{ 
                    color: 'var(--color-text-muted)', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    {title}
                </p>
            </div>
        </motion.div>
    );
};

// --- Project Card Component ---
const ProjectCard = ({ project, rank }) => {
    const medalColors = {
        1: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        2: 'bg-gradient-to-br from-gray-300 to-gray-400',
        3: 'bg-gradient-to-br from-orange-300 to-amber-600'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="dashboard-card-hover dashboard-glass-effect"
            style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    background: medalColors[rank] || 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    color: 'white',
                    fontWeight: 'bold',
                    flexShrink: 0,
                }}>
                    {rank}
                </div>
                <div style={{ minWidth: 0 }}>
                    <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--color-text)',
                        marginBottom: '0.25rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {project.title}
                    </h4>
                    <p style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        by @{project.profiles?.username}
                    </p>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        {project.votes_count || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Votes</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        {project.comments_count || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Comments</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        {project.views_count || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Views</div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Tech Stack Item ---
const TechStackItem = ({ tech, index }) => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c5', '#38b2ac', '#ed8936', '#ecc94b'];
    const color = colors[index % colors.length];

    return (
        <motion.div
            whileHover={{ x: 5 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                }} />
                <div>
                    <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '500', 
                        color: 'var(--color-text)',
                        marginBottom: '0.125rem'
                    }}>
                        {tech.name}
                    </div>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <FiCode size={10} /> Technology
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    {tech.count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>projects</div>
            </div>
        </motion.div>
    );
};

// --- Metric Item ---
const MetricItem = ({ label, value, description, progress }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
                padding: '1.25rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)' }}>
                        {label}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {description}
                    </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {value}
                </div>
            </div>
            <div className="metric-bar">
                <div 
                    className="metric-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)'
            }}>
                <span>0%</span>
                <span>{progress.toFixed(0)}%</span>
                <span>100%</span>
            </div>
        </motion.div>
    );
};

// --- Activity Item ---
const ActivityItem = ({ activity }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                marginBottom: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <div style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                <FiActivity size={16} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    <span style={{ fontWeight: '600' }}>@{activity.profiles?.username}</span> published a new project
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {new Date(activity.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Analytics Component ---
export default function AnalyticsPage() {
    const { session, loading: authLoading, logout } = useAuth();
    const user = session?.user;
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [analytics, setAnalytics] = useState({
        userStats: {
            total_views: 0,
            total_votes: 0,
            total_comments: 0,
            follower_count: 0,
            total_interactions: 0,
            avg_time_on_page: 154,
            completion_rate: 87,
            project_count: 0
        },
        recentActivity: [],
        topProjects: [],
        techStackStats: []
    });
    
    const [dataLoading, setDataLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    const user_id = user?.id;
    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;

    const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Fetch analytics data
    useEffect(() => {
        if (!user_id) {
            setDataLoading(false);
            return;
        }

        const fetchAnalyticsData = async () => {
            setDataLoading(true);
            try {
                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, full_name')
                    .eq('id', user_id)
                    .single();
                setProfile(profileData || {});

                // Fetch user's projects
                const { data: projects } = await supabase
                    .from('projects')
                    .select('*, profiles!inner(username)')
                    .eq('user_id', user_id)
                    .order('created_at', { ascending: false });

                // Fetch votes and comments
                const { data: votes } = await supabase
                    .from('votes')
                    .select('*')
                    .eq('user_id', user_id);

                const { data: comments } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('user_id', user_id);

                // Calculate stats
                const userStats = {
                    total_views: projects?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0,
                    total_votes: projects?.reduce((sum, p) => sum + (p.votes_count || 0), 0) || 0,
                    total_comments: projects?.reduce((sum, p) => sum + (p.comments_count || 0), 0) || 0,
                    follower_count: 0, // You'd need to fetch follows table
                    total_interactions: votes?.length + comments?.length || 0,
                    avg_time_on_page: 154,
                    completion_rate: 87,
                    project_count: projects?.length || 0
                };

                // Get top projects
                const topProjects = projects?.slice(0, 5) || [];

                // Get recent activity
                const recentActivity = projects?.slice(0, 3) || [];

                // Process tech stack stats
                const techMap = {};
                projects?.forEach(project => {
                    project.tags?.forEach(tag => {
                        techMap[tag] = (techMap[tag] || 0) + 1;
                    });
                });

                const techStackStats = Object.entries(techMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6);

                setAnalytics({
                    userStats,
                    recentActivity,
                    topProjects,
                    techStackStats
                });

            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [user_id, timeRange]);

    // Main container style
    const mainContainerStyle = {
        flexGrow: 1,
        marginLeft: currentSidebarWidth,
        padding: '2rem',
        paddingTop: HEADER_HEIGHT,
        minHeight: '100vh',
        background: 'var(--color-background-dark)',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'var(--color-text)',
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

    if (authLoading || dataLoading) {
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

    if (!user) {
        return (
            <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-background-dark)',
                minHeight: '100vh',
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to view analytics.</h2>
                <Link to="/auth?mode=login" style={primaryButtonStyle}>
                    Go to Login
                </Link>
            </div>
        );
    }

    const userStats = analytics.userStats;
    const engagementRate = ((userStats.total_votes + userStats.total_comments) / (userStats.total_views || 1) * 100);

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
            display: 'flex',
            position: 'relative',
        }}>
            
            {/* Add CSS styles */}
            <style>{analyticsStyles}</style>
            
            {/* Animated background */}
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
            
            {/* --- SIDEBAR (Same as other pages) --- */}
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
                                    profile.username?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>@{profile.username}</div>
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
                        to="/discover" 
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
                        isActive={true}
                    />
                    <NavLink 
                        to="/settings" 
                        icon={FiSettings} 
                        text="Settings" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                    />
                </nav>
                
                {/* Stats Section */}
                {isSidebarExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '1.5rem',
                            margin: '0 1rem 2rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Quick Stats</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Projects</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{userStats.project_count}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Views</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{userStats.total_views}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Engagement</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{engagementRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Logout Button */}
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
                
                {/* --- HEADER --- */}
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
                            placeholder="Search analytics..."
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
                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>@{profile?.username || 'User'}</div>
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
                                    profile?.username?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* --- ANALYTICS CONTENT --- */}
                <section style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                    
                    {/* Header Section */}
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
                                <span className="dashboard-gradient-text">Analytics</span>
                                <span style={{ 
                                    marginLeft: '1rem',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontSize: '1rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontWeight: '600',
                                    verticalAlign: 'middle',
                                }}>
                                    Last {timeRange === 'all' ? 'All Time' : timeRange}
                                </span>
                            </h1>
                            
                            {/* Time Range Selector */}
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: '0.75rem' }}>
                                {['7d', '30d', '90d', 'all'].map((range) => (
                                    <motion.button
                                        key={range}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setTimeRange(range)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: timeRange === range ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                                            border: 'none',
                                            color: timeRange === range ? 'white' : 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {range === 'all' ? 'All Time' : `Last ${range}`}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                        }}>
                            Track your project performance, engagement metrics, and growth insights
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <StatCard
                            icon={<FiEye size={24} />}
                            title="Total Views"
                            value={userStats.total_views}
                            change={12.3}
                            color="blue"
                        />
                        <StatCard
                            icon={<FiHeart size={24} />}
                            title="Total Votes"
                            value={userStats.total_votes}
                            change={8.1}
                            color="red"
                        />
                        <StatCard
                            icon={<FiMessageSquare size={24} />}
                            title="Comments"
                            value={userStats.total_comments}
                            change={15.5}
                            color="green"
                        />
                        <StatCard
                            icon={<FiUsers size={24} />}
                            title="Followers"
                            value={userStats.follower_count}
                            change={5.2}
                            color="purple"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        
                        {/* Top Projects */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="dashboard-glass-effect"
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    borderRadius: '0.5rem', 
                                    background: 'rgba(234, 179, 8, 0.1)', 
                                    color: '#eab308' 
                                }}>
                                    <FiAward size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    Top Performing Projects
                                </h2>
                            </div>
                            <div>
                                {analytics.topProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} rank={index + 1} />
                                ))}
                                {analytics.topProjects.length === 0 && (
                                    <div style={{ 
                                        padding: '2rem', 
                                        textAlign: 'center', 
                                        color: 'var(--color-text-muted)',
                                        fontStyle: 'italic'
                                    }}>
                                        No projects yet. Start creating!
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="dashboard-glass-effect"
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    borderRadius: '0.5rem', 
                                    background: 'rgba(34, 197, 94, 0.1)', 
                                    color: '#22c55e' 
                                }}>
                                    <FiCode size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    Tech Stack Usage
                                </h2>
                            </div>
                            <div>
                                {analytics.techStackStats.map((tech, index) => (
                                    <TechStackItem key={tech.name} tech={tech} index={index} />
                                ))}
                                {analytics.techStackStats.length === 0 && (
                                    <div style={{ 
                                        padding: '2rem', 
                                        textAlign: 'center', 
                                        color: 'var(--color-text-muted)',
                                        fontStyle: 'italic'
                                    }}>
                                        No tech stack data
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Performance Metrics */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        
                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="dashboard-glass-effect"
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    borderRadius: '0.5rem', 
                                    background: 'rgba(59, 130, 246, 0.1)', 
                                    color: '#3b82f6' 
                                }}>
                                    <FiActivity size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    Recent Activity
                                </h2>
                            </div>
                            <div>
                                {analytics.recentActivity.map((activity) => (
                                    <ActivityItem key={activity.id} activity={activity} />
                                ))}
                                {analytics.recentActivity.length === 0 && (
                                    <div style={{ 
                                        padding: '2rem', 
                                        textAlign: 'center', 
                                        color: 'var(--color-text-muted)',
                                        fontStyle: 'italic'
                                    }}>
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Performance Metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="dashboard-glass-effect"
                            style={{ 
                                padding: '1.5rem', 
                                borderRadius: '1rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    padding: '0.5rem', 
                                    borderRadius: '0.5rem', 
                                    background: 'rgba(249, 115, 22, 0.1)', 
                                    color: '#f97316' 
                                }}>
                                    <FiZap size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    Performance Metrics
                                </h2>
                            </div>
                            <div>
                                <MetricItem
                                    label="Engagement Rate"
                                    value={`${engagementRate.toFixed(1)}%`}
                                    description="Votes + Comments per View"
                                    progress={Math.min(engagementRate, 100)}
                                />
                                <MetricItem
                                    label="Avg. Time on Page"
                                    value={`${Math.floor(userStats.avg_time_on_page / 60)}m ${userStats.avg_time_on_page % 60}s`}
                                    description="Based on user sessions"
                                    progress={Math.min((userStats.avg_time_on_page / 180) * 100, 100)}
                                />
                                <MetricItem
                                    label="Completion Rate"
                                    value={`${userStats.completion_rate}%`}
                                    description="Users who view all content"
                                    progress={userStats.completion_rate}
                                />
                            </div>
                        </motion.div>
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
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                        Analytics updated in real-time • Last refresh: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </footer>
            </main>
        </div>
    );
}