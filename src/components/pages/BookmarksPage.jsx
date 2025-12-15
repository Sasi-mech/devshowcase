import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, FiMessageSquare,
    FiHeart, FiBookmark, FiBarChart2, FiCalendar, FiExternalLink, 
    FiThumbsUp, FiEye, FiGitBranch, FiClock, FiTag, FiFilter,
    FiGrid, FiList, FiTrendingUp, FiCode, FiZap, FiAward,
    FiActivity, FiUsers
} from 'react-icons/fi';

// --- Custom CSS for Bookmarks ---
const bookmarksStyles = `
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
    
    .bookmarks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .bookmarks-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .bookmark-tag {
        transition: all 0.2s ease;
    }
    
    .bookmark-tag:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .remove-bookmark-btn:hover {
        background: rgba(239, 68, 68, 0.2) !important;
        transform: rotate(90deg) !important;
    }
    
    .empty-bookmarks {
        background: rgba(255, 255, 255, 0.03);
        border: 2px dashed rgba(102, 126, 234, 0.3);
        padding: 4rem 2rem;
        border-radius: 1.5rem;
        text-align: center;
    }
    
    .search-input:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
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

// --- Bookmarked Project Card Component ---
const BookmarkedProjectCard = ({ project, user_id, onRemove }) => {
    // Handle nested data structure from JOIN
    const proj = project.projects || project;
    const profile = proj.profiles?.[0] || proj.profiles || {};
    
    if (!proj || !proj.id) return null;

    const handleRemoveBookmark = async () => {
        if (!window.confirm(`Remove "${proj.title}" from bookmarks?`)) return;

        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user_id)
                .eq('project_id', proj.id);

            if (error) throw error;

            // Call the onRemove callback to update state without reloading
            if (onRemove) {
                onRemove(proj.id);
            }

        } catch (error) {
            console.error('Error removing bookmark:', error);
            alert('Failed to remove bookmark: ' + error.message);
        }
    };
    
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Get tag color
    const getTagColor = (tag) => {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c5', 
            '#38b2ac', '#ed8936', '#ecc94b', '#48bb78', '#4299e1'
        ];
        const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };
    
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
                position: 'relative',
                height: '100%',
            }}
        >
            {/* Remove Button */}
            <motion.button
                onClick={handleRemoveBookmark}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="remove-bookmark-btn"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                }}
                title="Remove bookmark"
            >
                <FiX size={16} />
            </motion.button>
            
            {/* Project Title */}
            <Link to={`/project/${proj.id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                    paddingRight: '2.5rem',
                    lineHeight: '1.3',
                }}>
                    {proj.title}
                </h3>
            </Link>
            
            {/* Project Description */}
            <p style={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '0.9rem', 
                lineHeight: '1.5',
                flexGrow: 1,
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
            }}>
                {proj.description || 'No description available'}
            </p>
            
            {/* Project Tags */}
            {proj.tags && proj.tags.length > 0 && (
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                }}>
                    {proj.tags.slice(0, 4).map((tag, index) => (
                        <motion.span 
                            key={index} 
                            className="bookmark-tag"
                            whileHover={{ scale: 1.05 }}
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '2rem',
                                background: `rgba(${hexToRgb(getTagColor(tag))}, 0.1)`,
                                color: getTagColor(tag),
                                fontWeight: '500',
                                border: `1px solid rgba(${hexToRgb(getTagColor(tag))}, 0.2)`,
                            }}
                        >
                            {tag}
                        </motion.span>
                    ))}
                    {proj.tags.length > 4 && (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500',
                        }}>
                            +{proj.tags.length - 4}
                        </span>
                    )}
                </div>
            )}
            
            {/* Footer */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1rem',
                marginTop: 'auto',
            }}>
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        color: 'white',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        flexShrink: 0,
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
                    <div style={{ minWidth: 0 }}>
                        <div style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: '500', 
                            color: 'var(--color-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            @{profile.username || 'unknown'}
                        </div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            <FiClock size={10} /> {formatDate(proj.created_at)}
                        </div>
                    </div>
                </div>
                
                {/* Stats */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    fontSize: '0.85rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#667eea' }}>
                        <FiHeart size={14} /> {proj.votes_count || 0}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                        <FiMessageSquare size={14} /> {proj.comments_count || 0}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                        <FiEye size={14} /> {proj.views_count || 0}
                    </div>
                </div>
            </div>
            
            {/* Links */}
            {(proj.github_url || proj.live_url) && (
                <div style={{ 
                    display: 'flex', 
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                }}>
                    {proj.github_url && (
                        <a 
                            href={proj.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s ease',
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            <FiGitBranch size={14} /> Code
                        </a>
                    )}
                    
                    {proj.live_url && (
                        <a 
                            href={proj.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(102, 126, 234, 0.1)',
                                transition: 'all 0.3s ease',
                                flex: 1,
                                justifyContent: 'center',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                            }}
                        >
                            <FiExternalLink size={14} /> Live Demo
                        </a>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '102, 126, 234';
};

// --- Main Bookmarks Component ---
export default function BookmarksPage() {
    const { session, loading: authLoading, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');

    const user_id = session?.user?.id;
    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fetch bookmarks data
    useEffect(() => {
        if (!user_id) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            
            try {
                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, full_name, bio')
                    .eq('id', user_id)
                    .single();

                setProfile(profileData || {});

                // Fetch bookmarks with project and profile data
                const { data: bookmarkData, error } = await supabase
                    .from('bookmarks')
                    .select(`
                        id,
                        created_at,
                        projects (
                            id,
                            title,
                            description,
                            tags,
                            github_url,
                            live_url,
                            votes_count,
                            comments_count,
                            views_count,
                            created_at,
                            profiles (
                                username,
                                avatar_url
                            )
                        )
                    `)
                    .eq('user_id', user_id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Filter out null projects and transform data
                const validBookmarks = bookmarkData
                    .filter(b => b.projects !== null)
                    .map(b => ({
                        ...b,
                        projects: {
                            ...b.projects,
                            profiles: b.projects.profiles?.[0] || b.projects.profiles || {}
                        }
                    }));

                setBookmarks(validBookmarks);

            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    // Handle bookmark removal
    const handleRemoveBookmark = (projectId) => {
        setBookmarks(prev => prev.filter(b => b.projects.id !== projectId));
    };

    // Filter bookmarks based on search
    const filteredBookmarks = bookmarks.filter(bookmark => {
        const project = bookmark.projects;
        if (!project) return false;
        
        if (searchTerm === '') return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
            project.profiles.username.toLowerCase().includes(searchLower)
        );
    });

    // Get unique tags from bookmarked projects
    const uniqueTags = Array.from(new Set(
        bookmarks.flatMap(b => b.projects?.tags || [])
    )).slice(0, 10);

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
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to view bookmarks.</h2>
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
            <style>{bookmarksStyles}</style>
            
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
            
            {/* --- SIDEBAR --- */}
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
                            <FiBookmark /> {bookmarks.length} bookmarks
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
                        isActive={true}
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
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Bookmarks Stats</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{bookmarks.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Filtered</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{filteredBookmarks.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Unique Tags</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{uniqueTags.length}</span>
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
                            placeholder="Search bookmarks..."
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
                            className="search-input"
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

                {/* --- BOOKMARKS CONTENT --- */}
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
                                <span className="dashboard-gradient-text">Bookmarks</span>
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
                                    {filteredBookmarks.length} saved projects
                                </span>
                            </h1>
                            
                            {/* View Mode Toggle */}
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: '0.75rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                                        border: 'none',
                                        color: viewMode === 'grid' ? 'white' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <FiGrid size={16} /> Grid
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        background: viewMode === 'list' ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                                        border: 'none',
                                        color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <FiList size={16} /> List
                                </motion.button>
                            </div>
                        </div>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                            marginBottom: '1.5rem',
                        }}>
                            Your saved projects from the community. Click the X to remove them from your collection.
                        </p>
                        
                        {/* Tag Filters */}
                        {uniqueTags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter('all')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '2rem',
                                        background: activeFilter === 'all' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        color: activeFilter === 'all' ? 'white' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <FiFilter size={14} /> All
                                </motion.button>
                                {uniqueTags.map(tag => (
                                    <motion.button
                                        key={tag}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(tag)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '2rem',
                                            background: activeFilter === tag ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            border: 'none',
                                            color: activeFilter === tag ? 'white' : 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {tag}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Bookmarks Grid */}
                    {filteredBookmarks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="empty-bookmarks"
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
                                <FiBookmark />
                            </div>
                            <h3 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '0.5rem',
                                color: 'var(--color-text)',
                            }}>
                                {searchTerm ? 'No matching bookmarks' : 'No bookmarks yet'}
                            </h3>
                            <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                {searchTerm 
                                    ? `No bookmarks found for "${searchTerm}"`
                                    : "Discover amazing projects and save them for later!"
                                }
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                {searchTerm && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            ...secondaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        Clear search
                                    </motion.button>
                                )}
                                <Link to="/discover">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            ...primaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        <FiCompass /> Explore Projects
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'bookmarks-grid' : ''} 
                            style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1.5rem' } : {}}
                        >
                            <AnimatePresence>
                                {filteredBookmarks.map((bookmark) => (
                                    <BookmarkedProjectCard 
                                        key={bookmark.id} 
                                        project={bookmark} 
                                        user_id={user_id}
                                        onRemove={handleRemoveBookmark}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
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
                        {bookmarks.length} bookmarks • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </footer>
            </main>
        </div>
    );
}